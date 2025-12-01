import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import profile from "./views/profile";
import messages from "./views/message";
import main from "./views/main";
import auth from "./views/auth";
import Suggestions from "./views/suggestion/Suggestions.vue";

const routes: RouteRecordRaw[] = [
    { path: "/login", component: auth, name: "login" },
    { path: "/", component: main, name: "main" },
    { path: "/message", component: messages, name: "message" },
    { path: "/profile/:id", component: profile, name: "profile" },
    { path: "/suggestions", component: Suggestions, name: "suggestions" }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})