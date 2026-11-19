<script setup>
// Deschide PDF-ul original de pe e3.ro într-un tab nou. Nimic nu se descarcă în aplicație.
import Icon from './Icon.vue';
defineProps({
  href: { type: String, required: true },
  label: { type: String, default: 'Deschide' },
  variant: { type: String, default: 'secondary' },
  icon: { type: String, default: 'file' },
  descriere: { type: String, default: '' },
});
</script>

<template>
  <a
    class="btn"
    :class="`btn--${variant}`"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="descriere ? `${label}: ${descriere} (PDF pe e3.ro, tab nou)` : `${label} (PDF pe e3.ro, tab nou)`"
  >
    <Icon :name="icon" :size="16" />{{ label }}
  </a>
</template>
