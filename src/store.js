// Singurul loc care citește și scrie în localStorage.
// Forma: { grupe: [{ id, nume, descriere, culoare }],
//          facute: [{ id, grupaId, tip: 'subiect'|'test', itemId, data }],
//          grupaSelectata: '<id>' }
import { reactive, readonly } from 'vue';

const CHEIE = 'testeEN:v1';
export const CULORI = ['teal', 'indigo', 'amber', 'rose'];
export const NUME_CULORI = { teal: 'Verde-albastru', indigo: 'Indigo', amber: 'Chihlimbar', rose: 'Roșu' };

const stare = reactive({
  grupe: [],
  facute: [],
  grupaSelectata: null,
  /** false dacă localStorage nu merge (navigare privată, blocat) */
  salvareDisponibila: true,
});

function idNou(prefix) {
  const r = Math.random().toString(36).slice(2, 8);
  return `${prefix}${Date.now().toString(36)}${r}`;
}

function citeste() {
  try {
    const brut = window.localStorage.getItem(CHEIE);
    if (!brut) return;
    const d = JSON.parse(brut);
    stare.grupe = Array.isArray(d.grupe)
      ? d.grupe.filter((g) => g && g.id && g.nume).map((g) => ({
          id: String(g.id),
          nume: String(g.nume),
          descriere: g.descriere ? String(g.descriere) : '',
          culoare: CULORI.includes(g.culoare) ? g.culoare : 'teal',
        }))
      : [];
    const ids = new Set(stare.grupe.map((g) => g.id));
    stare.facute = Array.isArray(d.facute)
      ? d.facute.filter((f) => f && f.id && ids.has(f.grupaId) && (f.tip === 'subiect' || f.tip === 'test') && f.itemId && f.data)
      : [];
    stare.grupaSelectata = ids.has(d.grupaSelectata) ? d.grupaSelectata : stare.grupe[0]?.id ?? null;
  } catch {
    // date stricate sau localStorage blocat: pornim gol
  }
}

function scrie() {
  try {
    window.localStorage.setItem(
      CHEIE,
      JSON.stringify({ grupe: stare.grupe, facute: stare.facute, grupaSelectata: stare.grupaSelectata }),
    );
    stare.salvareDisponibila = true;
  } catch {
    stare.salvareDisponibila = false;
  }
}

function verificaDisponibil() {
  try {
    const k = `${CHEIE}:test`;
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

stare.salvareDisponibila = verificaDisponibil();
citeste();

// Alt tab deschis cu aplicația a schimbat datele
try {
  window.addEventListener('storage', (e) => {
    if (e.key === CHEIE) citeste();
  });
} catch {
  /* fără sincronizare între taburi */
}

export const store = readonly(stare);

// ---------- grupe ----------
export function adaugaGrupa({ nume, descriere, culoare }) {
  const g = {
    id: idNou('g'),
    nume: nume.trim(),
    descriere: (descriere || '').trim(),
    culoare: CULORI.includes(culoare) ? culoare : 'teal',
  };
  stare.grupe.push(g);
  if (!stare.grupaSelectata) stare.grupaSelectata = g.id;
  scrie();
  return g;
}

export function modificaGrupa(id, { nume, descriere, culoare }) {
  const g = stare.grupe.find((x) => x.id === id);
  if (!g) return;
  if (nume !== undefined) g.nume = nume.trim();
  if (descriere !== undefined) g.descriere = descriere.trim();
  if (culoare !== undefined && CULORI.includes(culoare)) g.culoare = culoare;
  scrie();
}

export function stergeGrupa(id) {
  stare.grupe = stare.grupe.filter((g) => g.id !== id);
  stare.facute = stare.facute.filter((f) => f.grupaId !== id);
  if (stare.grupaSelectata === id) stare.grupaSelectata = stare.grupe[0]?.id ?? null;
  scrie();
}

export function selecteazaGrupa(id) {
  if (!stare.grupe.some((g) => g.id === id)) return;
  stare.grupaSelectata = id;
  scrie();
}

// ---------- marcaje ----------
/** cel mai recent marcaj al grupei pentru un element, sau null */
export function marcaj(grupaId, tip, itemId) {
  let rez = null;
  for (const f of stare.facute)
    if (f.grupaId === grupaId && f.tip === tip && f.itemId === itemId && (!rez || f.data > rez.data)) rez = f;
  return rez;
}

/**
 * Setează exact grupele care au făcut elementul.
 * Întoarce o funcție de anulare și ce s-a schimbat.
 */
export function seteazaMarcaje(tip, itemId, grupaIds) {
  const dorite = new Set(grupaIds);
  const scoase = stare.facute.filter((f) => f.tip === tip && f.itemId === itemId && !dorite.has(f.grupaId));
  stare.facute = stare.facute.filter((f) => !scoase.includes(f));
  const noi = [];
  const acum = new Date().toISOString();
  for (const gid of dorite) {
    if (!stare.grupe.some((g) => g.id === gid)) continue;
    if (marcaj(gid, tip, itemId)) continue;
    const f = { id: idNou('f'), grupaId: gid, tip, itemId, data: acum };
    stare.facute.push(f);
    noi.push(f);
  }
  scrie();
  return {
    adaugate: noi.map((f) => f.grupaId),
    sterse: [...new Set(scoase.map((f) => f.grupaId))],
    anuleaza() {
      const idsNoi = new Set(noi.map((f) => f.id));
      const grupeExistente = new Set(stare.grupe.map((g) => g.id));
      stare.facute = stare.facute
        .filter((f) => !idsNoi.has(f.id))
        .concat(scoase.filter((f) => grupeExistente.has(f.grupaId)));
      scrie();
    },
  };
}

export function stergeMarcaj(id) {
  const f = stare.facute.find((x) => x.id === id);
  if (!f) return () => {};
  stare.facute = stare.facute.filter((x) => x.id !== id);
  scrie();
  return () => {
    if (stare.grupe.some((g) => g.id === f.grupaId) && !stare.facute.some((x) => x.id === f.id)) {
      stare.facute.push(f);
      scrie();
    }
  };
}
