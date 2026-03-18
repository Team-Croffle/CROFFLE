import './index.css';

import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { pluginLoader } from './services/PluginLoader';
import router from './router';
// import { initTestPlugin } from './test/testPluginMenu';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
// initTestPlugin();

// 여기서 플러그인을 로드만 함.
pluginLoader.init().then(() => {
  app.mount('#app');
});
