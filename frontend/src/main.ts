import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router';
import { createNotivue } from 'notivue'
import 'notivue/notifications.css'
import 'notivue/animations.css' 

const app = createApp(App)
const pinia = createPinia();
const notivue = createNotivue();


app.use(pinia)
app.use(router)
app.use(notivue)
app.mount('#app')
