<script setup lang="ts">
  import { useViewStore } from '@/stores/viewStore';
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import PluginViewContainer from './PluginViewContainer.vue';

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
