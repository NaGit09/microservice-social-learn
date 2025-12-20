<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUserStatsApi, getPostStatsApi } from '@/services/api/admin.api';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const loading = ref(true);

const stats = ref({
    totalUsers: 0,
    newUsersToday: 0,
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
});

const chartData = ref({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
            label: 'New Users',
            backgroundColor: '#f87979',
            data: [] as number[],
            borderColor: '#4299e1',
            tension: 0.4
        }
    ]
});

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    }
};

const fetchData = async () => {
    loading.value = true;
    try {
        const [userStats, postStats] = await Promise.all([
            getUserStatsApi(),
            getPostStatsApi()
        ]);

        stats.value = {
            totalUsers: userStats.totalUsers || 0,
            newUsersToday: userStats.newUsersToday || 0,
            totalPosts: postStats.totalPosts || 0,
            totalComments: postStats.totalComments || 0,
            totalLikes: postStats.totalLikes || 0,
        };

        if (userStats.monthlyData && chartData.value.datasets[0]) {
            chartData.value.datasets[0].data = userStats.monthlyData;
        }

    } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
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
                        <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalUsers }}</div>
                        <p class="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-1">
                            <span class="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            +{{ stats.newUsersToday }} today
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
                        <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalPosts }}</div>
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
                        <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalLikes }}</div>
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
                        <div class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalComments }}</div>
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
                            <Button variant="outline"
                                class="w-full text-white justify-start gap-3 h-12 text-base bg-white/50 dark:bg-black/20 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-0 shadow-sm transition-all hover:translate-x-1 group">
                                <div
                                    class="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                    <UserPlus class="w-4 h-4" />
                                </div>
                                Create New User
                            </Button>
                            <Button variant="outline"
                                class="w-full text-white justify-start gap-3 h-12 text-base bg-white/50 dark:bg-black/20 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-0 shadow-sm transition-all hover:translate-x-1 group">
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
