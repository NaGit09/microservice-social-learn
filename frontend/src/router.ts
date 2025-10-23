import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import profile from "./views/profile";
import messages from "./views/message";
import Home from "./views/home";
import main from "./views/main";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        component : Home
    },
    {
        path: "/main",
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