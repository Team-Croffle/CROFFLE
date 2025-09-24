<template>
  <div id="app">
    <header class="app-header">
      <h1>Electron + Vue + TypeScript</h1>
      <div class="window-controls">
        <button class="control-btn" @click="minimizeWindow">−</button>
        <button class="control-btn" @click="maximizeWindow">□</button>
        <button class="control-btn" @click="closeWindow">×</button>
      </div>
    </header>

    <main class="app-main">
      <h1>{{ title }}</h1>
      <p>{{ message }}</p>
      <button @click="incrementCounter">Count: {{ counter }}</button>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  const title = ref<string>('Electron + Vue + TypeScript');
  const message = ref<string>('Hello from Vue renderer!');
  const counter = ref<number>(0);

  const incrementCounter = (): void => {
    counter.value++;
  };
  const minimizeWindow = async () => {
    await window.electronAPI?.minimize();
  };

  const maximizeWindow = async () => {
    await window.electronAPI?.maximize();
  };

  const closeWindow = async () => {
    await window.electronAPI?.close();
  };
</script>

<style scoped>
  .app {
    text-align: center;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    background: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    background: #005a9e;
  }
</style>
