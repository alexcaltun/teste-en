<script setup>
import Icon from './Icon.vue';
import Rapo from './Rapo.vue';
import { ui, inchideToast } from '../ui.js';
import { store } from '../store.js';

function anuleaza() {
  ui.toast?.anuleaza?.();
  inchideToast();
}
</script>

<template>
  <div class="toast-zone" role="status" aria-live="polite">
    <template v-if="ui.toast">
      <!-- tema „elev”: card alb, cu Rapo la reușite -->
      <div v-if="store.rol === 'elev'" :key="'k' + ui.toast.id" class="ktoast" :class="{ 'ktoast--vesel': ui.toast.vesel }">
        <Rapo v-if="ui.toast.vesel" :size="60" mood="vesel" :sare="ui.toast.sare" class="ktoast__rapo" />
        <span v-else class="ktoast__icon"><Icon name="check" :size="18" /></span>
        <span class="ktoast__msg">
          <span v-if="ui.toast.titlu" class="ktoast__title">{{ ui.toast.titlu }}</span>
          <span class="ktoast__text">{{ ui.toast.mesaj }}</span>
        </span>
        <button v-if="ui.toast.anuleaza" type="button" class="btn btn--ghost" @click="anuleaza">Anulează</button>
        <button type="button" class="ktoast__close" aria-label="Închide mesajul" @click="inchideToast">
          <Icon name="x" :size="22" />
        </button>
      </div>
      <!-- profesor: aspectul inițial -->
      <div v-else :key="ui.toast.id" class="toast">
        <span class="toast__msg"><Icon name="check" :size="16" />{{ ui.toast.mesaj }}</span>
        <button v-if="ui.toast.anuleaza" type="button" class="toast__action" @click="anuleaza">Anulează</button>
        <button type="button" class="toast__close" aria-label="Închide mesajul" @click="inchideToast">
          <Icon name="x" :size="20" />
        </button>
      </div>
    </template>
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

/* ---------- tema „elev” ---------- */
.ktoast {
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
.ktoast--vesel {
  border-color: var(--success-line);
  border-bottom-color: var(--success-fill);
}
.ktoast__icon {
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
.ktoast__msg {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.ktoast__title {
  font-family: var(--font-display);
  font-size: 21px;
  line-height: 28px;
  font-weight: 600;
  color: var(--success);
}
.ktoast__text {
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  font-weight: 700;
  color: var(--text-secondary);
}
.ktoast__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-btn);
  color: var(--text-secondary);
  flex-shrink: 0;
}
.ktoast__close:hover {
  background: var(--surface-sunk);
}
@keyframes sus {
  from {
    transform: translateY(12px);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ktoast {
    animation: none;
  }
}
@media (max-width: 560px) {
  .ktoast__rapo {
    display: none;
  }
}
</style>
