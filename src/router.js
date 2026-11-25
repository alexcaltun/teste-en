import { createRouter, createWebHashHistory } from 'vue-router';
import SubiecteView from './views/SubiecteView.vue';
import { store } from './store.js';

const TITLURI = {
  '/subiecte': 'Subiecte pe exerciții',
  '/teste': 'Teste și bareme',
  '/grupe': 'Grupele mele',
  '/despre': 'Despre și surse',
};

export const router = createRouter({
  // mod hash: merge pe GitHub Pages fără configurare de server
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/subiecte' },
    { path: '/subiecte', component: SubiecteView },
    { path: '/teste', component: () => import('./views/TesteView.vue') },
    { path: '/grupe', component: () => import('./views/GrupeView.vue') },
    { path: '/despre', component: () => import('./views/DespreView.vue') },
    { path: '/:rest(.*)*', redirect: '/subiecte' },
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    if (to.path !== from.path) return { top: 0 };
    return false;
  },
});

// elevul nu are grupe
router.beforeEach((to) => {
  if (to.path === '/grupe' && store.rol === 'elev') return { path: '/subiecte' };
  return true;
});

router.afterEach((to) => {
  document.title = `${TITLURI[to.path] || 'Teste EN'} · Teste EN`;
});
