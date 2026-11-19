<script setup>
// „Marchează”: lista grupelor cu căsuțe de bifat, „Anulează” și „Salvează”.
import { computed, ref, nextTick } from 'vue';
import Icon from './Icon.vue';
import { store, marcaj, seteazaMarcaje } from '../store.js';
import { culoareGrupa, numeGrupa, arataToast, deschideDialogGrupa } from '../ui.js';
import { useInchidereExterioara } from './useOutside.js';

const props = defineProps({
  tip: { type: String, required: true }, // 'subiect' | 'test'
  itemId: { type: String, required: true },
  descriere: { type: String, default: '' },
});
const emit = defineEmits(['open', 'close']);

const deschis = ref(false);
const radacina = ref(null);
const buton = ref(null);
const bifate = ref(new Set());

const titluId = computed(() => `marcare-${props.itemId}`);

function deschide() {
  const facute = store.grupe.filter((g) => marcaj(g.id, props.tip, props.itemId)).map((g) => g.id);
  bifate.value = new Set(facute.length ? facute : store.grupaSelectata ? [store.grupaSelectata] : []);
  deschis.value = true;
  emit('open');
  nextTick(() => radacina.value?.querySelector('.dropdown input, .dropdown button')?.focus());
}
function inchide(focus = false) {
  if (!deschis.value) return;
  deschis.value = false;
  emit('close');
  if (focus) nextTick(() => buton.value?.focus());
}
useInchidereExterioara(deschis, radacina, inchide);

function comuta(id) {
  const s = new Set(bifate.value);
  if (s.has(id)) s.delete(id);
  else s.add(id);
  bifate.value = s;
}

const nume = (ids) =>
  ids
    .map((id) => store.grupe.find((g) => g.id === id)?.nume)
    .filter(Boolean)
    .join(', ');

function salveaza() {
  const r = seteazaMarcaje(props.tip, props.itemId, [...bifate.value]);
  inchide(true);
  if (r.adaugate.length) arataToast(`Marcat ca făcut pentru ${nume(r.adaugate)}`, r.anuleaza);
  else if (r.sterse.length) arataToast(`Marcaj șters pentru ${nume(r.sterse)}`, r.anuleaza);
}

function grupaNoua() {
  inchide();
  deschideDialogGrupa();
}
</script>

<template>
  <div ref="radacina" class="mm">
    <button
      ref="buton"
      type="button"
      class="btn btn--ghost"
      :class="{ 'btn--pressed': deschis }"
      aria-haspopup="dialog"
      :aria-expanded="deschis"
      :aria-label="descriere ? `Marchează ${descriere}` : 'Marchează'"
      @click="deschis ? inchide() : deschide()"
    >
      <Icon name="check" :size="16" />Marchează
    </button>
    <div v-if="deschis" class="dropdown mm__menu" role="dialog" :aria-labelledby="titluId">
      <span :id="titluId" class="caption dropdown__title">Marchează ca făcut pentru</span>
      <template v-if="store.grupe.length">
        <label v-for="g in store.grupe" :key="g.id" class="option">
          <input type="checkbox" class="sr-only" :checked="bifate.has(g.id)" @change="comuta(g.id)" />
          <span class="checkbox" :class="{ 'checkbox--checked': bifate.has(g.id) }" aria-hidden="true">
            <Icon v-if="bifate.has(g.id)" name="check" :size="16" />
          </span>
          <span class="dot" :style="{ background: culoareGrupa(g.culoare) }"></span>
          <span class="ellipsis">{{ numeGrupa(g) }}</span>
        </label>
        <div class="dropdown__foot">
          <button type="button" class="btn btn--ghost" @click="inchide(true)">Anulează</button>
          <button type="button" class="btn btn--primary" @click="salveaza">Salvează</button>
        </div>
      </template>
      <template v-else>
        <p class="mm__gol">Nu ai încă nicio grupă.</p>
        <div class="dropdown__foot">
          <button type="button" class="btn btn--primary" @click="grupaNoua">
            <Icon name="plus" :size="16" />Creează o grupă
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.mm__menu {
  top: calc(100% - var(--s-1));
  right: var(--s-5);
}
.mm__gol {
  padding: var(--s-2) var(--s-4);
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  color: var(--text-secondary);
}
.option:has(input:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: -2px;
}
@media (max-width: 760px) {
  .mm__menu {
    right: var(--s-3);
    left: var(--s-3);
    width: auto;
  }
}
</style>
