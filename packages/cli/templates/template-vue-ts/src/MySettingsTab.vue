<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>

<template>
  <div class="plugin-container">
    <h2>Hello from Vue Plugin!</h2>
    <p>This is a custom settings tab rendered using Vue 3.</p>
    <button @click="count++">Count is: {{ count }}</button>
  </div>
</template>

<style scoped>
.plugin-container {
  padding: 20px;
  font-family: sans-serif;
  border-radius: 8px;
}
button {
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  opacity: 0.9;
}
</style>
