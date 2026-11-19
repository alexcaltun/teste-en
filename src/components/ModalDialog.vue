<script setup>
// Fereastră modală simplă: focus în interior, Escape închide, focusul revine la loc.
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue';

defineProps({ titlu: { type: String, required: true } });
const emit = defineEmits(['close']);
const cutie = ref(null);
let inainte = null;

function laTasta(e) {
  if (e.key === 'Escape') {
    e.stopPropagation();
    emit('close');
    return;
  }
  if (e.key !== 'Tab' || !cutie.value) return;
  const f = [...cutie.value.querySelectorAll('button, input, textarea, a[href], [tabindex]:not([tabindex="-1"])')].filter(
    (el) => !el.disabled,
  );
  if (!f.length) return;
  const prim = f[0];
  const ultim = f[f.length - 1];
  if (e.shiftKey && document.activeElement === prim) {
    e.preventDefault();
    ultim.focus();
  } else if (!e.shiftKey && document.activeElement === ultim) {
    e.preventDefault();
    prim.focus();
  }
}

onMounted(() => {
  inainte = document.activeElement;
  nextTick(() => (cutie.value?.querySelector('[autofocus], input, button') || cutie.value)?.focus());
});
onBeforeUnmount(() => {
  if (inainte && document.contains(inainte)) inainte.focus();
});
</script>

<template>
  <Teleport to="body">
    <div class="modal-bg" @mousedown.self="emit('close')">
      <div ref="cutie" class="modal" role="dialog" aria-modal="true" :aria-label="titlu" tabindex="-1" @keydown="laTasta">
        <h2>{{ titlu }}</h2>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
