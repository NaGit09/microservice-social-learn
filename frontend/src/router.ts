import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import profile from "./views/profile";
import messages from "./views/message";
import main from "./views/main";
import auth from "./views/auth";
import Suggestions from "./views/suggestion/Suggestions.vue";
import AdminDashboard from "./views/admin/AdminDashboard.vue";


const routes: RouteRecordRaw[] = [
    { path: "/login", component: auth, name: "login" },
    { path: "/", component: main, name: "main" },
    { path: "/message", component: messages, name: "message" },
    { path: "/profile/:id", component: profile, name: "profile" },
    { path: "/suggestions", component: Suggestions, name: "suggestions" },
    {
        path: "/admin",
        component: AdminDashboard,
        name: "admin",
        redirect: "/admin/dashboard",
        children: [
            { path: "dashboard", component: () => import("./views/admin/DashboardHome.vue"), name: "admin-dashboard" },
            { path: "users", component: () => import("./views/admin/UserManagement.vue"), name: "admin-users" },
            { path: "posts", component: () => import("./views/admin/PostManagement.vue"), name: "admin-posts" }
        ]
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})