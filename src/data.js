// Datele din en.json, cu corecturile din overrides.json aplicate peste ele.
import en from './data/en.json';
import overrides from './data/overrides.json';

const TIPURI = ['Examen', 'Simulare', 'Model', 'Test'];

export const teste = en.teste.map((t) => {
  const o = overrides[t.id] || {};
  return {
    ...t,
    nume: typeof o.nume === 'string' && o.nume.trim() ? o.nume.trim() : t.nume,
    tip: TIPURI.includes(o.tip) ? o.tip : t.tip,
  };
});
export const subiecte = en.subiecte;
export const programa = en.programa;
export const actualizat = en.actualizat;
export const sursa = en.sursa;

export const ANI = [2027, 2026, 2025, 2024, 2023, 2022, 2021, 2020];
export const SUBIECTE = ['I', 'II', 'III'];
export const EXERCITII = [1, 2, 3, 4, 5, 6];
export const SETURI = ['A', 'B', 'C'];
export const NUMAR_EXERCITII = 18;

export const aniCuSubiecte = ANI.filter((an) => subiecte.some((s) => s.an === an));
/** cel mai recent an care are subiecte pe exerciții */
export const anImplicitSubiecte = aniCuSubiecte[0] ?? ANI[0];
/** cel mai recent an care are teste */
export const anImplicitTeste = ANI.find((an) => teste.some((t) => t.an === an)) ?? ANI[0];

/** Ce teste acoperă fiecare set din 2021 (din descrierea paginii e3.ro) */
export const DESCRIERE_SET = { B: 'testele 1–20', C: 'testele 21–40' };

export const subiectDupaId = new Map(subiecte.map((s) => [s.id, s]));
export const testDupaId = new Map(teste.map((t) => [t.id, t]));

export const eticheta = (s) => `${s.subiect}.${s.exercitiu}`;
export const etichetaSet = (set) => (set ? `Set ${set}` : '');

/** text fără diacritice, cu litere mici, pentru căutări */
export function normalizeaza(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[șş]/gi, 's')
    .replace(/[țţ]/gi, 't')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------- date calendaristice ----------
const LUNI = ['ian.', 'feb.', 'mar.', 'apr.', 'mai', 'iun.', 'iul.', 'aug.', 'sept.', 'oct.', 'nov.', 'dec.'];

const ziLocala = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

/** „azi”, „12 nov.” sau „12 nov. 2025” (alt an) */
export function dataScurta(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const acum = new Date();
  if (ziLocala(d) === ziLocala(acum)) return 'azi';
  const baza = `${d.getDate()} ${LUNI[d.getMonth()]}`;
  return d.getFullYear() === acum.getFullYear() ? baza : `${baza} ${d.getFullYear()}`;
}

/** „12 nov. 2026” */
export function dataLunga(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getDate()} ${LUNI[d.getMonth()]} ${d.getFullYear()}`;
}

/** „3 exerciții”, „1 exercițiu”, „22 de teste” */
export function plural(n, unu, multe) {
  if (n === 1) return `1 ${unu}`;
  const de = n % 100 >= 20 || n % 100 === 0 ? 'de ' : '';
  return `${n} ${de}${multe}`;
}

// ---------- căutarea din bara de sus ----------
const ROMAN = { i: 'I', ii: 'II', iii: 'III' };

/**
 * Transformă textul căutat într-o destinație: { path, query } sau null.
 * Înțelege „2021 II.3”, „ii 3 2021”, „II.3”, „2021”, „set b”, o temă sau un loc.
 */
export function interpreteaza(text) {
  let q = normalizeaza(text);
  if (!q) return null;

  let an = null;
  const mAn = q.match(/\b(20\d\d)\b/);
  if (mAn && ANI.includes(Number(mAn[1]))) {
    an = Number(mAn[1]);
    q = q.replace(mAn[0], ' ');
  }

  let set = null;
  const mSet = q.match(/\bset\s*([abc])\b/);
  if (mSet) {
    set = mSet[1].toUpperCase();
    q = q.replace(mSet[0], ' ');
  }

  let s = null;
  let ex = null;
  // „subiectul ii exercitiul 3”, „s ii 3”, „ii.3”, „ii 3”, „ii3”
  q = q.replace(/\bsubiect(ul)?\b/g, ' ').replace(/\bexercitiu(l)?\b|\bex\.?/g, ' ');
  const mEx = q.match(/(?:^|[^a-z])(iii|ii|i)\s*[.\s/-]?\s*([1-6])(?![0-9])/);
  if (mEx) {
    s = ROMAN[mEx[1]];
    ex = Number(mEx[2]);
    q = q.replace(mEx[0], ' ');
  } else {
    const mS = q.match(/^\s*(iii|ii|i)\s*$/);
    if (mS) {
      s = ROMAN[mS[1]];
      q = '';
    }
  }
  q = q.replace(/\s+/g, ' ').trim();

  if (s || (an && !q)) {
    const anFinal = an ?? anImplicitSubiecte;
    // un an fără subiecte pe exerciții (2027) are doar teste
    if (!s && !aniCuSubiecte.includes(anFinal)) return { path: '/teste', query: { an: String(anFinal) } };
    const query = { an: String(anFinal) };
    if (s) query.s = s;
    if (ex) query.ex = String(ex);
    if (set && anFinal === 2021) query.set = set;
    return { path: '/subiecte', query };
  }

  if (!q) return null;

  // temă sau loc
  const potrivesteSubiect = (x) => (!an || x.an === an) && normalizeaza(`${x.tema || ''} ${x.clasa ? 'cl. ' + x.clasa : ''}`).includes(q);
  const potrivesteTest = (x) => (!an || x.an === an) && normalizeaza(`${x.nume} ${x.numeOriginal}`).includes(q);
  const nS = subiecte.filter(potrivesteSubiect).length;
  const nT = teste.filter(potrivesteTest).length;
  if (!nS && !nT) return { path: '/teste', query: { ...(an ? { an: String(an) } : {}), q: text.trim() }, gol: true };
  // în adresă păstrăm textul cum l-a scris utilizatorul (cu diacritice), fără an
  const query = { q: text.replace(/\b20\d\d\b/, ' ').replace(/\s+/g, ' ').trim() || q };
  if (an) query.an = String(an);
  return nS >= nT ? { path: '/subiecte', query } : { path: '/teste', query };
}

export function potrivesteSubiect(x, q) {
  return normalizeaza(`${x.tema || ''} ${x.clasa ? 'cl. ' + x.clasa : ''}`).includes(normalizeaza(q));
}
export function potrivesteTest(x, q) {
  return normalizeaza(`${x.nume} ${x.numeOriginal}`).includes(normalizeaza(q));
}
