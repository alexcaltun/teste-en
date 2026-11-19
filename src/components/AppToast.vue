<script setup>
import Icon from './Icon.vue';
import { ui, inchideToast } from '../ui.js';

function anuleaza() {
  ui.toast?.anuleaza?.();
  inchideToast();
}
</script>

<template>
  <div class="toast-zone" role="status" aria-live="polite">
    <div v-if="ui.toast" :key="ui.toast.id" class="toast">
      <span class="toast__msg"><Icon name="check" :size="16" />{{ ui.toast.mesaj }}</span>
      <button v-if="ui.toast.anuleaza" type="button" class="toast__action" @click="anuleaza">Anulează</button>
      <button type="button" class="toast__close" aria-label="Închide mesajul" @click="inchideToast">
        <Icon name="x" :size="20" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.toast-zone {
  position: fixed;
  left: var(--w-sidebar);
  right: 0;
  bottom: var(--s-6);
  z-index: 40;
  display: flex;
  justify-content: center;
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: var(--s-4);
  min-height: var(--h-toast);
  max-width: calc(100% - var(--s-6));
  padding: 0 var(--s-2) 0 var(--s-4);
  background: var(--text);
  border-radius: var(--r-btn);
  color: var(--on-color);
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  box-shadow: var(--shadow-pop);
  pointer-events: auto;
}
.toast__msg {
  display: flex;
  align-items: center;
  gap: var(--s-2);
}
.toast__action {
  display: flex;
  align-items: center;
  height: var(--h-btn);
  padding: 0 var(--s-3);
  color: var(--toast-action);
  font-weight: 600;
  border-radius: var(--r-btn);
}
.toast__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--h-btn);
  height: var(--h-btn);
  color: var(--toast-close);
  border-radius: var(--r-btn);
}
.toast :focus-visible {
  outline-color: var(--toast-action);
}
@media (max-width: 900px) {
  .toast-zone {
    left: 0;
    bottom: var(--s-4);
  }
}
</style>
