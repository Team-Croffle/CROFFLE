// oxlint-disable-next-line import/no-unassigned-import
import './index.css';
// oxlint-disable-next-line import/no-unassigned-import
import './lib/register-icons';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './app.vue';
import { i18n } from './i18n';
import router from './router';
// import { initTestPlugin } from './test/testPluginMenu';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
// initTestPlugin();

app.mount('#app');
