<script setup>
// Rapo, mascota aplicației: un raportor cu ochi (desen original).
import { computed } from 'vue';

const props = defineProps({
  size: { type: Number, default: 120 },
  mood: { type: String, default: 'normal' }, // 'normal' | 'vesel'
  decorativ: { type: Boolean, default: true },
});

const INK = '#2B2140';
const inaltime = computed(() => Math.round((props.size * 92) / 120));
const gradatii = [];
for (let deg = 15; deg < 180; deg += 15) {
  const a = (deg * Math.PI) / 180;
  const r1 = deg % 45 === 0 ? 40 : 44;
  gradatii.push({
    x1: (60 + r1 * Math.cos(a)).toFixed(1),
    y1: (70 - r1 * Math.sin(a)).toFixed(1),
    x2: (60 + 49 * Math.cos(a)).toFixed(1),
    y2: (70 - 49 * Math.sin(a)).toFixed(1),
  });
}
</script>

<template>
  <svg
    class="rapo"
    :width="size"
    :height="inaltime"
    viewBox="0 0 120 92"
    :role="decorativ ? undefined : 'img'"
    :aria-hidden="decorativ ? 'true' : undefined"
    :aria-label="decorativ ? undefined : 'Rapo, raportorul'"
  >
    <rect x="40" y="70" width="10" height="16" rx="5" :fill="INK" />
    <rect x="70" y="70" width="10" height="16" rx="5" :fill="INK" />
    <path d="M10 70 A50 50 0 0 1 110 70 Z" fill="#FACC15" :stroke="INK" stroke-width="4" stroke-linejoin="round" />
    <g :stroke="INK" stroke-width="2.5" stroke-linecap="round">
      <line v-for="(g, i) in gradatii" :key="i" :x1="g.x1" :y1="g.y1" :x2="g.x2" :y2="g.y2" />
    </g>
    <ellipse cx="34" cy="58" rx="5.5" ry="3.5" fill="#F9A8D4" />
    <ellipse cx="86" cy="58" rx="5.5" ry="3.5" fill="#F9A8D4" />
    <template v-if="mood === 'vesel'">
      <path d="M39 47 Q47 37 55 47" fill="none" :stroke="INK" stroke-width="4" stroke-linecap="round" />
      <path d="M65 47 Q73 37 81 47" fill="none" :stroke="INK" stroke-width="4" stroke-linecap="round" />
      <path d="M50 54 H70 Q70 65 60 65 Q50 65 50 54 Z" :fill="INK" />
      <ellipse cx="60" cy="61.5" rx="5" ry="3" fill="#F472B6" />
    </template>
    <template v-else>
      <g v-for="cx in [47, 73]" :key="cx">
        <circle :cx="cx" cy="44" r="9" fill="#FFFFFF" :stroke="INK" stroke-width="3" />
        <circle :cx="cx + 2" cy="45" r="4.5" :fill="INK" />
        <circle :cx="cx + 3.5" cy="43" r="1.4" fill="#FFFFFF" />
      </g>
      <path d="M52 56 Q60 63 68 56" fill="none" :stroke="INK" stroke-width="3.5" stroke-linecap="round" />
    </template>
  </svg>
</template>

<style scoped>
.rapo {
  flex-shrink: 0;
  overflow: visible;
}
</style>
