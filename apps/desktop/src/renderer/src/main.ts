// oxlint-disable-next-line import/no-unassigned-import
import './index.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
// import { initTestPlugin } from './test/testPluginMenu';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
// initTestPlugin();

app.mount('#app');
