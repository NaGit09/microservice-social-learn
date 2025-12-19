
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllUsersApi, deleteUserApi } from '@/services/api/admin.api';
import type { AdminUser } from '@/types/admin.type';

const users = ref<AdminUser[]>([]);
const loading = ref(false);
const page = ref(1);
const totalPages = ref(1);

const fetchUsers = async () => {
    loading.value = true;
    try {
        const res: any = await getAllUsersApi(page.value, 10);
        users.value = res.data.users;
        totalPages.value = res.data.meta.lastPage;
    } catch (error) {
        console.error("Failed to fetch users", error);
    } finally {
        loading.value = false;
    }
};

const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
        await deleteUserApi(id);
        fetchUsers();
    } catch (error) {
        console.error("Failed to delete user", error);
        alert("Failed to delete user");
    }
};

onMounted(() => {
    fetchUsers();
});
</script>

<template>
    <div class="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <div v-if="loading">Loading...</div>
        <table v-else class="user-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.username }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.role }}</td>
                    <td>{{ user.isActive ? 'Yes' : 'No' }}</td>
                    <td>
                        <button @click="deleteUser(user.id)" class="delete-btn">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <button :disabled="page <= 1" @click="page--; fetchUsers()">Previous</button>
            <span>Page {{ page }} of {{ totalPages }}</span>
            <button :disabled="page >= totalPages" @click="page++; fetchUsers()">Next</button>
        </div>
    </div>
</template>

<style scoped>
.admin-dashboard {
    padding: 20px;
}
.user-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}
.user-table th, .user-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}
.user-table th {
    background-color: #f2f2f2;
}
.delete-btn {
    background-color: #ff4d4d;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
}
.pagination {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
}
</style>
