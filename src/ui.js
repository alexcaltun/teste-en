// Starea interfeței comune: mesajul de jos (toast) și dialogul de grupă.
import { reactive } from 'vue';

export const ui = reactive({
  toast: null, // { id, mesaj, anuleaza, titlu, vesel }
  dialogGrupa: null, // null | { grupa?: {...} }  (fără grupă = grupă nouă)
  meniuDeschis: false, // meniul lateral pe ecrane înguste
  meniuAscuns: false, // meniul lateral ascuns pe ecrane late
});

let cronometru = null;

/** `titlu` și `vesel` (Rapo zâmbește) sunt pentru mesajele de reușită: „Bravo!”, „Gata!”. */
export function arataToast(mesaj, anuleaza = null, { titlu = '', vesel = false } = {}) {
  clearTimeout(cronometru);
  ui.toast = { id: Date.now(), mesaj, anuleaza, titlu, vesel };
  cronometru = setTimeout(() => (ui.toast = null), 5000);
}

export function inchideToast() {
  clearTimeout(cronometru);
  ui.toast = null;
}

export function deschideDialogGrupa(grupa = null) {
  ui.dialogGrupa = { grupa };
}

export function inchideDialogGrupa() {
  ui.dialogGrupa = null;
}

export const culoareGrupa = (c) => `var(--group-${c || 'teal'})`;
export const numeGrupa = (g) => (g ? (g.descriere ? `${g.nume} · ${g.descriere}` : g.nume) : '');

/** Butonul ☰: pe ecrane înguste deschide meniul peste pagină, pe cele late îl ascunde. */
export function comutaMeniu() {
  if (window.matchMedia('(max-width: 900px)').matches) ui.meniuDeschis = !ui.meniuDeschis;
  else ui.meniuAscuns = !ui.meniuAscuns;
}
