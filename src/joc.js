// Elev: seria de zile la rând și momentele de sărbătorit. Totul se calculează din bife, fără date noi.
import { subiecte, teste } from './data.js';
import { bifa } from './store.js';

const zi = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * Câte zile la rând (până azi) are cel puțin o bifă.
 * Dacă azi nu e încă nimic bifat, seria de până ieri e încă în viață: `azi` e false.
 */
export function serie(bifate, acum = new Date()) {
  const zile = new Set(bifate.map((b) => zi(new Date(b.data))));
  const d = new Date(acum);
  const azi = zile.has(zi(d));
  if (!azi) d.setDate(d.getDate() - 1);
  let n = 0;
  while (zile.has(zi(d))) {
    n += 1;
    d.setDate(d.getDate() - 1);
  }
  return { zile: n, azi };
}

const toateBifate = (tip, lista) => lista.length > 0 && lista.every((x) => bifa(tip, x.id));

/** După o bifă pe un exercițiu: s-a terminat subiectul (din anul și setul lui) sau tot anul? */
export function terminatSubiect(x) {
  const dinAn = subiecte.filter((s) => s.an === x.an);
  return {
    an: toateBifate('subiect', dinAn),
    subiect: toateBifate('subiect', dinAn.filter((s) => s.set === x.set && s.subiect === x.subiect)),
  };
}

/** După o bifă pe un test: s-au terminat toate testele din an? */
export function terminatTeste(t) {
  return { an: toateBifate('test', teste.filter((x) => x.an === t.an)) };
}
