<script lang="ts" setup>
  // vue-sonner v2 no longer injects CSS — without this, the toaster is not
  // position:fixed and occupies flex space (shrinking the main calendar area).
  // oxlint-disable-next-line import/no-unassigned-import
  import 'vue-sonner/style.css';
  import type { ToasterProps } from 'vue-sonner';
  import { Toaster as Sonner } from 'vue-sonner';

  const props = defineProps<ToasterProps>();
</script>

<template>
  <Sonner
    class="toaster group pointer-events-auto"
    v-bind="props"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
    }"
  />
</template>
