<script setup>
import Icon from './Icon.vue';
defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true }, // [{ value, label }]
  modelValue: { default: null },
});
const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="filter-row" role="group" :aria-label="label">
    <span class="caption">{{ label }}</span>
    <div class="chips">
      <button
        v-for="o in options"
        :key="String(o.value)"
        type="button"
        class="chip"
        :class="{ 'chip--selected': o.value === modelValue }"
        :aria-pressed="o.value === modelValue"
        @click="emit('update:modelValue', o.value)"
      >
        <Icon v-if="o.value === modelValue" name="check" :size="16" />{{ o.label }}
      </button>
    </div>
  </div>
</template>
