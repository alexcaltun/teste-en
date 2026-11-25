<script setup>
import { computed } from 'vue';
import Icon from './Icon.vue';
import { store } from '../store.js';
defineProps({
  label: { type: String, required: true },
  options: { type: Array, required: true }, // [{ value, label }]
  modelValue: { default: null },
});
const emit = defineEmits(['update:modelValue']);
// „1 · An” → pasul 1, eticheta „An”
const pas = (label) => label.match(/^(\d+)\s*·\s*(.+)$/);
const elev = computed(() => store.rol !== 'profesor');
</script>

<template>
  <div class="filter-row" role="group" :aria-label="label">
    <span v-if="elev && pas(label)" class="caption caption--pas">
      <span class="pas" aria-hidden="true">{{ pas(label)[1] }}</span><span class="sr-only">Pasul {{ pas(label)[1] }}: </span>{{ pas(label)[2] }}
    </span>
    <span v-else class="caption">{{ label }}</span>
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

<style scoped>
.caption--pas {
  display: flex;
  align-items: center;
}
.pas {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-right: var(--s-2);
  border-radius: var(--r-pill);
  background: var(--yellow);
  color: var(--text);
  font-size: var(--fs-caption);
  letter-spacing: 0;
  box-shadow: inset 0 -2px 0 var(--yellow-edge);
}
</style>
