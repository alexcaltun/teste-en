// Ia metadatele testelor de Evaluare Națională de pe e3.ro și scrie src/data/en.json.
// Face O SINGURĂ cerere la pagină. Nu descarcă PDF-uri: păstrează doar adresele lor.
//
//   npm run data                         → o cerere la e3.ro, scrie en.json, tipărește raportul
//   npm run data -- --din-fisier <cale>  → citește o copie salvată, fără nicio cerere
//   npm run data -- --salveaza <cale>    → în plus, salvează HTML-ul primit (pentru --din-fisier)

import * as cheerio from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SURSA = 'https://www.e3.ro/teste-evaluare-nationala-2022/';
const RADACINA = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const IESIRE = resolve(RADACINA, 'src/data/en.json');

// Rândurile de date numărate de mână pe 18 nov. 2026 (CLAUDE.md).
const ASTEPTAT_TESTE = {
  '2027': 2, '2026': 34, '2025': 23, '2024': 23, '2023': 33, '2022': 14,
  '2021A': 18, '2021B': 20, '2021C': 20, '2020': 41,
};

// ---------- argumente ----------
const args = process.argv.slice(2);
const arg = (nume) => {
  const i = args.indexOf(nume);
  return i >= 0 ? args[i + 1] : null;
};
const dinFisier = arg('--din-fisier');
const salveaza = arg('--salveaza');

// ---------- utilitare ----------
const spatii = (s) => (s || '').replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const faraDiacritice = (s) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[șş]/gi, 's').replace(/[țţ]/gi, 't');
const sus = (s) => faraDiacritice(s).toUpperCase();

function hash(str) {
  // FNV-1a pe 32 de biți → id scurt, stabil cât timp adresa PDF-ului nu se schimbă
  let h = 0x811c9dc5;
  for (const ch of str) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36).padStart(7, '0');
}

const ROMAN = { I: 1, II: 2, III: 3 };

// Cuvinte comune care, scrise cu MAJUSCULE în sursă, devin litere mici.
const CUVINTE_MICI = new Set([
  'TEST', 'TESTE', 'MODEL', 'SIMULARE', 'EXAMEN', 'REZERVA', 'INITIAL', 'BAREM',
  'MARTIE', 'APRILIE', 'MAI', 'FEBRUARIE', 'IANUARIE', 'IUNIE', 'NOIEMBRIE', 'DECEMBRIE',
  'SEPTEMBRIE', 'OCTOMBRIE', 'IULIE', 'AUGUST', 'DE', 'SI', 'LA', 'DIN',
]);
// Rămân cum sunt (abrevieri).
const ABREVIERI = /^(M\.E\.N\.|MEN|ICHB|ISJ|CCD|CN|E\.N\.|EN|BT-IS-VS|I|II|III)$/;

function numeFrumos(text) {
  let s = spatii(text);
  s = s.replace(/^test(\d+)$/i, 'Test $1'); // „test12” → „Test 12”
  s = s.replace(/\b(test)(\d+)/gi, '$1 $2'); // „Test1 (ICHB…)” → „Test 1 (ICHB…)”
  s = s.replace(/(\d)\(/g, '$1 ('); // „Test 4(ISJ” → „Test 4 (ISJ”
  s = s.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')'); // „(ISJ Dolj )” → „(ISJ Dolj)”
  s = s.replace(/\s+[–-]\s+/g, ' · '); // „Test 1 – ICHB” → „Test 1 · ICHB”
  s = s.replace(/(\d)\.\s+(\d{4})\b/g, '$1 · $2'); // „TEST 9. 2021” → „test 9 · 2021”
  const cuvinte = s.split(' ').map((w) => {
    const curat = w.replace(/^[(]+|[),.*:]+$/g, '');
    if (!curat || ABREVIERI.test(curat)) return w;
    const litere = curat.replace(/[^A-Za-zĂÂÎȘȚăâîșțŞşŢţ]/g, '');
    if (litere.length < 2 || litere !== litere.toUpperCase()) return w; // nu e scris cu majuscule
    const baza = sus(curat.replace(/[^A-Za-zĂÂÎȘȚăâîșțŞşŢţ.]/g, '')).replace(/\.$/, '');
    if (CUVINTE_MICI.has(baza)) return w.toLowerCase();
    if (/^EVALUARE[A]?$/.test(baza)) return w.charAt(0) + w.slice(1).toLowerCase();
    if (/^NATIONAL[A]?$/.test(baza) || baza === 'EV') return w.charAt(0) + w.slice(1).toLowerCase();
    // nume propriu (județ, oraș, școală) → prima literă mare
    return w.replace(/[A-Za-zĂÂÎȘȚăâîșțŞşŢţ]+/g, (p) => p.charAt(0) + p.slice(1).toLowerCase());
  });
  s = cuvinte.join(' ');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function tipTest(text) {
  const t = sus(text);
  // „EXAMEN”, „EVALUAREA NAȚIONALĂ” și variantele scrise pe e3.ro
  // („EVALUARE NATIONALA”, „EV. NAȚIONALĂ – rezerva”, „REZERVA E.N.”).
  if (/EXAMEN|EVALUAREA? NATIONALA|EV\. NATIONALA|REZERVA E\.N\./.test(t)) return 'Examen';
  if (/SIMULARE/.test(t)) return 'Simulare';
  if (/MODEL/.test(t)) return 'Model';
  return 'Test';
}

// ---------- încărcarea paginii ----------
async function incarca() {
  if (dinFisier) return { html: readFileSync(dinFisier, 'utf8'), cereri: 0 };
  const r = await fetch(SURSA, {
    headers: { 'User-Agent': 'TesteEN/1.0 (index personal, o cerere manuala)' },
  });
  if (!r.ok) throw new Error(`e3.ro a răspuns ${r.status}`);
  const html = await r.text();
  if (salveaza) {
    mkdirSync(dirname(resolve(salveaza)), { recursive: true });
    writeFileSync(salveaza, html);
  }
  return { html, cereri: 1 };
}

// ---------- parsare ----------
function parseaza(html) {
  const $ = cheerio.load(html);
  const baza = SURSA;
  const abs = (href) => {
    try { return new URL(href, baza).href; } catch { return null; }
  };
  const esteDocument = (href) => /\.pdf(\?|#|$)/i.test(href || '');

  const raport = {
    tabele: [],
    linkuriLipsa: [],
    neincadrate: [],
    suplimentareIgnorate: [],
    suspecte: [],
    tabeleIgnorate: [],
  };
  const teste = [];
  const subiecte = [];

  const celule = (tr) => $(tr).children('td,th').toArray();
  const linkuri = (cel) =>
    $(cel).find('a[href]').toArray().map((a) => ({ text: spatii($(a).text()), href: abs($(a).attr('href')) }));

  // Etichetă subiect: „Subiect I.1 (…)”, „Subiectul II.3”, „SUBIECTUL II. Exercitiul 3 (VI, triunghiul)”
  function citesteSubiect(text) {
    const t = spatii(text);
    let m = t.match(/^subiect(?:ul)?\s+(I{1,3})\s*\.\s*(?:exerci[tț]iul\s*)?([1-6])\b(.*)$/i);
    if (!m) return null;
    const subiect = m[1].toUpperCase();
    const exercitiu = Number(m[2]);
    let rest = m[3].trim();
    // primul grup de paranteze, cu paranteze echilibrate: „( E(x) )”
    let interior = null;
    if (rest.startsWith('(')) {
      let nivel = 0;
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === '(') nivel++;
        else if (rest[i] === ')' && --nivel === 0) {
          interior = rest.slice(1, i).trim();
          break;
        }
      }
    }
    let clasa = null;
    let tema = null;
    if (interior) {
      const mc = interior.match(/^(?:cl\.\s*)?(V|VI|VII|VIII)\b[\s,]*(.*)$/);
      if (mc) {
        clasa = mc[1];
        tema = mc[2].trim() || null;
      } else {
        tema = interior;
      }
    }
    return { subiect, exercitiu, clasa, tema };
  }

  function adaugaSubiect(an, set, cel, eticheta) {
    const text = spatii($(cel).text());
    if (!text || /^[–-]$/.test(text)) return 'gol';
    const info = citesteSubiect(text);
    if (!info) {
      raport.neincadrate.push({ eticheta, text, motiv: 'nu arată ca „Subiect X.N”' });
      return 'neincadrat';
    }
    const ls = linkuri(cel);
    const pdf = ls.find((l) => esteDocument(l.href));
    if (!pdf) {
      raport.linkuriLipsa.push({ eticheta, text, ce: 'PDF subiect' });
      return 'lipsa';
    }
    ls.filter((l) => l !== pdf).forEach((l) =>
      raport.suplimentareIgnorate.push({ eticheta, text, link: `${l.text} → ${l.href}` }),
    );
    const id = `s-${an}${set || ''}-${info.subiect}.${info.exercitiu}`;
    if (subiecte.some((s) => s.id === id)) {
      raport.neincadrate.push({ eticheta, text, motiv: `${info.subiect}.${info.exercitiu} apare de două ori` });
      return 'dublura';
    }
    // verificare: numele fișierului se potrivește cu eticheta? (doar semnalăm, nu corectăm)
    const fisier = decodeURIComponent(pdf.href.split('/').pop());
    const mf = fisier.match(/(?:SUBIECT[-_]?(I{1,3})[._](\d)|SUBIECT(\d)\.(\d)|S(\d)\.(\d)|\.(I{1,3})_?\.(\d)\.pdf)/i);
    if (mf) {
      const sf = mf[1] ? mf[1].toUpperCase() : mf[7] ? mf[7].toUpperCase() : ['', 'I', 'II', 'III'][Number(mf[3] || mf[5])];
      const ef = Number(mf[2] || mf[4] || mf[6] || mf[8]);
      if (sf !== info.subiect || ef !== info.exercitiu)
        raport.suspecte.push({ eticheta, text, motiv: `fișierul „${fisier}” pare să fie ${sf}.${ef}` });
    }
    const s = { id, an, set, subiect: info.subiect, exercitiu: info.exercitiu };
    if (info.clasa) s.clasa = info.clasa;
    if (info.tema) s.tema = info.tema;
    s.url = pdf.href;
    subiecte.push(s);
    return 'ok';
  }

  function adaugaTest(an, set, randuri, eticheta, coloane) {
    const [celNume, celBarem, celGrila] = coloane;
    const text = spatii($(celNume).text());
    if (!text) return 'gol';
    const ls = linkuri(celNume);
    const pdf = ls.find((l) => esteDocument(l.href));
    if (!pdf) {
      raport.neincadrate.push({ eticheta, text, motiv: ls.length ? `link fără PDF (${ls[0].href})` : 'fără link' });
      return 'neincadrat';
    }
    ls.filter((l) => l !== pdf).forEach((l) =>
      raport.suplimentareIgnorate.push({ eticheta, text, link: `${l.text || '(fără text)'} → ${l.href}` }),
    );
    const docLink = (cel, ce) => {
      if (!cel) return null;
      const t = spatii($(cel).text());
      const lb = linkuri(cel);
      const p = lb.find((l) => esteDocument(l.href));
      lb.filter((l) => l !== p).forEach((l) =>
        raport.suplimentareIgnorate.push({ eticheta, text: `${text} (${ce})`, link: `${l.text} → ${l.href}` }),
      );
      if (p) return p.href;
      if (t && !/^[–-]$/.test(t)) raport.linkuriLipsa.push({ eticheta, text, ce: `${ce} (scrie „${t}”, dar fără link)` });
      return null;
    };
    const urlBarem = docLink(celBarem, 'barem');
    const urlGrila = docLink(celGrila, 'grilă');
    const id = `t${an}${set || ''}-${hash(pdf.href)}`;
    if (teste.some((x) => x.id === id)) {
      raport.neincadrate.push({ eticheta, text, motiv: 'același PDF apare de două ori' });
      return 'dublura';
    }
    teste.push({
      id, an, set,
      numeOriginal: text,
      nume: numeFrumos(text),
      tip: tipTest(text),
      urlSubiect: pdf.href,
      urlBarem,
      urlGrila,
    });
    return 'ok';
  }

  $('table').each((_, tabel) => {
    const randuri = $(tabel).find('tr').toArray();
    if (!randuri.length) return;
    const antet = celule(randuri[0]).map((c) => spatii($(c).text()));
    const a0 = sus(antet[0] || '');
    const date = randuri.slice(1);

    // TESTE și BAREME <an> / TESTE <an> / TESTE 2021 (B)
    let m = a0.match(/^TESTE(?: SI BAREME)?\s+(20\d\d)\s*(?:\(([ABC])\))?$/);
    if (m) {
      const an = Number(m[1]);
      // 2021 (B) și (C): testele și subiectele stau în același tabel
      const set = m[2] || null;
      const cheie = `${an}${set || ''}`;
      const eticheta = antet[0];
      const t = { eticheta, cheie, randuri: date.length, teste: 0, subiecte: 0, goale: 0, neincadrate: 0 };
      const combinat = set === 'B' || set === 'C';
      for (const tr of date) {
        const c = celule(tr);
        const r = adaugaTest(an, set, c, eticheta, combinat ? [c[0]] : [c[0], c[1], c[2]]);
        if (r === 'ok') t.teste++;
        else if (r === 'gol') t.goale++;
        else t.neincadrate++;
        if (combinat && c[1]) {
          const rs = adaugaSubiect(an, set, c[1], antet[1] || eticheta);
          if (rs === 'ok') t.subiecte++;
        }
      }
      t.asteptat = ASTEPTAT_TESTE[cheie] ?? null;
      raport.tabele.push(t);
      return;
    }

    // SUBIECTE <an> / SUBIECTE 2021 (A)
    m = a0.match(/^SUBIECTE\s+(20\d\d)\s*(?:\(([ABC])\))?$/);
    if (m) {
      const an = Number(m[1]);
      const set = m[2] || (an === 2021 ? 'A' : null);
      const eticheta = antet[0];
      const t = { eticheta, cheie: `S${an}${set || ''}`, randuri: date.length, teste: 0, subiecte: 0, goale: 0, neincadrate: 0 };
      for (const tr of date) {
        const c = celule(tr);
        const r = adaugaSubiect(an, set, c[0], eticheta);
        if (r === 'ok') t.subiecte++;
        else if (r === 'gol') t.goale++;
        else t.neincadrate++;
        // a doua coloană (ex. 2023 „+”) are doar materiale suplimentare
        for (const extra of c.slice(1)) {
          linkuri(extra).forEach((l) =>
            raport.suplimentareIgnorate.push({ eticheta, text: spatii($(c[0]).text()), link: `${l.text} → ${l.href}` }),
          );
        }
      }
      t.asteptat = 18;
      raport.tabele.push(t);
      return;
    }

    raport.tabeleIgnorate.push(`${antet[0] || '(fără antet)'} (${date.length} rânduri)`);
  });

  // Programa: linkul „Programa EVALUARE NATIONALA” din meniul site-ului
  const prog = $('a[href]')
    .toArray()
    .find((a) => /PROGRAMA EVALUARE NATIONALA/.test(sus(spatii($(a).text()))));
  const programa = prog ? abs($(prog).attr('href')) : null;
  if (!programa) raport.linkuriLipsa.push({ eticheta: 'meniu', text: 'Programa EVALUARE NATIONALA', ce: 'link' });

  return { teste, subiecte, programa, raport };
}

// ---------- raport ----------
function tiparesteRaport({ teste, subiecte, programa, raport }, cereri) {
  const L = [];
  const p = (s = '') => L.push(s);
  p('');
  p('RAPORT — date e3.ro');
  p(`Cereri la e3.ro în această rulare: ${cereri}`);
  p('');
  p('Tabele de teste (rânduri de date fără antet):');
  p('  tabel                      rânduri  așteptat  teste  goale  neîncadrate');
  for (const t of raport.tabele.filter((x) => !x.cheie.startsWith('S'))) {
    const ok = t.asteptat === t.randuri ? '✔' : '✘';
    p(`  ${t.eticheta.padEnd(26)} ${String(t.randuri).padStart(7)}  ${String(t.asteptat ?? '?').padStart(8)} ${ok} ${String(t.teste).padStart(5)}  ${String(t.goale).padStart(5)}  ${String(t.neincadrate).padStart(11)}`);
  }
  const lipsaAni = Object.keys(ASTEPTAT_TESTE).filter((k) => !raport.tabele.some((t) => t.cheie === k));
  if (lipsaAni.length) p(`  ✘ Tabele de teste negăsite: ${lipsaAni.join(', ')}`);
  p('');
  p('Subiecte pe exerciții (din 18 posibile per an/set):');
  const grupe = {};
  for (const s of subiecte) grupe[`${s.an}${s.set ? ' (' + s.set + ')' : ''}`] = (grupe[`${s.an}${s.set ? ' (' + s.set + ')' : ''}`] || 0) + 1;
  for (const an of [2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020]) {
    const chei = Object.keys(grupe).filter((k) => k.startsWith(String(an)));
    if (!chei.length) p(`  ${an}: 0  (fără subiecte pe exerciții)`);
    for (const k of chei.sort()) {
      const lipsa = [];
      const [aa, ss] = [an, (k.match(/\((\w)\)/) || [])[1] || null];
      for (const sub of ['I', 'II', 'III'])
        for (let e = 1; e <= 6; e++)
          if (!subiecte.some((s) => s.an === aa && s.set === ss && s.subiect === sub && s.exercitiu === e)) lipsa.push(`${sub}.${e}`);
      p(`  ${k.padEnd(9)} ${String(grupe[k]).padStart(2)} / 18${lipsa.length ? '  lipsesc: ' + lipsa.join(', ') : '  ✔'}`);
    }
  }
  p('');
  const tipuri = teste.reduce((a, t) => ((a[t.tip] = (a[t.tip] || 0) + 1), a), {});
  p(`Total: ${teste.length} teste (${Object.entries(tipuri).map(([k, v]) => `${k} ${v}`).join(', ')}), ${subiecte.length} subiecte, ${teste.filter((t) => t.urlBarem).length} cu barem, ${teste.filter((t) => t.urlGrila).length} cu grilă`);
  p(`Subiecte cu temă: ${subiecte.filter((s) => s.tema).length}, cu clasă: ${subiecte.filter((s) => s.clasa).length}`);
  p(`Programa: ${programa || '✘ negăsită'}`);
  p('');
  p(`Linkuri lipsă (${raport.linkuriLipsa.length}):`);
  raport.linkuriLipsa.forEach((x) => p(`  - [${x.eticheta}] ${x.text}: ${x.ce}`));
  p('');
  p(`Rânduri neîncadrate (${raport.neincadrate.length}):`);
  raport.neincadrate.forEach((x) => p(`  - [${x.eticheta}] „${x.text}”: ${x.motiv}`));
  p('');
  p(`Etichete care nu se potrivesc cu numele fișierului (${raport.suspecte.length}) — doar semnalate:`);
  raport.suspecte.forEach((x) => p(`  - [${x.eticheta}] „${x.text}”: ${x.motiv}`));
  p('');
  p(`Linkuri suplimentare ignorate (${raport.suplimentareIgnorate.length}) — fișe, rezolvări, YouTube etc.:`);
  raport.suplimentareIgnorate.forEach((x) => p(`  - [${x.eticheta}] ${x.text}: ${x.link}`));
  p('');
  p(`Tabele ignorate (nu sunt teste/subiecte EN pe ani): ${raport.tabeleIgnorate.join('; ') || '—'}`);
  p('');
  console.log(L.join('\n'));
}

// ---------- main ----------
const { html, cereri } = await incarca();
const rezultat = parseaza(html);
const azi = new Date().toISOString().slice(0, 10);
const ordineSet = (s) => (s ? s.charCodeAt(0) : 0);
rezultat.subiecte.sort(
  (a, b) => b.an - a.an || ordineSet(a.set) - ordineSet(b.set) || ROMAN[a.subiect] - ROMAN[b.subiect] || a.exercitiu - b.exercitiu,
);
const json = {
  actualizat: azi,
  sursa: SURSA,
  programa: rezultat.programa,
  teste: rezultat.teste,
  subiecte: rezultat.subiecte,
};
mkdirSync(dirname(IESIRE), { recursive: true });
writeFileSync(IESIRE, JSON.stringify(json, null, 2) + '\n');
tiparesteRaport(rezultat, cereri);
console.log(`Scris: ${IESIRE}`);
