<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { storeToRefs } from 'pinia';
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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    MoreHorizontal,
    Trash2,
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const adminStore = useAdminStore();
const { posts, comments, loading, postMetadata, commentMetadata } = storeToRefs(adminStore);

const currentPage = ref(1);
const currentTab = ref<'posts' | 'comments'>('posts');

const fetchData = async (type: 'posts' | 'comments', page = 1) => {
    currentTab.value = type;
    currentPage.value = page;
    if (type === 'posts') {
        await adminStore.fetchPosts(page, 10);
    } else {
        await adminStore.fetchComments(page, 10);
    }
};

const handleScroll = async (event: Event) => {
    const target = event.target as HTMLElement;
    // console.log(`[PostManagement] Scroll - scrollTop: ${target.scrollTop}, clientHeight: ${target.clientHeight}, scrollHeight: ${target.scrollHeight}`);

    if (loading.value) return;

    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 50) {
        console.log('[PostManagement] Bottom reached');
        if (currentTab.value === 'posts') {
            if (postMetadata.value && currentPage.value < postMetadata.value.lastPage) {
                console.log(`[PostManagement] Loading posts page ${currentPage.value + 1}`);
                currentPage.value++;
                await adminStore.fetchPosts(currentPage.value, 10);
            } else {
                console.log('[PostManagement] No more post pages');
            }
        } else {
            if (commentMetadata.value && currentPage.value < commentMetadata.value.lastPage) {
                console.log(`[PostManagement] Loading comments page ${currentPage.value + 1}`);
                currentPage.value++;
                await adminStore.fetchComments(currentPage.value, 10);
            } else {
                console.log('[PostManagement] No more comment pages');
            }
        }
    }
};

const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
        await adminStore.deletePost(id);
        toast.success('Post deleted successfully');
    } catch (error) {
        toast.error('Failed to delete post');
    }
};

const handleDeleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
        await adminStore.deleteComment(id);
        toast.success('Comment deleted successfully');
    } catch (error) {
        toast.error('Failed to delete comment');
    }
};

onMounted(() => {
    fetchData('posts', 1);
});
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-2xl font-bold tracking-tight">Content Management</h2>
                <p class="text-muted-foreground">Manage user posts and comments.</p>
            </div>
        </div>

        <Tabs defaultValue="posts" class="space-y-4">
            <TabsList>
                <TabsTrigger value="posts" @click="fetchData('posts', 1)">Posts</TabsTrigger>
                <TabsTrigger value="comments" @click="fetchData('comments', 1)">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" class="space-y-4">
                <div @scroll="handleScroll" class="rounded-md border max-h-[calc(100vh-250px)] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Author</TableHead>
                                <TableHead class="w-[400px]">Content</TableHead>
                                <TableHead>Shares</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-if="loading">
                                <TableCell colspan="5" class="h-24 text-center">Loading...</TableCell>
                            </TableRow>
                            <TableRow v-else-if="posts.length === 0">
                                <TableCell colspan="5" class="h-24 text-center">No posts found.</TableCell>
                            </TableRow>
                            <TableRow v-for="post in posts" :key="post.id">
                                <TableCell class="font-medium">{{ post.author }}</TableCell>
                                <TableCell>
                                    <p class="truncate max-w-[400px]">{{ post.caption || 'No text content' }}</p>
                                    <div v-if="post.files?.length" class="mt-1 flex gap-1">
                                        <Badge variant="secondary" class="text-xs">
                                            {{ post.files.length }} files
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>{{ post.shares }}</TableCell>
                                <TableCell>{{ new Date(post.createdAt).toLocaleDateString() }}</TableCell>
                                <TableCell class="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <Button variant="ghost" class="h-8 w-8 p-0">
                                                <MoreHorizontal class="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem @click="handleDeletePost(post.id)" class="text-red-600">
                                                <Trash2 class="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </TabsContent>

            <TabsContent value="comments" class="space-y-4">
                <div @scroll="handleScroll" class="rounded-md border max-h-[calc(100vh-250px)] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Author</TableHead>
                                <TableHead class="w-[400px]">Comment</TableHead>
                                <TableHead>Post ID</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead class="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow v-if="loading">
                                <TableCell colspan="5" class="h-24 text-center">Loading...</TableCell>
                            </TableRow>
                            <TableRow v-else-if="comments.length === 0">
                                <TableCell colspan="5" class="h-24 text-center">No comments found.</TableCell>
                            </TableRow>
                            <TableRow v-for="comment in comments" :key="comment.id">
                                <TableCell class="font-medium">{{ comment.userId }}</TableCell>
                                <TableCell>
                                    <p class="truncate max-w-[400px]">{{ comment.content }}</p>
                                </TableCell>
                                <TableCell>
                                    <span class="text-xs text-muted-foreground font-mono">{{ comment.postId.substring(0,
                                        8) }}...</span>
                                </TableCell>
                                <TableCell>{{ new Date(comment.createdAt).toLocaleDateString() }}</TableCell>
                                <TableCell class="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger as-child>
                                            <Button variant="ghost" class="h-8 w-8 p-0">
                                                <MoreHorizontal class="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem @click="handleDeleteComment(comment.id)"
                                                class="text-red-600">
                                                <Trash2 class="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </TabsContent>
        </Tabs>
    </div>
</template>
