import './index.css';

import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { pluginLoader } from './services/PluginLoader';

const app = createApp(App);
const pinia = createPinia();

pluginLoader.init().then(() => {
  app.use(pinia);
  app.mount('#app');
});
