<script setup>
// Elev: „Bifează” / „Bifat · dată”. Un click comută bifa; la bifare, cercul „sare”.
import { ref } from 'vue';
import Icon from './Icon.vue';
import { dataScurta, dataLunga } from '../data.js';
const p = defineProps({
  bifa: { type: Object, default: null },
  descriere: { type: String, default: '' },
});
const emit = defineEmits(['toggle']);
const pop = ref(false);
function apasa(bifatInainte) {
  pop.value = !bifatInainte;
  emit('toggle');
}
</script>

<template>
  <button
    type="button"
    class="tick"
    :class="{ 'tick--on': bifa, 'tick--pop': pop && bifa }"
    :aria-pressed="!!bifa"
    :aria-label="bifa ? `Bifat pe ${dataLunga(bifa.data)}: ${descriere}. Apasă ca să scoți bifa.` : `Bifează ${descriere}`"
    :title="bifa ? `Bifat pe ${dataLunga(bifa.data)}` : 'Bifează când l-ai rezolvat'"
    @click="apasa(!!p.bifa)"
    @animationend="pop = false"
  >
    <span class="tick__circle"><Icon v-if="bifa" name="check" :size="14" /></span>
    <template v-if="bifa">Bifat · {{ dataScurta(bifa.data) }}</template>
    <template v-else>Bifează</template>
  </button>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .tick--pop {
    animation: tick-salt 0.35s ease-out;
  }
  .tick--pop .tick__circle {
    animation: tick-pop 0.35s ease-out;
  }
}
@keyframes tick-pop {
  0% {
    transform: scale(0.5);
  }
  60% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes tick-salt {
  0%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
}
</style>
