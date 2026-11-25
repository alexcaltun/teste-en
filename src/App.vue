<script setup>
import TopBar from './components/TopBar.vue';
import SideNav from './components/SideNav.vue';
import AppToast from './components/AppToast.vue';
import GroupDialog from './components/GroupDialog.vue';
import RolePicker from './components/RolePicker.vue';
import { watchEffect } from 'vue';
import { ui } from './ui.js';
import { store } from './store.js';

// Profesorul vede aspectul inițial; elevul (și ecranul de alegere a rolului) tema „elev”.
watchEffect(() => {
  document.documentElement.dataset.tema = store.rol === 'profesor' ? 'profesor' : 'elev';
});
</script>

<template>
  <RolePicker v-if="!store.rol" />
  <template v-else>
    <a class="skip" href="#continut">Sari la conținut</a>
    <TopBar />
    <div class="shell" :class="{ 'shell--full': ui.meniuAscuns }">
      <SideNav />
      <main id="continut" class="main" tabindex="-1">
        <RouterView />
      </main>
    </div>
    <AppToast />
    <GroupDialog v-if="ui.dialogGrupa" />
  </template>
</template>

<style>
.shell {
  display: flex;
  align-items: flex-start;
  min-height: calc(100vh - var(--h-topbar));
}
.main {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  padding: var(--s-6) var(--s-7) var(--s-9);
}
.main:focus {
  outline: none;
}
.shell.shell--full ~ .toast-zone {
  left: 0;
}
.skip {
  position: absolute;
  left: var(--s-4);
  top: -100px;
  z-index: 60;
  padding: var(--s-2) var(--s-4);
  background: var(--accent);
  color: var(--on-color);
  border-radius: var(--r-btn);
}
.skip:focus {
  top: var(--s-2);
}
@media (max-width: 760px) {
  .main {
    padding: var(--s-5) var(--s-4) var(--s-9);
  }
}
</style>
