<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { useAuthStore } from '@/stores/auth.store';
import {
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
} from 'chart.js';
import { Line } from 'vue-chartjs';
import {
Users,
UserPlus,
FileText,
MessageSquare,
Heart,
} from 'lucide-vue-next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
Dialog,
DialogContent,
DialogDescription,
DialogFooter,
DialogHeader,
DialogTitle,
DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { router } from '@/router';

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
);

const adminStore = useAdminStore();
const authStore = useAuthStore();
const { dashboardStats, dashboardPostStats, loading } = storeToRefs(adminStore);

const createUserForm = ref({
fullname: '',
username: '',
email: '',
password: '',
confirmPassword: ''
});
const isCreateUserOpen = ref(false);
const createLoading = ref(false);

const handleCreateUser = async () => {
if (createUserForm.value.password !== createUserForm.value.confirmPassword) {
toast.error('Passwords do not match');
return;
}
createLoading.value = true;
try {
const success = await authStore.register({
fullname: createUserForm.value.fullname,
username: createUserForm.value.username,
email: createUserForm.value.email,
password: createUserForm.value.password
});
if (success) {
toast.success('User created successfully');
isCreateUserOpen.value = false;
// Reset form
createUserForm.value = {
fullname: '',
username: '',
email: '',
password: '',
confirmPassword: ''
};
// Refresh stats
adminStore.fetchDashboardStats();
} else {
toast.error('Failed to create user');
}
} catch (error) {
toast.error('An error occurred');
} finally {
createLoading.value = false;
}
};

const chartData = computed(() => ({
labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
datasets: [
{
label: 'New Users',
backgroundColor: '#f87979',
data: dashboardStats.value?.monthlyData || [] as number[],
borderColor: '#4299e1',
tension: 0.4
}
]
}));

const chartOptions = {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: {
display: false
}
}
};
const redirectToPost = () => {
    router.push('/admin/posts');
}
onMounted(() => {
adminStore.fetchDashboardStats();
});
</script>

<template>
    <div class="p-6 max-w-7xl mx-auto space-y-6">
        <div>
            <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Dashboard Overview</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">Platform statistics and performance metrics.</p>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            <div v-for="i in 4" :key="i" class="h-32 bg-white/20 dark:bg-white/5 rounded-xl backdrop-blur-sm"></div>
        </div>

        <div v-else class="space-y-6">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    class="relative border-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 group overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    </div>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle class="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                        <div
                            class="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                            <Users class="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent class="relative z-10">
                        <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ dashboardStats?.totalUsers
                            || 0 }}</div>
                        <p class="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-1">
                            <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            +{{ dashboardStats?.newUsersToday || 0 }} today
                        </p>
                    </CardContent>
                </Card>

                <Card
                    class="relative border-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 group overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    </div>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle class="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
                        <div
                            class="p-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                            <FileText class="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent class="relative z-10">
                        <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{
                            dashboardPostStats?.totalPosts || 0 }}</div>
                        <p class="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">Active content</p>
                    </CardContent>
                </Card>

                <Card
                    class="relative border-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-500/10 group overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    </div>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle class="text-sm font-medium text-muted-foreground">Total Likes</CardTitle>
                        <div
                            class="p-2 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform duration-300">
                            <Heart class="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent class="relative z-10">
                        <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{
                            dashboardPostStats?.totalLikes || 0 }}</div>
                        <p class="text-xs text-rose-600 dark:text-rose-400 font-medium mt-1">Platform engagement</p>
                    </CardContent>
                </Card>

                <Card
                    class="relative border-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 group overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    </div>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle class="text-sm font-medium text-muted-foreground">Total Comments</CardTitle>
                        <div
                            class="p-2 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
                            <MessageSquare class="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent class="relative z-10">
                        <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{
                            dashboardPostStats?.totalComments || 0 }}</div>
                        <p class="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">User interactions</p>
                    </CardContent>
                </Card>
            </div>

            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card class="lg:col-span-2 border-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-lg">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <span class="inline-block w-2 h-6 bg-blue-500 rounded-full"></span>
                            User Growth (This Year)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="h-80">
                            <Line :data="chartData" :options="chartOptions" />
                        </div>
                    </CardContent>
                </Card>

                <!-- Placeholder for future charts or activity feed -->
                <Card class="border-0 bg-white/40 dark:bg-black/40 backdrop-blur-xl shadow-lg flex flex-col">
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <span class="inline-block w-2 h-6 bg-amber-500 rounded-full"></span>
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="flex-1">
                        <div class="space-y-4">
                            <Dialog v-model:open="isCreateUserOpen">
                                <DialogTrigger as-child>
                                    <Button variant="outline"
                                        class="w-full dark:text-white   justify-start gap-3 h-12 text-base bg-white/50 dark:bg-black/20 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-0 shadow-sm transition-all hover:translate-x-1 group">
                                        <div
                                            class="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                            <UserPlus class="w-4 h-4" />
                                        </div>
                                        Create New User
                                    </Button>
                                </DialogTrigger>
                                <DialogContent class="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Create New User</DialogTitle>
                                        <DialogDescription>
                                            Enter the details for the new user account.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div class="grid gap-4 py-4">
                                        <div class="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="fullname" class="text-right">
                                                Full Name
                                            </Label>
                                            <Input id="fullname" v-model="createUserForm.fullname" class="col-span-3" />
                                        </div>
                                        <div class="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="username" class="text-right">
                                                Username
                                            </Label>
                                            <Input id="username" v-model="createUserForm.username" class="col-span-3" />
                                        </div>
                                        <div class="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" class="text-right">
                                                Email
                                            </Label>
                                            <Input id="email" type="email" v-model="createUserForm.email"
                                                class="col-span-3" />
                                        </div>
                                        <div class="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="password" class="text-right">
                                                Password
                                            </Label>
                                            <Input id="password" type="password" v-model="createUserForm.password"
                                                class="col-span-3" />
                                        </div>
                                        <div class="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="confirmPassword" class="text-right">
                                                Confirm
                                            </Label>
                                            <Input id="confirmPassword" type="password"
                                                v-model="createUserForm.confirmPassword" class="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" @click="handleCreateUser" :disabled="createLoading">
                                            {{ createLoading ? 'Creating...' : 'Create Account' }}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button variant="outline" @click="redirectToPost"
                                class="w-full dark:text-white justify-start gap-3 h-12 text-base bg-white/50 dark:bg-black/20 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-0 shadow-sm transition-all hover:translate-x-1 group">
                                <div
                                    class="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                    <FileText class="w-4 h-4" />
                                </div>
                                Manage Posts
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
</template>
