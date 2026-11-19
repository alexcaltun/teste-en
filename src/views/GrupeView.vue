<script setup>
import { computed, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Icon from '../components/Icon.vue';
import ProgressBar from '../components/ProgressBar.vue';
import PdfLink from '../components/PdfLink.vue';
import ModalDialog from '../components/ModalDialog.vue';
import {
  subiecte, subiectDupaId, testDupaId, anImplicitSubiecte, NUMAR_EXERCITII,
  eticheta, dataScurta, dataLunga, plural,
} from '../data.js';
import { store, stergeGrupa, stergeMarcaj } from '../store.js';
import { culoareGrupa, deschideDialogGrupa, arataToast } from '../ui.js';

const PRIMELE = 8;
const route = useRoute();
const router = useRouter();

// ---------- grupa din istoric ----------
const grupaIstoric = computed(() => {
  const din = store.grupe.find((g) => g.id === route.query.g);
  return din || store.grupe.find((g) => g.id === store.grupaSelectata) || store.grupe[0] || null;
});
const alegeIstoric = (id) => router.replace({ path: '/grupe', query: { g: id } });

const sectiuneIstoric = ref(null);
function veziIstoricul(id) {
  router.push({ path: '/grupe', query: { g: id } });
  nextTick(() => sectiuneIstoric.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

// ---------- descrieri ----------
function element(f) {
  if (f.tip === 'subiect') {
    const s = subiectDupaId.get(f.itemId);
    if (!s) return null;
    return {
      an: s.an,
      titlu: `${eticheta(s)}${s.set ? ` · Set ${s.set}` : ''}`,
      clasa: s.clasa || null,
      tema: s.tema || null,
      url: s.url,
      test: false,
    };
  }
  const t = testDupaId.get(f.itemId);
  if (!t) return null;
  return { an: t.an, titlu: t.nume, url: t.urlSubiect, test: true };
}

const marcajeGrupa = (id) => store.facute.filter((f) => f.grupaId === id).sort((a, b) => (a.data < b.data ? 1 : -1));

function stat(g) {
  const toate = marcajeGrupa(g.id);
  const ultim = toate[0];
  const el = ultim ? element(ultim) : null;
  const nSub = toate.filter((f) => f.tip === 'subiect').length;
  const nTest = toate.filter((f) => f.tip === 'test').length;
  const dinAn = subiecte.filter((s) => s.an === anImplicitSubiecte);
  const facute = new Set(
    toate
      .filter((f) => f.tip === 'subiect')
      .map((f) => subiectDupaId.get(f.itemId))
      .filter((s) => s && s.an === anImplicitSubiecte)
      .map(eticheta),
  );
  return {
    ultim: el ? `${el.an} · ${el.titlu} · ${dataScurta(ultim.data)}` : ultim ? `Element șters din date · ${dataScurta(ultim.data)}` : '—',
    total: `${plural(nSub, 'exercițiu', 'exerciții')} · ${plural(nTest, 'test', 'teste')}`,
    progres: { facute: facute.size, total: new Set(dinAn.map(eticheta)).size || NUMAR_EXERCITII },
  };
}

// ---------- istoric ----------
const istoric = computed(() => (grupaIstoric.value ? marcajeGrupa(grupaIstoric.value.id) : []));
const tot = ref(false);
watch(() => route.query.g, () => (tot.value = false));
const randuri = computed(() =>
  (tot.value ? istoric.value : istoric.value.slice(0, PRIMELE)).map((f) => ({ f, el: element(f) })),
);

function stergeDinIstoric(f) {
  const anuleaza = stergeMarcaj(f.id);
  arataToast('Marcaj șters', anuleaza);
}

// ---------- ștergerea unei grupe ----------
const deSters = ref(null);
const nMarcajeDeSters = computed(() => (deSters.value ? marcajeGrupa(deSters.value.id).length : 0));
function confirmaStergerea() {
  const g = deSters.value;
  deSters.value = null;
  stergeGrupa(g.id);
  if (route.query.g === g.id) router.replace({ path: '/grupe' });
  arataToast(`Grupa „${g.nume}” a fost ștearsă`);
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div class="page-head__text">
        <h1>Grupele mele</h1>
        <p class="subtitle">Ce ați lucrat cu fiecare grupă, ca să nu dați același exercițiu de două ori.</p>
      </div>
      <button v-if="store.grupe.length" type="button" class="btn btn--primary" @click="deschideDialogGrupa()">
        <Icon name="plus" :size="20" />Grupă nouă
      </button>
    </div>

    <div v-if="!store.grupe.length" class="empty">
      <p class="empty__title">Nu ai încă nicio grupă</p>
      <p>Creează o grupă pentru fiecare clasă sau grup de elevi. Apoi marchează ce ai lucrat cu ea, ca să vezi ce a rămas.</p>
      <button type="button" class="btn btn--primary" @click="deschideDialogGrupa()">
        <Icon name="plus" :size="20" />Creează prima grupă
      </button>
    </div>

    <template v-else>
      <div class="cards">
        <article
          v-for="g in store.grupe"
          :key="g.id"
          class="card"
          :class="{ 'card--activ': route.query.g === g.id }"
          :aria-label="g.nume"
        >
          <div class="card__band" :style="{ background: culoareGrupa(g.culoare) }">
            <h2 class="card__name ellipsis">{{ g.nume }}</h2>
            <span v-if="g.descriere" class="card__desc ellipsis">{{ g.descriere }}</span>
          </div>
          <div class="card__body">
            <div class="stat">
              <span class="caption">Ultimul lucrat</span>
              <span class="stat__value">{{ stat(g).ultim }}</span>
            </div>
            <div class="stat">
              <span class="caption">Total</span>
              <span class="stat__value">{{ stat(g).total }}</span>
            </div>
            <div class="stat">
              <span class="caption">Progres {{ anImplicitSubiecte }}</span>
              <ProgressBar
                class="card__progress"
                label="Subiecte"
                :value="stat(g).progres.facute"
                :max="stat(g).progres.total"
              />
            </div>
          </div>
          <div class="card__foot">
            <button type="button" class="btn btn--neutral" :aria-label="`Editează ${g.nume}`" @click="deschideDialogGrupa(g)">
              <Icon name="pencil" :size="16" />Editează
            </button>
            <button type="button" class="btn btn--neutral" :aria-label="`Șterge ${g.nume}`" @click="deSters = g">
              <Icon name="trash" :size="16" />Șterge
            </button>
            <button type="button" class="btn btn--ghost card__istoric" @click="veziIstoricul(g.id)">Vezi istoricul</button>
          </div>
        </article>
      </div>

      <section ref="sectiuneIstoric" class="section istoric" aria-labelledby="titlu-istoric">
        <div class="group-tabs">
          <div class="section-head">
            <h2 id="titlu-istoric">Istoric</h2>
            <span class="section-meta">cele mai recente întâi</span>
          </div>
          <div class="chips" role="group" aria-label="Grupa">
            <button
              v-for="g in store.grupe"
              :key="g.id"
              type="button"
              class="chip"
              :class="{ 'chip--selected': grupaIstoric?.id === g.id }"
              :aria-pressed="grupaIstoric?.id === g.id"
              @click="alegeIstoric(g.id)"
            >
              <Icon v-if="grupaIstoric?.id === g.id" name="check" :size="16" />{{ g.nume }}
            </button>
          </div>
        </div>

        <div v-if="!istoric.length" class="empty">
          <p class="empty__title">{{ grupaIstoric.nume }} nu are încă nimic marcat</p>
          <p>Folosește „Marchează” pe un exercițiu sau pe un test complet.</p>
          <RouterLink class="btn btn--secondary" to="/subiecte">Mergi la subiecte</RouterLink>
        </div>

        <div v-else class="table">
          <div class="thead">
            <span class="cell caption col-data">Data</span>
            <span class="cell caption col-an">An</span>
            <span class="cell caption col-ce">Exercițiu / test</span>
            <span class="cell cell--grow caption">Temă</span>
            <span class="cell cell--end caption col-act">Acțiuni</span>
          </div>
          <div v-for="{ f, el } in randuri" :key="f.id" class="row">
            <span class="cell col-data secondary" :title="dataLunga(f.data)">{{ dataScurta(f.data) }}</span>
            <span class="cell col-an secondary">{{ el ? el.an : '—' }}</span>
            <span class="cell col-ce strong">
              <span class="ellipsis" :title="el ? el.titlu : ''">{{ el ? el.titlu : 'Nu mai există în date' }}</span>
            </span>
            <span class="cell cell--grow">
              <template v-if="el && el.test"><span class="badge badge--accent">Test complet</span></template>
              <template v-else-if="el">
                <span v-if="el.clasa" class="badge badge--topic">cl. {{ el.clasa }}</span>
                <span v-if="el.tema" class="secondary ellipsis">{{ el.tema }}</span>
              </template>
            </span>
            <span class="cell cell--end col-act">
              <PdfLink v-if="el" :href="el.url" :descriere="`${el.an} ${el.titlu}`" />
              <button type="button" class="btn btn--neutral" :aria-label="`Șterge marcajul din ${dataLunga(f.data)}`" @click="stergeDinIstoric(f)">
                <Icon name="x" :size="16" />Șterge
              </button>
            </span>
          </div>
          <div v-if="istoric.length > PRIMELE && !tot" class="table-foot">
            <button type="button" class="btn btn--secondary" @click="tot = true">Arată tot istoricul ({{ istoric.length }})</button>
          </div>
        </div>
      </section>
    </template>

    <ModalDialog v-if="deSters" :titlu="`Ștergi grupa „${deSters.nume}”?`" @close="deSters = null">
      <p class="secondary">
        {{ nMarcajeDeSters ? `Se șterg și ${plural(nMarcajeDeSters, 'marcaj', 'marcaje')} din istoricul ei.` : 'Grupa nu are marcaje.' }}
        Ștergerea nu se poate anula.
      </p>
      <div class="modal__foot">
        <button type="button" class="btn btn--ghost" autofocus @click="deSters = null">Anulează</button>
        <button type="button" class="btn btn--danger" @click="confirmaStergerea">Șterge grupa</button>
      </div>
    </ModalDialog>
  </div>
</template>

<style scoped>
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-5);
}
.card {
  display: flex;
  flex-direction: column;
  width: var(--w-card);
  max-width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  box-shadow: var(--shadow-card);
}
.card--activ {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}
.card__band {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--s-1);
  height: 96px;
  padding: var(--s-4) var(--s-5);
  border-radius: 11px 11px 0 0;
  color: var(--on-color);
}
.card__name {
  font-size: var(--fs-h2);
  line-height: var(--lh-h2);
  font-weight: 600;
}
.card__desc {
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
}
.card__body {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
  padding: var(--s-4) var(--s-5);
  flex: 1;
}
.stat {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
}
.stat__value {
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  font-weight: 500;
}
.card__progress :deep(.progress__bar) {
  width: 120px;
}
.card__foot {
  display: flex;
  align-items: center;
  gap: var(--s-1);
  padding: var(--s-2) var(--s-3);
  border-top: 1px solid var(--border);
}
.card__istoric {
  margin-left: auto;
}
.istoric {
  scroll-margin-top: calc(var(--h-topbar) + var(--s-4));
}
.group-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--s-3);
}
.col-data {
  width: 96px;
}
.col-an {
  width: 80px;
}
.col-ce {
  width: 280px;
  padding-right: var(--s-4);
}
.col-act {
  width: 240px;
  gap: var(--s-4);
}
</style>
