<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  import { useViewStore } from '@/stores/view-store';

  import PluginViewContainer from './extension-view-container.vue';

  const route = useRoute();
  const viewStore = useViewStore();

  const currentViewId = computed(() => route.params.viewId as string);

  const currentPluginRenderFn = computed(() => viewStore.views.get(currentViewId.value));
</script>

<template>
  <PluginViewContainer
    v-if="currentPluginRenderFn"
    :key="currentViewId"
    :view-id="currentViewId"
    :render-fn="currentPluginRenderFn"
  />
  <div v-else>View not found</div>
</template>
