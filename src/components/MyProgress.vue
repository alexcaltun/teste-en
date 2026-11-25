<script setup>
// Elev: cardul „Progresul tău”, cu Rapo și bara mare.
import { computed } from 'vue';
import Rapo from './Rapo.vue';
const props = defineProps({
  titlu: { type: String, required: true },
  value: { type: Number, required: true },
  max: { type: Number, required: true },
  unitate: { type: String, required: true }, // „exerciții bifate”
  indemn: { type: String, default: '' },
});
const pct = computed(() => (props.max ? Math.round((props.value / props.max) * 100) : 0));
const gata = computed(() => props.max > 0 && props.value >= props.max);
</script>

<template>
  <section class="my-progress" :aria-label="titlu">
    <Rapo :size="84" :mood="gata ? 'vesel' : 'normal'" />
    <div class="my-progress__body">
      <div class="my-progress__top">
        <h2 class="my-progress__title">{{ titlu }}</h2>
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
