<script setup>
import Icon from './Icon.vue';
import { dataScurta, dataLunga } from '../data.js';
defineProps({ marcaj: { type: Object, default: null } });
</script>

<template>
  <span v-if="marcaj" class="badge badge--done" :title="`Făcut pe ${dataLunga(marcaj.data)}`">
    <Icon name="check" :size="16" />Făcut · {{ dataScurta(marcaj.data) }}
  </span>
  <span v-else class="muted" aria-label="Nefăcut">—</span>
</template>
