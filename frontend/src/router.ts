import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import profile from "./views/profile";
import messages from "./views/message";
import main from "./views/main";
import auth from "./views/auth";

const routes: RouteRecordRaw[] = [
    {
        path: "/login",
        component: auth,
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
        path: "/profile/:id",
        component : profile
    }
]
export const router = createRouter({
    history: createWebHistory(),
    routes,
})