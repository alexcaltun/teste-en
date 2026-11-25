<script setup>
// Confetti (elev): ~90 bucăți colorate cad peste pagină timp de 3 secunde. Nu blochează click-urile.
import { ref, watch, onBeforeUnmount } from 'vue';
import { ui } from '../ui.js';

const CULORI = ['#7C3AED', '#FACC15', '#15803D', '#DB2777', '#0EA5E9', '#F97316'];
const piese = ref([]);
let cronometru = null;

watch(
  () => ui.confetti,
  (moment) => {
    if (!moment) return;
    piese.value = Array.from({ length: 90 }, (_, i) => {
      const w = 6 + Math.random() * 6;
      return {
        id: `${moment}-${i}`,
        stil: {
          left: `${Math.random() * 100}%`,
          width: `${w}px`,
          height: `${i % 3 === 0 ? w : w * 1.6}px`,
          background: CULORI[i % CULORI.length],
          borderRadius: i % 3 === 0 ? '999px' : '2px',
          animationDelay: `${Math.random() * 0.5}s`,
          animationDuration: `${1.8 + Math.random() * 1.4}s`,
          '--dx': `${(Math.random() - 0.5) * 180}px`,
          '--rot': `${360 + Math.random() * 720}deg`,
        },
      };
    });
    clearTimeout(cronometru);
    cronometru = setTimeout(() => (piese.value = []), 3800);
  },
);
onBeforeUnmount(() => clearTimeout(cronometru));
</script>

<template>
  <div v-if="piese.length" class="confetti" aria-hidden="true">
    <span v-for="p in piese" :key="p.id" class="confetti__p" :style="p.stil"></span>
  </div>
</template>

<style scoped>
.confetti {
  position: fixed;
  inset: 0;
  z-index: 39;
  overflow: hidden;
  pointer-events: none;
}
.confetti__p {
  position: absolute;
  top: -20px;
  opacity: 0;
  animation-name: cade;
  animation-timing-function: cubic-bezier(0.25, 0.6, 0.45, 1);
  animation-fill-mode: forwards;
}
@keyframes cade {
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0deg);
  }
  85% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(var(--dx), 105vh) rotate(var(--rot));
  }
}
@media (prefers-reduced-motion: reduce) {
  .confetti {
    display: none;
  }
}
</style>
