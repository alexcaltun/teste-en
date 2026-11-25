<script setup>
// Selectorul „Arată ce a făcut: <grupa>”.
import { computed, ref, nextTick } from 'vue';
import Icon from './Icon.vue';
import { store, selecteazaGrupa } from '../store.js';
import { culoareGrupa, numeGrupa, deschideDialogGrupa } from '../ui.js';
import { useInchidereExterioara } from './useOutside.js';

const deschis = ref(false);
const radacina = ref(null);
const buton = ref(null);
const grupa = computed(() => store.grupe.find((g) => g.id === store.grupaSelectata) || null);

function inchide(focus = false) {
  deschis.value = false;
  if (focus) nextTick(() => buton.value?.focus());
}
useInchidereExterioara(deschis, radacina, inchide);

function alege(id) {
  selecteazaGrupa(id);
  inchide(true);
}

function grupaNoua() {
  inchide();
  deschideDialogGrupa();
}

function laTasta(e) {
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
  e.preventDefault();
  const items = [...radacina.value.querySelectorAll('.option, .option-new')];
  const i = items.indexOf(document.activeElement);
  const urm = e.key === 'ArrowDown' ? Math.min(items.length - 1, i + 1) : Math.max(0, i - 1);
  items[urm]?.focus();
}
</script>

<template>
  <div class="filter-group">
    <span id="eticheta-grupa" class="caption">Arată ce a făcut</span>
    <div v-if="store.grupe.length" ref="radacina" class="gs" @keydown="laTasta">
      <button
        ref="buton"
        type="button"
        class="select"
        aria-haspopup="listbox"
        :aria-expanded="deschis"
        aria-labelledby="eticheta-grupa"
        @click="deschis = !deschis"
      >
        <span class="dot" :style="{ background: culoareGrupa(grupa?.culoare) }"></span>
        <span class="ellipsis">{{ numeGrupa(grupa) }}</span>
        <Icon name="chevron" />
      </button>
      <div v-if="deschis" class="dropdown gs__menu" role="listbox" aria-labelledby="eticheta-grupa">
        <button
          v-for="g in store.grupe"
          :key="g.id"
          type="button"
          role="option"
          class="option"
          :aria-selected="g.id === store.grupaSelectata"
          @click="alege(g.id)"
        >
          <span class="dot" :style="{ background: culoareGrupa(g.culoare) }"></span>
          <span class="ellipsis">{{ numeGrupa(g) }}</span>
          <Icon v-if="g.id === store.grupaSelectata" name="check" :size="16" class="option__check" />
        </button>
        <div class="dropdown__foot gs__foot">
          <button type="button" class="btn btn--ghost option-new" @click="grupaNoua">
            <Icon name="plus" :size="16" />Grupă nouă
          </button>
        </div>
      </div>
    </div>
    <button v-else type="button" class="btn btn--secondary" @click="deschideDialogGrupa()">
      <Icon name="plus" :size="16" />Creează o grupă
    </button>
  </div>
</template>

<style scoped>
.gs {
  position: relative;
}
.select {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  height: var(--h-btn);
  max-width: 300px;
  padding: 0 var(--s-3) 0 14px;
  background: var(--surface);
  border: 2px solid var(--border-control);
  border-bottom-width: var(--edge);
  border-radius: var(--r-btn);
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  font-weight: 800;
}
.select:hover {
  background: var(--accent-subtle);
}
.select .icon {
  color: var(--text-secondary);
  flex-shrink: 0;
}
.gs__menu {
  top: calc(100% + var(--s-2));
  right: 0;
}
.option__check {
  margin-left: auto;
  color: var(--accent-edge);
  flex-shrink: 0;
}
.gs__foot {
  justify-content: flex-start;
  padding-left: var(--s-1);
}
</style>
