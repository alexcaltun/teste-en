<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Icon from './Icon.vue';
import { interpreteaza } from '../data.js';
import { ui, comutaMeniu } from '../ui.js';
import { store } from '../store.js';

const router = useRouter();
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
      <RouterLink class="logo" to="/subiecte">
        <span class="logo__mark">Teste EN</span><span class="logo__sub">matematică</span>
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
    <p v-if="!store.salvareDisponibila" class="nosave" role="status">
      <Icon name="alert" :size="16" />Marcajele nu se pot salva în acest browser
    </p>
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
.nosave {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  margin-left: auto;
  font-size: var(--fs-caption);
  line-height: var(--lh-caption);
  color: var(--text-muted);
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
  .nosave {
    display: none;
  }
}
</style>
