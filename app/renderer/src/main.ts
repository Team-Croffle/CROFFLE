import './index.css';

import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { pluginLoader } from './services/PluginLoader';
import { initTestPlugin } from './test/testPluginMenu';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);

initTestPlugin();

pluginLoader.init().then(() => {
  app.mount('#app');
});
