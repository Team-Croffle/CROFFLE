<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <div class="plugin-container">
    <h1 class="plugin-title">Vue Feature Plugin</h1>
    <div class="plugin-card">
      <p class="plugin-text">This is a feature view rendered by the My Feature Plugin.</p>
      <button @click="count++" class="plugin-btn">Clicked {{ count }} times</button>
    </div>
  </div>
</template>

<style scoped>
.plugin-container {
  padding: 1.5rem;
}
.plugin-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--croffle-text, #333);
}
.plugin-card {
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}
.plugin-text {
  color: var(--croffle-text, #666);
  margin-bottom: 1rem;
}
.plugin-btn {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: #fff;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}
.plugin-btn:hover {
  opacity: 0.9;
}

/* 다크모드 대응 */
:global(.dark) .plugin-card {
  border-color: #262626;
  background-color: #171717;
}
:global(.dark) .plugin-text {
  color: #a3a3a3;
}
</style>
