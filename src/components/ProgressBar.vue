<script setup>
import { computed } from 'vue';
const props = defineProps({
  label: { type: String, default: '' },
  value: { type: Number, required: true },
  max: { type: Number, required: true },
});
const pct = computed(() => (props.max ? Math.round((props.value / props.max) * 100) : 0));
</script>

<template>
  <div class="progress">
    <span v-if="label">{{ label }}</span>
    <span
      class="progress__bar"
      role="progressbar"
      :aria-valuenow="value"
      aria-valuemin="0"
      :aria-valuemax="max"
      :aria-label="label || 'Progres'"
    >
      <span class="progress__fill" :style="{ width: pct + '%' }"></span>
    </span>
    <span class="progress__value">{{ value }} / {{ max }}</span>
  </div>
</template>
