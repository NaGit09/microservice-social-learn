import Login from '@/views/Login .vue'
import Register from '@/views/Register.vue'
import { createMemoryHistory, createRouter } from 'vue-router'



const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})