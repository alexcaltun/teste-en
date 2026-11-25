<script setup>
// Prima vizită: „Cine folosește Teste EN?” — elev sau profesor. Se poate schimba oricând din bara de sus.
import { ref } from 'vue';
import Icon from './Icon.vue';
import Rapo from './Rapo.vue';
import { seteazaRol } from '../store.js';

const ROLURI = [
  {
    value: 'elev',
    titlu: 'Sunt elev',
    text: 'Bifez exercițiile și testele rezolvate și îmi văd progresul.',
    icon: 'backpack',
    cls: 'art--elev',
  },
  {
    value: 'profesor',
    titlu: 'Sunt profesor',
    text: 'Țin evidența a ce am lucrat cu fiecare grupă de elevi.',
    icon: 'board',
    cls: 'art--prof',
  },
];
const ales = ref('elev');

function laTasta(e) {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
  e.preventDefault();
  ales.value = ales.value === 'elev' ? 'profesor' : 'elev';
  e.currentTarget.querySelector(`[data-rol="${ales.value}"]`)?.focus();
}
</script>

<template>
  <div class="welcome-page">
    <header class="wp-top">
      <span class="wp-logo"><Rapo :size="44" /><span class="wp-logo__text"><span class="wp-logo__mark">Teste EN</span><span class="wp-logo__sub">matematică</span></span></span>
    </header>
    <main class="welcome">
      <div class="welcome__hero">
        <Rapo :size="168" clipeste />
        <p class="bubble"><span class="bubble__tail" aria-hidden="true"></span>Salut! Eu sunt Rapo. Cine ești?</p>
      </div>
      <div class="welcome__text">
        <h1>Cine folosește Teste EN?</h1>
        <p class="subtitle">Alegi o dată ce vezi în aplicație. Poți schimba oricând din bara de sus.</p>
      </div>
      <div class="roles" role="radiogroup" aria-label="Cine ești" @keydown="laTasta">
        <button
          v-for="r in ROLURI"
          :key="r.value"
          type="button"
          role="radio"
          class="role-card"
          :class="{ 'role-card--on': ales === r.value }"
          :aria-checked="ales === r.value"
          :tabindex="ales === r.value ? 0 : -1"
          :data-rol="r.value"
          @click="ales = r.value"
        >
          <span v-if="ales === r.value" class="role-card__check" aria-hidden="true"><Icon name="check" :size="18" /></span>
          <span class="role-card__art" :class="r.cls"><Icon :name="r.icon" :size="56" /></span>
          <span class="role-card__title">{{ r.titlu }}</span>
          <span class="role-card__desc">{{ r.text }}</span>
        </button>
      </div>
      <button type="button" class="btn btn--primary btn--wide" @click="seteazaRol(ales)">Continuă</button>
    </main>
  </div>
</template>

<style scoped>
.welcome-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.wp-top {
  display: flex;
  align-items: center;
  height: var(--h-topbar);
  padding: 0 var(--s-5);
  background: var(--surface);
  border-bottom: 2px solid var(--border);
}
.wp-logo {
  display: flex;
  align-items: center;
  gap: var(--s-2);
}
.wp-logo__text {
  display: flex;
  flex-direction: column;
}
.wp-logo__mark {
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 26px;
  font-weight: 700;
  color: var(--accent-text);
}
.wp-logo__sub {
  font-size: var(--fs-caption);
  line-height: var(--lh-caption);
  font-weight: 700;
  color: var(--text-muted);
}
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: var(--s-8) var(--s-4) var(--s-9);
}
.welcome__hero {
  display: flex;
  align-items: flex-end;
  gap: var(--s-4);
}
.bubble {
  position: relative;
  margin-bottom: 56px;
  padding: 14px 20px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-bottom-width: var(--edge-card);
  border-radius: 20px;
  font-size: 18px;
  line-height: 26px;
  font-weight: 700;
}
.bubble__tail {
  position: absolute;
  left: -10px;
  bottom: 18px;
  width: 18px;
  height: 18px;
  background: var(--surface);
  border-left: 2px solid var(--border);
  border-bottom: 2px solid var(--border);
  transform: rotate(45deg);
}
.welcome__text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--s-2);
  text-align: center;
}
.roles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--s-5);
}
.role-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 340px;
  max-width: 100%;
  padding: var(--s-6) 28px 28px;
  background: var(--surface);
  border: 2px solid var(--border-btn);
  border-bottom-width: 6px;
  border-radius: 28px;
  text-align: center;
}
.role-card:hover {
  background: var(--accent-subtle);
}
.role-card--on,
.role-card--on:hover {
  background: var(--accent-subtle);
  border-color: var(--accent-line-strong);
  border-bottom-color: var(--accent);
}
.role-card__art {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 112px;
  height: 112px;
  border-radius: var(--r-pill);
}
.role-card__art .icon {
  stroke-width: 2;
}
.art--elev {
  background: var(--topic-bg);
  color: var(--topic-text);
}
.art--prof {
  background: var(--teal-bg);
  color: var(--teal-text);
}
.role-card__title {
  font-family: var(--font-display);
  font-size: 26px;
  line-height: 32px;
  font-weight: 600;
}
.role-card__desc {
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  color: var(--text-secondary);
}
.role-card__check {
  position: absolute;
  top: var(--s-4);
  right: var(--s-4);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--r-pill);
  background: var(--accent);
  color: var(--on-color);
  box-shadow: inset 0 -3px 0 var(--accent-edge);
}
.role-card__check .icon {
  stroke-width: 3.5;
}
.btn--wide {
  width: 320px;
  max-width: 100%;
  height: 52px;
  font-size: var(--fs-body);
}
@media (max-width: 760px) {
  .welcome {
    padding-top: var(--s-6);
    gap: var(--s-5);
  }
  .welcome__hero .rapo {
    width: 112px;
    height: 86px;
  }
  .bubble {
    margin-bottom: 36px;
    font-size: var(--fs-body);
  }
  .role-card {
    gap: var(--s-2);
    padding: var(--s-5) var(--s-5) var(--s-4);
  }
  .role-card__art {
    width: 72px;
    height: 72px;
  }
  .role-card__art .icon {
    width: 36px;
    height: 36px;
  }
}
</style>
