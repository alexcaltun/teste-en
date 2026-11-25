<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Icon from './Icon.vue';
import { programa } from '../data.js';
import { store } from '../store.js';
import { ui, culoareGrupa, numeGrupa, deschideDialogGrupa } from '../ui.js';

const route = useRoute();
const g = computed(() => (route.path === '/grupe' ? route.query.g || null : undefined));

const inchide = () => (ui.meniuDeschis = false);
function grupaNoua() {
  inchide();
  deschideDialogGrupa();
}
</script>

<template>
  <div v-if="ui.meniuDeschis" class="scrim" aria-hidden="true" @click="inchide"></div>
  <nav id="meniu-lateral" class="sidebar" :class="{ 'sidebar--open': ui.meniuDeschis, 'sidebar--hidden': ui.meniuAscuns }" aria-label="Navigare principală">
    <div class="nav-group">
      <span class="nav-label">Evaluare Națională</span>
      <RouterLink
        class="nav-item"
        :class="{ 'nav-item--active': route.path === '/subiecte' }"
        :aria-current="route.path === '/subiecte' ? 'page' : undefined"
        to="/subiecte"
        @click="inchide"
      >
        <span class="tile-s tile-s--violet"><Icon name="list" :size="18" /></span><span>Subiecte pe exerciții</span>
      </RouterLink>
      <RouterLink
        class="nav-item"
        :class="{ 'nav-item--active': route.path === '/teste' }"
        :aria-current="route.path === '/teste' ? 'page' : undefined"
        to="/teste"
        @click="inchide"
      >
        <span class="tile-s tile-s--pink"><Icon name="clipboard" :size="18" /></span><span>Teste și bareme</span>
      </RouterLink>
      <a v-if="programa" class="nav-item" :href="programa" target="_blank" rel="noopener noreferrer">
        <span class="tile-s tile-s--sky"><Icon name="book" :size="18" /></span><span>Programa (PDF)</span><span class="sr-only"> (pe e3.ro, tab nou)</span>
      </a>
    </div>
    <div v-if="store.rol === 'profesor'" class="nav-group">
      <span class="nav-label">Grupele mele</span>
      <RouterLink
        class="nav-item"
        :class="{ 'nav-item--active': g === null }"
        :aria-current="g === null ? 'page' : undefined"
        to="/grupe"
        @click="inchide"
      >
        <span class="tile-s tile-s--teal"><Icon name="users" :size="18" /></span><span>Toate grupele</span>
      </RouterLink>
      <RouterLink
        v-for="gr in store.grupe"
        :key="gr.id"
        class="nav-item"
        :class="{ 'nav-item--active': g === gr.id }"
        :aria-current="g === gr.id ? 'page' : undefined"
        :to="{ path: '/grupe', query: { g: gr.id } }"
        @click="inchide"
      >
        <span class="tile-s tile-s--plain"><span class="dot" :style="{ background: culoareGrupa(gr.culoare) }"></span></span>
        <span class="ellipsis">{{ numeGrupa(gr) }}</span>
      </RouterLink>
      <button type="button" class="nav-item nav-item--muted" @click="grupaNoua">
        <span class="tile-s tile-s--plain"><Icon name="plus" :size="18" /></span><span>Grupă nouă</span>
      </button>
    </div>
    <div class="sidebar__footer">
      <div class="nav-divider"></div>
      <RouterLink
        class="nav-item"
        :class="{ 'nav-item--active': route.path === '/despre' }"
        :aria-current="route.path === '/despre' ? 'page' : undefined"
        to="/despre"
        @click="inchide"
      >
        <span class="tile-s tile-s--plain"><Icon name="info" :size="18" /></span><span>Despre și surse</span>
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.sidebar {
  position: sticky;
  top: var(--h-topbar);
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  width: var(--w-sidebar);
  height: calc(100vh - var(--h-topbar));
  padding: 20px var(--s-4) var(--s-5);
  background: var(--surface);
  border-right: 2px solid var(--border);
  flex-shrink: 0;
  overflow-y: auto;
}
.nav-group {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
}
.nav-label {
  padding: var(--s-1) var(--s-3);
  font-size: var(--fs-caption);
  line-height: var(--lh-caption);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--s-3);
  min-height: var(--h-nav);
  padding: 0 10px;
  border: 2px solid transparent;
  border-radius: var(--r-nav);
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
  font-weight: 700;
  color: var(--text);
  text-align: left;
  min-width: 0;
}
.nav-item:hover {
  background: var(--surface-sunk);
}
.nav-item--active,
.nav-item--active:hover {
  background: var(--accent-subtle);
  border-color: var(--accent-line);
  color: var(--accent-edge);
}
.tile-s {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  flex-shrink: 0;
}
.tile-s--violet {
  background: var(--accent-tint);
  color: var(--accent-edge);
}
.tile-s--pink {
  background: var(--pink-bg);
  color: var(--pink-text);
}
.tile-s--sky {
  background: var(--sky-bg);
  color: var(--sky-text);
}
.tile-s--teal {
  background: var(--teal-bg);
  color: var(--teal-text);
}
.tile-s--plain {
  background: var(--surface-sunk);
  color: var(--text-secondary);
}
.nav-item--muted {
  color: var(--text-secondary);
}
.nav-item:focus-visible {
  outline-offset: -2px;
}
.nav-divider {
  height: 2px;
  margin: var(--s-1) var(--s-3);
  background: var(--border);
  border-radius: 2px;
}
.sidebar__footer {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
  margin-top: auto;
}
.scrim {
  display: none;
}
@media (min-width: 901px) {
  .sidebar--hidden {
    display: none;
  }
}
@media (max-width: 900px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: var(--h-topbar);
    z-index: 35;
    transform: translateX(-100%);
    visibility: hidden;
    transition: transform 0.2s ease, visibility 0.2s;
    box-shadow: var(--shadow-pop);
  }
  .sidebar--open {
    transform: none;
    visibility: visible;
  }
  .scrim {
    display: block;
    position: fixed;
    inset: var(--h-topbar) 0 0 0;
    z-index: 34;
    background: var(--overlay);
  }
}
</style>
