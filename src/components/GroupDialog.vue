<script setup>
// „Grupă nouă” și „Editează grupa”: nume, descriere, culoare.
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from './ModalDialog.vue';
import Icon from './Icon.vue';
import { CULORI, NUME_CULORI, adaugaGrupa, modificaGrupa, store } from '../store.js';
import { ui, inchideDialogGrupa, culoareGrupa, arataToast } from '../ui.js';

const router = useRouter();
const grupa = ui.dialogGrupa?.grupa || null;
const editare = !!grupa;

// culoarea implicită: prima care nu e folosită încă
const libera = CULORI.find((c) => !store.grupe.some((g) => g.culoare === c)) || CULORI[0];

const nume = ref(grupa?.nume || '');
const descriere = ref(grupa?.descriere || '');
const culoare = ref(grupa?.culoare || libera);
const incercat = ref(false);
const eroare = computed(() => (incercat.value && !nume.value.trim() ? 'Scrie un nume pentru grupă.' : ''));

function salveaza() {
  incercat.value = true;
  if (!nume.value.trim()) return;
  if (editare) {
    modificaGrupa(grupa.id, { nume: nume.value, descriere: descriere.value, culoare: culoare.value });
    arataToast(`Grupa „${nume.value.trim()}” a fost salvată`);
  } else {
    const g = adaugaGrupa({ nume: nume.value, descriere: descriere.value, culoare: culoare.value });
    arataToast(`Ai creat grupa „${g.nume}”`);
    if (router.currentRoute.value.path === '/grupe') router.replace({ path: '/grupe', query: { g: g.id } });
  }
  inchideDialogGrupa();
}
</script>

<template>
  <ModalDialog :titlu="editare ? 'Editează grupa' : 'Grupă nouă'" @close="inchideDialogGrupa">
    <form class="gd" novalidate @submit.prevent="salveaza">
      <label class="field">
        <span class="field__label">Nume</span>
        <input
          v-model="nume"
          class="input"
          type="text"
          maxlength="40"
          placeholder="de ex. Grupa A"
          autocomplete="off"
          autofocus
          :aria-invalid="!!eroare"
          aria-describedby="gd-eroare"
        />
        <span id="gd-eroare" class="field__error" aria-live="polite">{{ eroare }}</span>
      </label>
      <label class="field">
        <span class="field__label">Descriere <span class="muted">(opțional)</span></span>
        <input
          v-model="descriere"
          class="input"
          type="text"
          maxlength="60"
          placeholder="de ex. clasa a VIII-a · 6 elevi"
          autocomplete="off"
        />
      </label>
      <fieldset class="field">
        <legend class="field__label">Culoare</legend>
        <div class="gd__culori">
          <label v-for="c in CULORI" :key="c" class="gd__culoare" :title="NUME_CULORI[c]">
            <input v-model="culoare" type="radio" name="culoare" :value="c" class="sr-only" />
            <span class="gd__swatch" :style="{ background: culoareGrupa(c) }">
              <Icon v-if="culoare === c" name="check" :size="20" />
            </span>
            <span class="sr-only">{{ NUME_CULORI[c] }}</span>
          </label>
        </div>
      </fieldset>
      <div class="gd__preview" :style="{ background: culoareGrupa(culoare) }" aria-hidden="true">
        <span class="gd__pnume">{{ nume.trim() || 'Nume grupă' }}</span>
        <span v-if="descriere.trim()" class="gd__pdesc">{{ descriere.trim() }}</span>
      </div>
      <div class="modal__foot">
        <button type="button" class="btn btn--ghost" @click="inchideDialogGrupa">Anulează</button>
        <button type="submit" class="btn btn--primary">{{ editare ? 'Salvează' : 'Creează grupa' }}</button>
      </div>
    </form>
  </ModalDialog>
</template>

<style scoped>
.gd {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
}
.gd__culori {
  display: flex;
  gap: var(--s-3);
}
.gd__culoare {
  cursor: pointer;
}
.gd__swatch {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-pill);
  color: var(--on-color);
}
.gd__culoare:has(input:focus-visible) .gd__swatch {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.gd__preview {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--s-1);
  height: 96px;
  padding: var(--s-4) var(--s-5);
  border-radius: var(--r-card);
  color: var(--on-color);
}
.gd__pnume {
  font-size: var(--fs-h2);
  line-height: var(--lh-h2);
  font-weight: 600;
}
.gd__pdesc {
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
}
</style>
