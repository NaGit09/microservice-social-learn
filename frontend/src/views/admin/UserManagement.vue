<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import { storeToRefs } from 'pinia'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, X, MoreHorizontal, Trash2, Ban, UserCog, KeyRound } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import type { Account } from '@/types/auth.type'

const adminStore = useAdminStore()
const { users, loading, userMetadata } = storeToRefs(adminStore)
const currentPage = ref(1)
const itemsPerPage = 10

const fetchUsers = async () => {
  await adminStore.fetchUsers(currentPage.value, itemsPerPage)
}

const handleScroll = async (event: Event) => {
  const target = event.target as HTMLElement

  if (loading.value) return

  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
    console.log('[UserManagement] Bottom reached')
    console.log(userMetadata.value)

    if (userMetadata.value && currentPage.value < userMetadata.value.lastPage) {
      console.log(`[UserManagement] Loading page ${currentPage.value + 1}`)
      currentPage.value++
      console.log(currentPage.value)
      await fetchUsers()
    } else {
      console.log('[UserManagement] No more pages or metadata missing')
    }
  }
}


const isConfirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const confirmVariant = ref<'default' | 'destructive'>('default')
const onConfirm = ref<() => Promise<void> | void>(() => { })
const isConfirming = ref(false)

const openConfirm = (
  title: string,
  message: string,
  variant: 'default' | 'destructive',
  action: () => Promise<void> | void,
) => {
  confirmTitle.value = title
  confirmMessage.value = message
  confirmVariant.value = variant
  onConfirm.value = action
  isConfirmOpen.value = true
}

const handleConfirmAction = async () => {
  isConfirming.value = true
  try {
    await onConfirm.value()
    isConfirmOpen.value = false
  } finally {
    isConfirming.value = false
  }
}

const handleDelete = (id: string) => {
  openConfirm(
    'Delete User',
    'Are you sure you want to delete this user? This action cannot be undone.',
    'destructive',
    async () => {
      try {
        await adminStore.deleteUser(id)
        toast.success('User deleted successfully')
      } catch (error) {
        toast.error('Failed to delete user')
      }
    },
  )
}

const handleBan = (id: string, isActive: boolean) => {
  const action = isActive ? 'Ban' : 'Unban'
  openConfirm(
    `${action} User`,
    `Are you sure you want to ${action.toLowerCase()} this user?`,
    'destructive',
    async () => {
      try {
        if (isActive) {
          await adminStore.unbanUser(id)
        } else {
          await adminStore.banUser(id)
        }
        toast.success(`User ${action.toLowerCase()}ned successfully`)
      } catch (error) {
        toast.error(`Failed to ${action.toLowerCase()} user`)
      }
    },
  )
}

const handleRoleUpdate = (id: string, currentRole: string) => {
  const newRole = currentRole === 'admin' ? 'user' : 'admin'
  openConfirm(
    'Change User Role',
    `Are you sure you want to change the user role to ${newRole}?`,
    'default',
    async () => {
      try {
        await adminStore.updateUserRole(id, newRole)
        toast.success('User role updated')
      } catch (error) {
        toast.error('Failed to update role')
      }
    },
  )
}

const handleResetPassword = (id: string, username: string) => {
  openConfirm(
    'Reset Password',
    `Are you sure you want to reset the password for ${username}? The password will be set to 'Pass@123'.`,
    'destructive',
    async () => {
      try {
        await adminStore.resetUserPassword(id)
        toast.success(`Password for ${username} reset successfully`)
      } catch (error) {
        toast.error('Failed to reset password')
      }
    },
  )
}

// Permission Management
const isPermissionDialogOpen = ref(false)
const selectedUserForPermissions = ref<Account | null>(null)
const newPermission = ref('')
const isProcessingPermission = ref(false)

const openPermissionDialog = (user: Account) => {
  selectedUserForPermissions.value = user
  newPermission.value = ''
  isPermissionDialogOpen.value = true
}

const handleAddPermission = async () => {
  if (!selectedUserForPermissions.value || !newPermission.value.trim()) return

  isProcessingPermission.value = true
  try {
    await adminStore.addPermission(selectedUserForPermissions.value.id, newPermission.value.trim())
    toast.success('Permission added successfully')
    newPermission.value = ''
  } catch (error) {
    toast.error('Failed to add permission')
  } finally {
    isProcessingPermission.value = false
  }
}

const handleRemovePermission = async (permission: string) => {
  if (!selectedUserForPermissions.value) return
  if (!confirm(`Are you sure you want to remove permission "${permission}"?`)) return

  isProcessingPermission.value = true
  try {
    await adminStore.removePermission(selectedUserForPermissions.value.id, permission)
    toast.success('Permission removed successfully')
  } catch (error) {
    toast.error('Failed to remove permission')
  } finally {
    isProcessingPermission.value = false
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">User Management</h2>
        <p class="text-muted-foreground">
          Manage user accounts, roles, and permissions.
        </p>
      </div>
    </div>

    <div ref="tableContainer" @scroll="handleScroll"
      class="rounded-md border max-h-[calc(100vh-250px)] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Index</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
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
          <TableRow v-for="user, index in users" :key="user.id">
            <TableCell>{{ index + 1 }}</TableCell>
            <TableCell>
              <div class="flex flex-col">
                <span class="font-medium">{{ user.username }}</span>
                <span class="text-xs text-muted-foreground">{{
                  user.fullname
                  }}</span>
              </div>
            </TableCell>
            <TableCell>
              {{ user.email }}
            </TableCell>
            <TableCell>
              <Badge variant="outline" :class="user.role === 'admin'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
                ">
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
                    <MoreHorizontal class="h-4 w-4 dark:text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem @click="handleRoleUpdate(user.id, user.role)">
                    <UserCog class="mr-2 h-4 w-4" />
                    <span>Change Role</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="openPermissionDialog(user)">
                    <Shield class="mr-2 h-4 w-4" />
                    <span>Manage Permissions</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleResetPassword(user.id, user.username)">
                    <KeyRound class="mr-2 h-4 w-4" />
                    <span>Reset Password</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem @click="handleBan(user.id, user.isActive)">
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


    <Dialog :open="isConfirmOpen" @update:open="isConfirmOpen = $event">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ confirmTitle }}</DialogTitle>
          <DialogDescription>
            {{ confirmMessage }}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="isConfirmOpen = false">
            Cancel
          </Button>
          <Button :variant="confirmVariant" @click="handleConfirmAction" :disabled="isConfirming">
            {{ isConfirming ? 'Processing...' : 'Confirm' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="isPermissionDialogOpen" @update:open="isPermissionDialogOpen = $event">
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            Add or remove permissions for user {{ selectedUserForPermissions?.username }}.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="flex items-center gap-2">
            <Input v-model="newPermission" placeholder="Enter permission name" @keyup.enter="handleAddPermission" />
            <Button size="sm" @click="handleAddPermission" :disabled="isProcessingPermission || !newPermission">
              Add
            </Button>
          </div>

          <div class="flex flex-wrap gap-2 mt-2">
            <div v-for="permission in selectedUserForPermissions?.permissions || []" :key="permission"
              class="flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-0.5 rounded-full text-xs font-semibold">
              {{ permission }}
              <Button variant="ghost" size="icon"
                class="h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-full -mr-1"
                @click="handleRemovePermission(permission)" :disabled="isProcessingPermission">
                <X class="h-3 w-3" />
              </Button>
            </div>
            <p v-if="(!selectedUserForPermissions?.permissions || selectedUserForPermissions.permissions.length === 0)"
              class="text-sm text-muted-foreground italic">
              No permissions assigned.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
