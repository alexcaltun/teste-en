<script setup>
// Elev: cardul „Progresul tău”, cu Rapo, seria de zile la rând și bara mare.
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import Rapo from './Rapo.vue';
import Icon from './Icon.vue';
import { store } from '../store.js';
import { serie } from '../joc.js';
import { plural } from '../data.js';

const props = defineProps({
  titlu: { type: String, required: true },
  value: { type: Number, required: true },
  max: { type: Number, required: true },
  unitate: { type: String, required: true }, // „exerciții bifate”
  indemn: { type: String, default: '' },
});
const pct = computed(() => (props.max ? Math.round((props.value / props.max) * 100) : 0));
const gata = computed(() => props.max > 0 && props.value >= props.max);

// seria: zile consecutive cu cel puțin o bifă
const s = computed(() => serie(store.bifate));
const textSerie = computed(() => `${plural(s.value.zile, 'zi', 'zile')} la rând`);

// când crește, bara strălucește și numărul „sare”
const creste = ref(false);
let cronometru = null;
watch(
  () => props.value,
  (nou, vechi) => {
    if (nou <= vechi) return;
    creste.value = false;
    requestAnimationFrame(() => (creste.value = true));
    clearTimeout(cronometru);
    cronometru = setTimeout(() => (creste.value = false), 1000);
  },
);
onBeforeUnmount(() => clearTimeout(cronometru));
</script>

<template>
  <section class="my-progress" :class="{ 'my-progress--creste': creste }" :aria-label="titlu">
    <Rapo :size="84" :mood="gata ? 'vesel' : 'normal'" clipeste />
    <div class="my-progress__body">
      <div class="my-progress__top">
        <div class="my-progress__left">
          <h2 class="my-progress__title">{{ titlu }}</h2>
          <span
            v-if="s.zile"
            class="serie"
            :class="{ 'serie--azi': s.azi }"
            :title="s.azi ? 'Ai bifat ceva azi. Seria continuă!' : 'Bifează ceva azi ca să nu se rupă seria.'"
          >
            <Icon name="star" :size="16" />{{ textSerie }}<template v-if="!s.azi"> · continuă azi</template>
          </span>
        </div>
        <span class="my-progress__count"><strong>{{ value }}</strong> din {{ max }} {{ unitate }}</span>
      </div>
      <div
        class="big-bar"
        role="progressbar"
        :aria-valuenow="value"
        aria-valuemin="0"
        :aria-valuemax="max"
        :aria-label="`${titlu}: ${value} din ${max}`"
      >
        <span class="big-bar__fill" :class="{ 'big-bar__fill--zero': !value }" :style="{ width: pct + '%' }"></span>
      </div>
      <p v-if="indemn" class="my-progress__hint">{{ indemn }}</p>
    </div>
  </section>
</template>

<style scoped>
.my-progress__left {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--s-2) var(--s-3);
}
.serie {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px 0 10px;
  background: var(--surface);
  border: 2px solid var(--yellow);
  border-radius: var(--r-pill);
  font-size: 14px;
  line-height: var(--lh-sm);
  font-weight: 800;
  color: var(--text);
  white-space: nowrap;
}
.serie .icon {
  color: var(--yellow-edge);
}
.serie--azi {
  background: var(--yellow);
  border-color: var(--yellow);
  box-shadow: inset 0 -3px 0 var(--yellow-edge);
}
.serie--azi .icon {
  color: var(--text);
  fill: var(--text);
}
@media (prefers-reduced-motion: no-preference) {
  /* bara se umple cu un mic „arc” la capăt */
  .my-progress .big-bar .big-bar__fill {
    transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .my-progress.my-progress--creste .big-bar__fill {
    background-image: linear-gradient(100deg, transparent 20%, rgba(255, 255, 255, 0.55) 45%, transparent 70%);
    background-size: 200% 100%;
    background-repeat: no-repeat;
    animation: luciu 0.9s ease-out;
  }
  .my-progress.my-progress--creste .my-progress__count strong {
    display: inline-block;
    animation: salt-numar 0.5s ease-out;
  }
  .serie--azi .icon {
    animation: rotire 0.6s ease-out;
  }
}
@keyframes luciu {
  from {
    background-position: 150% 0;
  }
  to {
    background-position: -50% 0;
  }
}
@keyframes salt-numar {
  0%,
  100% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.35);
  }
}
@keyframes rotire {
  from {
    transform: rotate(-90deg) scale(0.6);
  }
}
</style>
