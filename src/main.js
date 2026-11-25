import { createApp } from 'vue';
import './styles/tokens.css';
import './styles/base.css';
import './styles/tema-elev.css';
import App from './App.vue';
import { router } from './router.js';

createApp(App).use(router).mount('#app');
