<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Icon from './Icon.vue';
import Rapo from './Rapo.vue';
import { interpreteaza } from '../data.js';
import { ui, comutaMeniu } from '../ui.js';
import { store, seteazaRol } from '../store.js';

const router = useRouter();
const route = useRoute();

const ROLURI = [
  { value: 'elev', label: 'Elev', icon: 'backpack' },
  { value: 'profesor', label: 'Profesor', icon: 'board' },
];
function alegeRol(rol) {
  seteazaRol(rol);
  // elevul nu are grupe
  if (rol === 'elev' && route.path === '/grupe') router.replace('/subiecte');
}
const text = ref('');
const mesaj = ref('');

function cauta() {
  mesaj.value = '';
  const dest = interpreteaza(text.value);
  if (!dest) {
    mesaj.value = 'Scrie un an, un exercițiu (II.3), o temă sau un loc.';
    return;
  }
  router.push({ path: dest.path, query: dest.query });
  ui.meniuDeschis = false;
}
</script>

<template>
  <header class="topbar">
    <div class="topbar__left">
      <button
        type="button"
        class="icon-btn"
        aria-label="Meniu"
        aria-controls="meniu-lateral"
        :aria-expanded="ui.meniuDeschis || !ui.meniuAscuns"
        @click="comutaMeniu"
      >
        <Icon name="menu" :size="24" />
      </button>
      <RouterLink class="logo" to="/subiecte" aria-label="Teste EN, matematică: pagina de start">
        <Rapo v-if="store.rol === 'elev'" :size="44" />
        <span class="logo__text"><span class="logo__mark">Teste EN</span><span class="logo__sub">matematică</span></span>
      </RouterLink>
    </div>
    <form class="search-wrap" role="search" @submit.prevent="cauta">
      <label class="search">
        <Icon name="search" :size="20" />
        <span class="sr-only">Caută</span>
        <input
          v-model="text"
          type="search"
          placeholder="Caută: 2021 II.3, triunghi, Buzău…"
          autocomplete="off"
          enterkeyhint="search"
          @input="mesaj = ''"
        />
      </label>
      <p v-if="mesaj" class="search__msg" role="alert">{{ mesaj }}</p>
    </form>
    <div class="topbar__right">
      <p v-if="!store.salvareDisponibila" class="nosave" role="status">
        <Icon name="alert" :size="16" />Marcajele nu se pot salva în acest browser
      </p>
      <div class="role">
        <span id="eticheta-rol" class="role__label">Sunt</span>
        <div class="segmented" role="group" aria-labelledby="eticheta-rol">
          <button
            v-for="r in ROLURI"
            :key="r.value"
            type="button"
            class="segment"
            :class="{ 'segment--on': store.rol === r.value }"
            :aria-pressed="store.rol === r.value"
            @click="alegeRol(r.value)"
          >
            <Icon :name="r.icon" :size="18" /><span class="segment__text">{{ r.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  height: var(--h-topbar);
  padding: 0 var(--s-5) 0 var(--s-4);
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.topbar__left {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  width: 256px;
  flex-shrink: 0;
}
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-pill);
  color: var(--text-secondary);
}
.icon-btn:hover {
  background: var(--topic-bg);
}
.logo {
  display: flex;
  align-items: baseline;
  gap: var(--s-2);
  white-space: nowrap;
}
.logo__mark {
  font-size: var(--fs-h2);
  line-height: var(--lh-h2);
  font-weight: 700;
  color: var(--accent);
}
.logo__sub {
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  color: var(--text-muted);
}
.search-wrap {
  position: relative;
  margin-left: var(--s-7);
  width: var(--w-search);
  min-width: 0;
}
.search {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  height: var(--h-btn);
  padding: 0 var(--s-4);
  background: var(--surface);
  border: 1px solid var(--border-control);
  border-radius: var(--r-btn);
  color: var(--text-muted);
  cursor: text;
}
.search:focus-within {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
.search input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  color: var(--text);
}
.search input::placeholder {
  color: var(--text-muted);
}
.search__msg {
  position: absolute;
  top: calc(100% + var(--s-2));
  left: 0;
  right: 0;
  padding: var(--s-2) var(--s-3);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-btn);
  box-shadow: var(--shadow-pop);
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  color: var(--text-secondary);
}
.logo__text {
  display: contents;
}
.topbar__right {
  display: flex;
  align-items: center;
  gap: var(--s-4);
  margin-left: auto;
  padding-left: var(--s-4);
}
.nosave {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  font-size: var(--fs-caption);
  line-height: var(--lh-caption);
  color: var(--text-muted);
}
/* comutatorul Elev | Profesor */
.role {
  display: flex;
  align-items: center;
  gap: var(--s-2);
}
.role__label {
  font-size: var(--fs-caption);
  line-height: var(--lh-caption);
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.segmented {
  display: flex;
  gap: 2px;
  padding: 2px;
  background: var(--surface);
  border: 1px solid var(--border-control);
  border-radius: var(--r-btn);
}
.segment {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  height: 34px;
  padding: 0 var(--s-3);
  border-radius: 6px;
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  font-weight: 500;
  color: var(--text-secondary);
}
.segment:hover {
  background: var(--accent-subtle);
}
.segment--on,
.segment--on:hover {
  background: var(--accent);
  color: var(--on-color);
}
@media (max-width: 760px) {
  .topbar {
    padding: 0 var(--s-3) 0 var(--s-2);
  }
  .topbar__left {
    width: auto;
  }
  .logo__sub {
    display: none;
  }
  .search-wrap {
    margin-left: var(--s-3);
    flex: 1;
  }
  .search {
    padding: 0 var(--s-3);
  }
  .nosave,
  .role__label {
    display: none;
  }
  .segment__text {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  .segment {
    padding: 0 10px;
  }
  .topbar__right {
    padding-left: var(--s-2);
  }
}
</style>

<!-- tema „elev” (vezi src/styles/tema-elev.css) -->
<style>
:root[data-tema="elev"] .topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  height: var(--h-topbar);
  padding: 0 var(--s-5) 0 var(--s-4);
  background: var(--surface);
  border-bottom: 2px solid var(--border);
}
:root[data-tema="elev"] .topbar .icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r-btn);
  color: var(--text-secondary);
}
:root[data-tema="elev"] .topbar .icon-btn:hover {
  background: var(--surface-sunk);
}
:root[data-tema="elev"] .topbar .logo {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  white-space: nowrap;
}
:root[data-tema="elev"] .topbar .logo__text {
  display: flex;
  flex-direction: column;
}
:root[data-tema="elev"] .topbar .logo__mark {
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 26px;
  font-weight: 700;
  color: var(--accent-text);
}
:root[data-tema="elev"] .topbar .logo__sub {
  font-size: var(--fs-caption);
  line-height: var(--lh-caption);
  font-weight: 700;
  color: var(--text-muted);
}
:root[data-tema="elev"] .topbar .search {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  height: var(--h-btn);
  padding: 0 var(--s-4);
  background: var(--surface);
  border: 2px solid var(--border-control);
  border-radius: var(--r-btn);
  color: var(--text-secondary);
  cursor: text;
}
:root[data-tema="elev"] .topbar .search:focus-within {
  outline: 3px solid var(--accent);
  outline-offset: 3px;
}
:root[data-tema="elev"] .topbar .search input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  font-weight: 600;
  color: var(--text);
}
:root[data-tema="elev"] .topbar .search__msg {
  position: absolute;
  top: calc(100% + var(--s-2));
  left: 0;
  right: 0;
  padding: var(--s-2) var(--s-3);
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--r-btn);
  box-shadow: var(--shadow-pop);
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  color: var(--text-secondary);
}
:root[data-tema="elev"] .topbar__right {
  display: flex;
  align-items: center;
  gap: var(--s-4);
  margin-left: auto;
  padding-left: var(--s-4);
}
:root[data-tema="elev"] .topbar .nosave {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  font-size: var(--fs-caption);
  line-height: var(--lh-caption);
  color: var(--text-muted);
}
:root[data-tema="elev"] .topbar .role {
  display: flex;
  align-items: center;
  gap: var(--s-2);
}
:root[data-tema="elev"] .topbar .role__label {
  font-size: 13px;
  line-height: var(--lh-caption);
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}
:root[data-tema="elev"] .topbar .segmented {
  display: flex;
  gap: var(--s-1);
  padding: var(--s-1);
  background: var(--surface-sunk);
  border: 2px solid var(--border);
  border-radius: var(--r-nav);
}
:root[data-tema="elev"] .topbar .segment {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  height: 36px;
  padding: 0 14px;
  border-radius: 11px;
  font-size: 14px;
  line-height: var(--lh-sm);
  font-weight: 800;
  color: var(--text-secondary);
}
:root[data-tema="elev"] .topbar .segment:hover {
  background: var(--accent-subtle);
}
:root[data-tema="elev"] .topbar .segment--on,
:root[data-tema="elev"] .topbar .segment--on:hover {
  background: var(--accent);
  color: var(--on-color);
  box-shadow: inset 0 -3px 0 var(--accent-edge);
}
@media (max-width: 760px) {
  :root[data-tema="elev"] .topbar .nosave,
:root[data-tema="elev"] .topbar .role__label {
    display: none;
  }
  :root[data-tema="elev"] .topbar .segment__text {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  :root[data-tema="elev"] .topbar .logo .rapo {
    display: none;
  }
  :root[data-tema="elev"] .topbar__right {
    padding-left: var(--s-2);
  }
  :root[data-tema="elev"] .topbar .segment {
    padding: 0 10px;
  }
}
</style>
