import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router/router';

const app = createApp(App)
// config pinia 
const pinia  = createPinia();
app.use(pinia)
app.use(router).mount('#app')
app.mount('#app')
