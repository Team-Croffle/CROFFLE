<script setup lang="ts">
  import type { HTMLAttributes } from 'vue';

  import { Icon } from '@/components/ui/icon';
  import { cn } from '@/lib/utils';

  const props = defineProps<{
    class?: HTMLAttributes['class'];
  }>();
</script>

<template>
  <span role="status" aria-label="Loading">
    <Icon icon="lucide:loader-2" :class="cn('size-4 animate-spin', props.class)" />
  </span>
</template>
