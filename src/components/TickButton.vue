<script setup>
// Elev: „Bifează” / „Bifat · dată”. Un click comută bifa.
import Icon from './Icon.vue';
import { dataScurta, dataLunga } from '../data.js';
defineProps({
  bifa: { type: Object, default: null },
  descriere: { type: String, default: '' },
});
const emit = defineEmits(['toggle']);
</script>

<template>
  <button
    type="button"
    class="tick"
    :class="{ 'tick--on': bifa }"
    :aria-pressed="!!bifa"
    :aria-label="bifa ? `Bifat pe ${dataLunga(bifa.data)}: ${descriere}. Apasă ca să scoți bifa.` : `Bifează ${descriere}`"
    :title="bifa ? `Bifat pe ${dataLunga(bifa.data)}` : 'Bifează când l-ai rezolvat'"
    @click="emit('toggle')"
  >
    <span class="tick__circle"><Icon v-if="bifa" name="check" :size="14" /></span>
    <template v-if="bifa">Bifat · {{ dataScurta(bifa.data) }}</template>
    <template v-else>Bifează</template>
  </button>
</template>
