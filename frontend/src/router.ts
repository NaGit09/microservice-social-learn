import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import profile from "./views/profile";
import messages from "./views/message";
import main from "./views/main";
import Auth from "./views/auth/Auth.vue";

const routes: RouteRecordRaw[] = [
    {
        path: "/login",
        component: Auth,
    },
    {
        path: "/",
        component: main
    },
    {
        path: "/message",
        component : messages
    },
    {
        path: "/profile",
        component : profile
    }
]
export const router = createRouter({
    history: createWebHistory(),
    routes,
})