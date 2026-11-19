<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Icon from '../components/Icon.vue';
import FilterChips from '../components/FilterChips.vue';
import GroupSelect from '../components/GroupSelect.vue';
import DoneBadge from '../components/DoneBadge.vue';
import MarkMenu from '../components/MarkMenu.vue';
import PdfLink from '../components/PdfLink.vue';
import ProgressBar from '../components/ProgressBar.vue';
import {
  ANI, SUBIECTE, EXERCITII, SETURI, NUMAR_EXERCITII, DESCRIERE_SET,
  subiecte, aniCuSubiecte, anImplicitSubiecte, eticheta, plural, potrivesteSubiect,
} from '../data.js';
import { store, marcaj } from '../store.js';

const route = useRoute();
const router = useRouter();

// ---------- filtrele, citite din adresă ----------
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q.trim() : ''));
// an = null înseamnă „Toți anii” (în adresă: an=toti; la căutare, și fără an)
const an = computed(() => {
  if (route.query.an === 'toti') return null;
  const n = Number(route.query.an);
  if (ANI.includes(n)) return n;
  return q.value ? null : anImplicitSubiecte;
});
const s = computed(() => (SUBIECTE.includes(route.query.s) ? route.query.s : null));
const ex = computed(() => {
  const n = Number(route.query.ex);
  return EXERCITII.includes(n) ? n : null;
});
const set = computed(() => (an.value === 2021 && SETURI.includes(route.query.set) ? route.query.set : null));

function seteaza(schimbari) {
  const query = { ...route.query, ...schimbari };
  for (const k of Object.keys(query)) if (query[k] === null || query[k] === undefined || query[k] === '') delete query[k];
  if (Number(query.an) !== 2021) delete query.set;
  router.push({ path: '/subiecte', query });
}

const optAni = [{ value: 'toti', label: 'Toți anii' }, ...ANI.map((a) => ({ value: a, label: String(a) }))];
const optSubiect = [{ value: null, label: 'Toate' }, ...SUBIECTE.map((x) => ({ value: x, label: x }))];
const optEx = [{ value: null, label: 'Toate' }, ...EXERCITII.map((x) => ({ value: x, label: String(x) }))];
const optSet = [{ value: null, label: 'Toate' }, ...SETURI.map((x) => ({ value: x, label: x }))];

const filtreActive = computed(() => !!(s.value || ex.value || set.value || q.value || an.value !== anImplicitSubiecte));
const reseteaza = () => router.push({ path: '/subiecte', query: { an: String(anImplicitSubiecte) } });

// ---------- rezultate ----------
const rezultate = computed(() =>
  subiecte.filter(
    (x) =>
      (an.value === null || x.an === an.value) &&
      (!set.value || x.set === set.value) &&
      (!s.value || x.subiect === s.value) &&
      (!ex.value || x.exercitiu === ex.value) &&
      (!q.value || potrivesteSubiect(x, q.value)),
  ),
);

const grupa = computed(() => store.grupe.find((g) => g.id === store.grupaSelectata) || null);
const facut = (x) => (grupa.value ? marcaj(grupa.value.id, 'subiect', x.id) : null);
const arataSet = computed(() => rezultate.value.some((x) => x.set));

// tabele: pe subiect; la căutare, pe an (și set). La „Toți anii” apare coloana „An”.
const peAn = computed(() => !!q.value);
const arataAn = computed(() => an.value === null && !q.value);
const sectiuni = computed(() => {
  const grupe = new Map();
  for (const x of rezultate.value) {
    const cheie = peAn.value ? `${x.an}${x.set || ''}` : x.subiect;
    if (!grupe.has(cheie)) {
      let titlu;
      if (peAn.value) titlu = x.set ? `${x.an} · Set ${x.set}` : String(x.an);
      else titlu = ex.value ? `Subiectul ${x.subiect} · Exercițiul ${ex.value}` : `Subiectul ${x.subiect}`;
      grupe.set(cheie, { cheie, titlu, randuri: [] });
    }
    grupe.get(cheie).randuri.push(x);
  }
  return [...grupe.values()].map((sec) => {
    const facute = sec.randuri.filter(facut).length;
    const n = sec.randuri.length;
    let meta = plural(n, 'exercițiu', 'exerciții');
    if (grupa.value) meta += ` · ${facute} ${facute === 1 ? 'făcut' : 'făcute'} de ${grupa.value.nume}`;
    return { ...sec, meta };
  });
});

// ---------- rezumat și progres ----------
const rezumat = computed(() => {
  const p = [];
  p.push(s.value ? `Subiectul ${s.value}` : 'toate subiectele');
  if (ex.value) p.push(`Exercițiul ${ex.value}`);
  if (set.value) p.push(`Set ${set.value}`);
  if (q.value) p.push(`tema „${q.value}”`);
  const n = rezultate.value.length;
  p.push(s.value || ex.value || set.value || q.value ? plural(n, 'rezultat', 'rezultate') : plural(n, 'exercițiu', 'exerciții'));
  return p;
});

const progres = computed(() => {
  if (!grupa.value || an.value === null || !aniCuSubiecte.includes(an.value)) return null;
  const dinAn = subiecte.filter((x) => x.an === an.value);
  const pozitii = new Set(dinAn.map(eticheta));
  const facute = new Set(dinAn.filter(facut).map(eticheta));
  return { facute: facute.size, total: pozitii.size || NUMAR_EXERCITII };
});

const randDeschis = ref(null);
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div class="page-head__text">
        <h1>Subiecte pe exerciții</h1>
        <p class="subtitle">Exercițiile din fiecare an, grupate pe subiect și număr. Alege anul, apoi subiectul.</p>
      </div>
    </div>

    <section class="filter-bar" aria-label="Filtre">
      <div v-if="q" class="cautare">
        <span class="caption">Căutare</span>
        <button type="button" class="chip chip--selected" @click="seteaza({ q: null, an: route.query.an || anImplicitSubiecte })">
          „{{ q }}”<Icon name="x" :size="16" /><span class="sr-only">Șterge căutarea</span>
        </button>
      </div>
      <FilterChips label="1 · An" :options="optAni" :model-value="an ?? 'toti'" @update:model-value="(v) => seteaza({ an: v })" />
      <FilterChips
        v-if="an === 2021"
        label="Set"
        :options="optSet"
        :model-value="set"
        @update:model-value="(v) => seteaza({ set: v })"
      />
      <div class="filter-split">
        <FilterChips label="2 · Subiect" :options="optSubiect" :model-value="s" @update:model-value="(v) => seteaza({ s: v })" />
        <FilterChips label="3 · Exercițiu" :options="optEx" :model-value="ex" @update:model-value="(v) => seteaza({ ex: v })" />
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
        <ProgressBar v-if="progres" :label="`${grupa.nume} · ${an}`" :value="progres.facute" :max="progres.total" />
      </div>
    </div>

    <div v-if="an !== null && !aniCuSubiecte.includes(an)" class="empty">
      <p class="empty__title">{{ an }} nu are încă subiecte pe exerciții</p>
      <p>Pe e3.ro, exercițiile din {{ an }} nu sunt încă grupate pe subiecte. Testele complete sunt deja acolo.</p>
      <RouterLink class="btn btn--secondary" :to="{ path: '/teste', query: { an: String(an) } }">Vezi testele din {{ an }}</RouterLink>
    </div>

    <div v-else-if="!rezultate.length" class="empty">
      <p class="empty__title">Niciun rezultat</p>
      <p v-if="q">Niciun exercițiu nu are tema „{{ q }}”{{ an ? ` în ${an}` : '' }}.</p>
      <p v-else>
        Pe e3.ro nu există un PDF pentru {{ an }}{{ set ? ` · Set ${set}` : '' }}{{ s ? ` · Subiectul ${s}` : '' }}{{ ex ? ` · Exercițiul ${ex}` : '' }}.
      </p>
      <button type="button" class="btn btn--secondary" @click="reseteaza">Resetează filtrele</button>
    </div>

    <section v-for="sec in sectiuni" :key="sec.cheie" class="section" :aria-label="sec.titlu">
      <div class="section-head">
        <h2>{{ sec.titlu }}</h2>
        <span class="section-meta">{{ sec.meta }}</span>
      </div>
      <div class="table">
        <div class="thead">
          <span v-if="arataAn" class="cell caption col-an">An</span>
          <span class="cell caption col-ex">Ex.</span>
          <span v-if="arataSet" class="cell caption col-set">Set</span>
          <span class="cell cell--grow caption">Temă</span>
          <span class="cell caption col-stare">{{ grupa ? grupa.nume : 'Stare' }}</span>
          <span class="cell cell--end caption col-act">Acțiuni</span>
        </div>
        <div v-for="x in sec.randuri" :key="x.id" class="row" :class="{ 'row--highlight': randDeschis === x.id }">
          <span v-if="arataAn" class="cell ex col-an">{{ x.an }}</span>
          <span class="cell ex col-ex">{{ eticheta(x) }}</span>
          <span v-if="arataSet" class="cell col-set">
            <span v-if="x.set"><span class="strong">Set {{ x.set }}</span><span v-if="DESCRIERE_SET[x.set]" class="muted"> · {{ DESCRIERE_SET[x.set] }}</span></span>
          </span>
          <span class="cell cell--grow">
            <span v-if="x.clasa" class="badge badge--topic">cl. {{ x.clasa }}</span>
            <span v-if="x.tema" class="secondary ellipsis" :title="x.tema">{{ x.tema }}</span>
          </span>
          <span class="cell col-stare"><DoneBadge :marcaj="facut(x)" /></span>
          <span class="cell cell--end col-act">
            <PdfLink :href="x.url" :descriere="`${x.an}${x.set ? ' set ' + x.set : ''} ${eticheta(x)}`" />
            <MarkMenu
              tip="subiect"
              :item-id="x.id"
              :descriere="`${x.an}${x.set ? ' set ' + x.set : ''} ${eticheta(x)}`"
              @open="randDeschis = x.id"
              @close="randDeschis === x.id && (randDeschis = null)"
            />
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.col-an {
  width: 72px;
}
.col-ex {
  width: 80px;
}
.col-set {
  width: 200px;
}
.col-stare {
  width: 184px;
}
.col-act {
  width: 272px;
  gap: var(--s-5);
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
