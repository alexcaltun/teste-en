<script setup>
import Icon from '../components/Icon.vue';
import { teste, subiecte, actualizat, sursa, programa, dataLunga } from '../data.js';
import { store } from '../store.js';
</script>

<template>
  <div class="page despre">
    <div class="page-head">
      <div class="page-head__text">
        <h1>Despre și surse</h1>
        <p class="subtitle">De unde vine conținutul și ce face aplicația.</p>
      </div>
    </div>

    <section class="bloc">
      <h2>Ce face aplicația</h2>
      <p>
        „Teste EN” este un index personal al testelor și subiectelor de Evaluare Națională la matematică (clasa a VIII-a).
        Le filtrează pe an, subiect și exercițiu și ține evidența a ce ai lucrat cu fiecare grupă de elevi.
      </p>
      <p>
        Aplicația nu copiază și nu găzduiește niciun PDF. Butoanele „Deschide”, „Subiect” și „Barem” deschid fișierul
        original de pe e3.ro, într-un tab nou.
      </p>
    </section>

    <section class="bloc">
      <h2>Sursa conținutului</h2>
      <p>
        Toate testele, subiectele și baremele aparțin site-ului
        <a class="link" href="https://www.e3.ro" target="_blank" rel="noopener noreferrer">e3.ro<Icon name="external" :size="16" /></a>
        (prof. Valeriu Mocanu) și autorilor testelor (Ministerul Educației, inspectorate școlare, școli și reviste).
        Aplicația nu este afiliată cu e3.ro.
      </p>
      <dl class="date">
        <div>
          <dt class="caption">Pagina folosită</dt>
          <dd><a class="link" :href="sursa" target="_blank" rel="noopener noreferrer">{{ sursa }}<Icon name="external" :size="16" /></a></dd>
        </div>
        <div v-if="programa">
          <dt class="caption">Programa</dt>
          <dd><a class="link" :href="programa" target="_blank" rel="noopener noreferrer">Programa Evaluării Naționale (PDF)<Icon name="external" :size="16" /></a></dd>
        </div>
        <div>
          <dt class="caption">Ultima actualizare a datelor</dt>
          <dd>{{ dataLunga(actualizat) }}</dd>
        </div>
        <div>
          <dt class="caption">În index</dt>
          <dd>{{ teste.length }} teste și {{ subiecte.length }} PDF-uri cu subiecte pe exerciții, din 2020–2027</dd>
        </div>
      </dl>
    </section>

    <section class="bloc">
      <h2>Datele tale</h2>
      <p>
        Grupele și marcajele se salvează doar în acest browser (localStorage). Aplicația nu trimite date nicăieri și nu
        are conturi. Dacă ștergi datele site-ului din browser sau folosești alt calculator, marcajele nu vor fi acolo.
      </p>
      <p v-if="!store.salvareDisponibila" class="nosave">
        <Icon name="alert" :size="16" />În acest browser salvarea nu este disponibilă (de exemplu, în navigarea privată).
      </p>
    </section>
  </div>
</template>

<style scoped>
.despre {
  max-width: 720px;
}
.bloc {
  display: flex;
  flex-direction: column;
  gap: var(--s-3);
  padding: var(--s-5);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  color: var(--text-secondary);
}
.bloc h2 {
  color: var(--text);
}
.link {
  display: inline-flex;
  align-items: center;
  gap: var(--s-1);
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
  word-break: break-all;
}
.link:hover {
  color: var(--accent-hover);
}
.date {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
  margin-top: var(--s-2);
}
.date div {
  display: flex;
  flex-direction: column;
  gap: var(--s-1);
}
.date dd {
  color: var(--text);
  font-size: var(--fs-sm);
  line-height: var(--lh-sm);
}
.nosave {
  display: flex;
  align-items: center;
  gap: var(--s-2);
  color: var(--error);
}
</style>
