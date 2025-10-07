import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
// config pinia 
const pinia  = createPinia();
app.use(pinia)

app.mount('#app')
