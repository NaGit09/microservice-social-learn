<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllUsersApi, deleteUserApi, banUserApi, updateUserRoleApi } from '@/services/api/admin.api';
import type { Account } from '@/types/auth.type';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    MoreHorizontal,
    Trash2,
    Ban,
    UserCog
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const users = ref<Account[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

const fetchUsers = async () => {
    loading.value = true;
    try {
        const res = await getAllUsersApi(currentPage.value, itemsPerPage);
        users.value = res.users;
    } catch (error) {
        toast.error('Failed to fetch users');
    } finally {
        loading.value = false;
    }
};

const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
        await deleteUserApi(id);
        toast.success('User deleted successfully');
        fetchUsers();
    } catch (error) {
        toast.error('Failed to delete user');
    }
};

const handleBan = async (id: string) => {
    if (!confirm('Are you sure you want to ban/unban this user?')) return;
    try {
        await banUserApi(id);
        toast.success('User status updated');
        fetchUsers();
    } catch (error) {
        toast.error('Failed to update user status');
    }
};

const handleRoleUpdate = async (id: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    try {
        await updateUserRoleApi(id, newRole);
        toast.success('User role updated');
        fetchUsers();
    } catch (error) {
        toast.error('Failed to update role');
    }
};

onMounted(() => {
    fetchUsers();
});
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">User Management</h2>
                <p class="text-muted-foreground">Manage user accounts, roles, and permissions.</p>
            </div>
        </div>

        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead class="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-if="loading">
                        <TableCell colspan="5" class="h-24 text-center">
                            Loading...
                        </TableCell>
                    </TableRow>
                    <TableRow v-else-if="users.length === 0">
                        <TableCell colspan="5" class="h-24 text-center">
                            No users found.
                        </TableCell>
                    </TableRow>
                    <TableRow v-for="user in users" :key="user.id">
                        <TableCell>
                            <div class="flex flex-col">
                                <span class="font-medium">{{ user.username }}</span>
                                <span class="text-xs text-muted-foreground">{{ user.email }}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline"
                                :class="user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'">
                                {{ user.role }}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge :variant="user.isActive ? 'default' : 'destructive'">
                                {{ user.isActive ? 'Active' : 'Banned' }}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {{ new Date(user.createdAt).toLocaleDateString() }}
                        </TableCell>
                        <TableCell class="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger as-child>
                                    <Button variant="ghost" class="h-8 w-8 p-0">
                                        <span class="sr-only">Open menu</span>
                                        <MoreHorizontal class="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem @click="handleRoleUpdate(user.id, user.role)">
                                        <UserCog class="mr-2 h-4 w-4" />
                                        <span>Change Role</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem @click="handleBan(user.id)">
                                        <Ban class="mr-2 h-4 w-4" />
                                        <span>{{ user.isActive ? 'Ban User' : 'Unban User' }}</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem @click="handleDelete(user.id)" class="text-red-600">
                                        <Trash2 class="mr-2 h-4 w-4" />
                                        <span>Delete User</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>
