<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Icon from '../components/Icon.vue';
import FilterChips from '../components/FilterChips.vue';
import GroupSelect from '../components/GroupSelect.vue';
import DoneBadge from '../components/DoneBadge.vue';
import MarkMenu from '../components/MarkMenu.vue';
import PdfLink from '../components/PdfLink.vue';
import { ANI, teste, anImplicitTeste, plural, potrivesteTest } from '../data.js';
import { store, marcaj } from '../store.js';

const PRIMELE = 12;
const TIPURI = [
  { value: null, label: 'Toate' },
  { value: 'Examen', label: 'Examen' },
  { value: 'Simulare', label: 'Simulări' },
  { value: 'Model', label: 'Modele' },
  { value: 'Test', label: 'Teste' },
];
const NUME_TIP = { Examen: 'examene', Simulare: 'simulări', Model: 'modele', Test: 'teste' };

const route = useRoute();
const router = useRouter();

const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''));
// an = null înseamnă „Toți anii” (în adresă: an=toti; la căutare, și fără an)
const an = computed(() => {
  if (route.query.an === 'toti') return null;
  const n = Number(route.query.an);
  if (ANI.includes(n)) return n;
  return q.value ? null : anImplicitTeste;
});
const tip = computed(() => (TIPURI.some((t) => t.value && t.value === route.query.tip) ? route.query.tip : null));

function seteaza(schimbari) {
  const query = { ...route.query, ...schimbari };
  for (const k of Object.keys(query)) if (query[k] === null || query[k] === undefined || query[k] === '') delete query[k];
  router.push({ path: '/teste', query });
}

const optAni = [{ value: 'toti', label: 'Toți anii' }, ...ANI.map((a) => ({ value: a, label: String(a) }))];

const rezultate = computed(() =>
  teste.filter(
    (t) =>
      (an.value === null || t.an === an.value) &&
      (!tip.value || t.tip === tip.value) &&
      (!q.value || potrivesteTest(t, q.value)),
  ),
);

const toate = ref(false);
watch(() => route.fullPath, () => (toate.value = false));
const vizibile = computed(() => (toate.value ? rezultate.value : rezultate.value.slice(0, PRIMELE)));

const grupa = computed(() => store.grupe.find((g) => g.id === store.grupaSelectata) || null);
const facut = (t) => (grupa.value ? marcaj(grupa.value.id, 'test', t.id) : null);

const rezumat = computed(() => {
  const p = [tip.value ? NUME_TIP[tip.value] : 'toate tipurile'];
  if (q.value) p.push(`„${q.value}”`);
  p.push(plural(rezultate.value.length, 'test', 'teste'));
  if (grupa.value) {
    const n = rezultate.value.filter(facut).length;
    p.push(`${n} ${n === 1 ? 'făcut' : 'făcute'} de ${grupa.value.nume}`);
  }
  return p;
});

const filtreActive = computed(() => !!(tip.value || q.value || an.value !== anImplicitTeste));
const reseteaza = () => router.push({ path: '/teste', query: { an: String(anImplicitTeste) } });

const randDeschis = ref(null);
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div class="page-head__text">
        <h1>Teste și bareme</h1>
        <p class="subtitle">Teste complete: examene, simulări și modele, cu barem.</p>
      </div>
    </div>

    <section class="filter-bar" aria-label="Filtre">
      <div v-if="q" class="cautare">
        <span class="caption">Căutare</span>
        <button type="button" class="chip chip--selected" @click="seteaza({ q: null, an: route.query.an || anImplicitTeste })">
          „{{ q }}”<Icon name="x" :size="16" /><span class="sr-only">Șterge căutarea</span>
        </button>
      </div>
      <FilterChips label="1 · An" :options="optAni" :model-value="an ?? 'toti'" @update:model-value="(v) => seteaza({ an: v })" />
      <div class="filter-split">
        <FilterChips label="2 · Tip" :options="TIPURI" :model-value="tip" @update:model-value="(v) => seteaza({ tip: v })" />
        <GroupSelect />
      </div>
    </section>

    <div class="summary">
      <div class="summary__text">
        <strong>{{ an ?? 'Toți anii' }}</strong>
        <template v-for="(p, i) in rezumat" :key="i"><span class="summary__sep">·</span>{{ p }}</template>
      </div>
      <div class="summary__right">
        <button v-if="filtreActive" type="button" class="btn btn--ghost" @click="reseteaza">
          <Icon name="x" :size="16" />Resetează filtrele
        </button>
      </div>
    </div>

    <div v-if="!rezultate.length" class="empty">
      <p class="empty__title">Niciun test</p>
      <p v-if="q">Niciun test nu conține „{{ q }}”{{ an ? ` în ${an}` : '' }}.</p>
      <p v-else>Nu există {{ tip ? NUME_TIP[tip] : 'teste' }} pentru {{ an }} pe e3.ro.</p>
      <button type="button" class="btn btn--secondary" @click="reseteaza">Resetează filtrele</button>
    </div>

    <div v-else class="table">
      <div class="thead">
        <span class="cell cell--grow caption">Test</span>
        <span class="cell caption col-tip">Tip</span>
        <span class="cell caption col-stare">{{ grupa ? grupa.nume : 'Stare' }}</span>
        <span class="cell cell--end caption col-doc">Documente</span>
      </div>
      <div v-for="t in vizibile" :key="t.id" class="row" :class="{ 'row--highlight': randDeschis === t.id }">
        <span class="cell cell--grow nume">
          <span class="strong ellipsis" :title="t.numeOriginal">{{ t.nume }}</span>
          <span v-if="t.set || an === null" class="muted meta">{{ an === null ? t.an : '' }}{{ an === null && t.set ? ' · ' : '' }}{{ t.set ? `Set ${t.set}` : '' }}</span>
        </span>
        <span class="cell col-tip">
          <span class="badge" :class="t.tip === 'Examen' ? 'badge--accent' : 'badge--topic'">{{ t.tip }}</span>
        </span>
        <span class="cell col-stare"><DoneBadge :marcaj="facut(t)" /></span>
        <span class="cell cell--end col-doc">
          <PdfLink :href="t.urlSubiect" label="Subiect" :descriere="t.nume" />
          <PdfLink v-if="t.urlBarem" :href="t.urlBarem" label="Barem" variant="ghost" icon="clipboard" :descriere="t.nume" />
          <span v-else class="no-file">Fără barem</span>
          <MarkMenu
            tip="test"
            :item-id="t.id"
            :descriere="t.nume"
            @open="randDeschis = t.id"
            @close="randDeschis === t.id && (randDeschis = null)"
          />
        </span>
      </div>
      <div v-if="rezultate.length > PRIMELE && !toate" class="table-foot">
        <button type="button" class="btn btn--secondary" @click="toate = true">Arată toate ({{ rezultate.length }})</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.col-tip {
  width: 112px;
}
.col-stare {
  width: 168px;
}
.col-doc {
  width: 384px;
  gap: var(--s-1);
}
.nume {
  padding-right: var(--s-4);
}
.meta {
  white-space: nowrap;
}
.no-file {
  width: 108px;
}
.cautare {
  display: flex;
  flex-direction: column;
  gap: var(--s-2);
  align-items: flex-start;
}
.cautare .chip {
  padding: 0 var(--s-3) 0 var(--s-4);
}
</style>
