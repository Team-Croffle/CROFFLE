<script setup lang="ts">
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

  const props = defineProps<{
    renderFn: (container: HTMLElement) => void;
    panelKey: string;
  }>();

  const containerRef = ref<HTMLElement | null>(null);

  const renderPanel = () => {
    if (containerRef.value && props.renderFn) {
      containerRef.value.innerHTML = '';
      props.renderFn(containerRef.value);
    }
  };

  onMounted(() => {
    renderPanel();
  });

  watch(
    () => props.panelKey,
    () => {
      renderPanel();
    },
  );

  onBeforeUnmount(() => {
    if (containerRef.value) {
      containerRef.value.innerHTML = '';
    }
  });
</script>

<template>
  <div ref="containerRef" class="w-full max-w-none space-y-6" />
</template>
