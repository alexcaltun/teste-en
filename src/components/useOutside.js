// Închide un meniu la click în afară sau la Escape.
import { onBeforeUnmount, watch } from 'vue';

export function useInchidereExterioara(deschis, radacina, inchide) {
  const laClick = (e) => {
    if (radacina.value && !radacina.value.contains(e.target)) inchide();
  };
  const laTasta = (e) => {
    if (e.key === 'Escape') inchide(true);
  };
  const opreste = () => {
    document.removeEventListener('mousedown', laClick);
    document.removeEventListener('keydown', laTasta);
  };
  watch(deschis, (d) => {
    opreste();
    if (d) {
      document.addEventListener('mousedown', laClick);
      document.addEventListener('keydown', laTasta);
    }
  });
  onBeforeUnmount(opreste);
}
