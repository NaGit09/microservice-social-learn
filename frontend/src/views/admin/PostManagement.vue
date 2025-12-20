<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllPostsApi, deletePostApi, getAllCommentsApi, deleteCommentApi } from '@/services/api/admin.api';
import type { PostDetail } from '@/types/post.type';
import type { CommentDetail, CommentResp } from '@/types/comment.type';
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

const posts = ref<PostDetail[]>([]);
const comments = ref<CommentDetail[]>([]);
const loading = ref(false);

const currentPage = ref(1);
const totalPages = ref(1);  

const fetchData = async (type: 'posts' | 'comments' = 'posts') => {
    loading.value = true;
    try {
        if (type === 'posts') {
            const response = await getAllPostsApi(currentPage.value, 10);
            posts.value = response.posts;
        } else {
            const response = await getAllCommentsApi(currentPage.value, 10);
            comments.value = response.comments;
        }
    } catch (error) {
        toast.error(`Failed to fetch ${type}`);
    } finally {
        loading.value = false;
    }
};

const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
        await deletePostApi(id);
        toast.success('Post deleted successfully');
        fetchData('posts');
    } catch (error) {
        toast.error('Failed to delete post');
    }
};

const handleDeleteComment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
        await deleteCommentApi(id);
        toast.success('Comment deleted successfully');
        fetchData('comments');
    } catch (error) {
        toast.error('Failed to delete comment');
    }
};

onMounted(() => {
    fetchData('posts');
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
                <TabsTrigger value="posts" @click="fetchData('posts')">Posts</TabsTrigger>
                <TabsTrigger value="comments" @click="fetchData('comments')">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" class="space-y-4">
                <div class="rounded-md border">
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
                <div class="rounded-md border">
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
