<script setup>
import Icon from './Icon.vue';
import Rapo from './Rapo.vue';
import { ui, inchideToast } from '../ui.js';

function anuleaza() {
  ui.toast?.anuleaza?.();
  inchideToast();
}
</script>

<template>
  <div class="toast-zone" role="status" aria-live="polite">
    <div v-if="ui.toast" :key="ui.toast.id" class="toast" :class="{ 'toast--vesel': ui.toast.vesel }">
      <Rapo v-if="ui.toast.vesel" :size="60" mood="vesel" class="toast__rapo" />
      <span v-else class="toast__icon"><Icon name="check" :size="18" /></span>
      <span class="toast__msg">
        <span v-if="ui.toast.titlu" class="toast__title">{{ ui.toast.titlu }}</span>
        <span class="toast__text">{{ ui.toast.mesaj }}</span>
      </span>
      <button v-if="ui.toast.anuleaza" type="button" class="btn btn--ghost" @click="anuleaza">Anulează</button>
      <button type="button" class="toast__close" aria-label="Închide mesajul" @click="inchideToast">
        <Icon name="x" :size="22" />
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
  padding: 0 var(--s-4);
  pointer-events: none;
}
.toast {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  min-height: var(--h-toast);
  max-width: 640px;
  width: 100%;
  padding: 10px var(--s-3) 10px var(--s-4);
  background: var(--surface);
  border: 2px solid var(--border);
  border-bottom-width: var(--edge-card);
  border-radius: var(--r-card);
  box-shadow: var(--shadow-pop);
  pointer-events: auto;
  animation: sus 0.25s ease-out;
}
.toast--vesel {
  border-color: var(--success-line);
  border-bottom-color: var(--success-fill);
}
.toast__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--r-pill);
  background: var(--accent-tint);
  color: var(--accent-edge);
  flex-shrink: 0;
}
.toast__msg {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.toast__title {
  font-family: var(--font-display);
  font-size: 21px;
  line-height: 28px;
  font-weight: 600;
  color: var(--success);
}
.toast__text {
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  font-weight: 700;
  color: var(--text-secondary);
}
.toast__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-btn);
  color: var(--text-secondary);
  flex-shrink: 0;
}
.toast__close:hover {
  background: var(--surface-sunk);
}
@keyframes sus {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .toast {
    animation: none;
  }
}
@media (max-width: 900px) {
  .toast-zone {
    left: 0;
    bottom: var(--s-4);
  }
}
@media (max-width: 560px) {
  .toast__rapo {
    display: none;
  }
}
</style>
