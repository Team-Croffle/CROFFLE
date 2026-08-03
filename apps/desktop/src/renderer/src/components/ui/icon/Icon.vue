<script setup lang="ts">
  import { Icon as IconifyIcon } from '@iconify/vue';
  import type { HTMLAttributes } from 'vue';

  import { cn } from '@/lib/utils';

  const props = withDefaults(
    defineProps<{
      icon: string;
      class?: HTMLAttributes['class'];
    }>(),
    {},
  );
</script>

<template>
  <IconifyIcon :icon="props.icon" :class="cn('size-4 shrink-0', props.class)" aria-hidden="true" />
</template>
