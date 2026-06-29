<script setup lang="ts">
import { ref } from 'vue';
import type { Post } from '@/types/post.type';
import { Heart, MessageCircle, Layers, FileText, Play } from 'lucide-vue-next';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import PostHeader from '../../features/feed/PostHeader.vue';
import PostMedia from '../../features/feed/PostMedia.vue';
import PostCaption from '../../features/feed/PostCaption.vue';
import PostFeature from '../../features/feed/PostFeature.vue';
import FastComment from '../../features/interactions/FastComment.vue';

defineProps<{
    posts: Post[]
}>()

const selectedPost = ref<Post | null>(null);
</script>

<template>
  <div class="w-full max-w-[935px] mx-auto px-4 py-8 border-t border-border mt-8">
    <!-- Header Title -->
    <div class="flex items-center justify-center gap-1.5 mb-8">
      <span class="text-[12px] font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
        Bài viết của tôi
      </span>
    </div>

    <!-- 3-Column Grid -->
    <div v-if="posts && posts.length > 0" class="grid grid-cols-3 gap-1 md:gap-4 lg:gap-6">
      <div 
        v-for="item in posts" 
        :key="String(item._id)"
        @click="selectedPost = item"
        class="aspect-square relative overflow-hidden group cursor-pointer rounded-md md:rounded-xl bg-zinc-100 dark:bg-zinc-900/50 border border-border transition-all duration-300"
      >
        <!-- Media Display (Image or Video) -->
        <template v-if="item.files && item.files.length > 0">
          <img 
            v-if="item.files[0]?.type?.includes('image/')" 
            :src="item.files[0].url" 
            alt="post-media" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-zinc-950 text-white relative">
            <Play class="size-8 text-white/80" />
          </div>

          <!-- Multiple files indicator -->
          <div v-if="item.files.length > 1" class="absolute top-3 right-3 z-10 p-1.5 bg-black/40 backdrop-blur-md rounded-lg text-white">
            <Layers class="size-4" />
          </div>
        </template>

        <!-- No media (Text-only post) -->
        <template v-else>
          <div class="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/10 to-indigo-500/10 text-center relative">
            <FileText class="size-6 text-primary mb-2 opacity-60" />
            <p class="text-xs font-medium text-zinc-700 dark:text-zinc-300 line-clamp-4 px-2">
              {{ item.caption }}
            </p>
          </div>
        </template>

        <!-- Hover Overlay (Likes & Comments) -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center gap-6 text-white font-semibold text-sm md:text-base">
          <div class="flex items-center gap-1.5 hover:scale-110 transition-transform">
            <Heart class="size-5 fill-white stroke-none" />
            <span>{{ item.totalLike || 0 }}</span>
          </div>
          <div class="flex items-center gap-1.5 hover:scale-110 transition-transform">
            <MessageCircle class="size-5 fill-white stroke-none" />
            <span>{{ item.totalComment || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-zinc-400 dark:text-zinc-500 py-16 flex flex-col items-center gap-3">
      <FileText class="size-12 text-zinc-300 dark:text-zinc-800" />
      <span class="text-sm">Chưa có bài viết nào.</span>
    </div>

    <!-- Post Detail Modal (Instagram style) -->
    <Dialog :open="!!selectedPost" @update:open="selectedPost = null">
      <DialogContent class="max-w-[550px] p-0 overflow-hidden border border-border bg-card shadow-2xl rounded-2xl">
        <div v-if="selectedPost" class="flex flex-col w-full relative">
          <!-- Subtle top gradient border for question posts -->
          <div v-if="selectedPost.type === 'question'" class="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-primary to-indigo-500 z-10" />
          
          <div class="flex justify-between items-center pr-4 pl-1 pt-1 border-b border-border bg-card">
            <PostHeader :author-id="selectedPost.author" />
            <div v-if="selectedPost.type === 'question'" class="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/10 rounded-full border border-primary/20 shadow-xs">
              ❓ Question
            </div>
          </div>

          <!-- Post Media -->
          <div class="w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950/40 border-b border-border">
            <PostMedia :files="selectedPost.files || []" />
          </div>

          <!-- Post Content (Features + Caption) -->
          <div class="flex flex-col gap-2 px-4 pb-3 pt-2 bg-card">
            <PostFeature :post="selectedPost" :total-comment="selectedPost.totalComment ?? 0" :total-like="selectedPost.totalLike ?? 0"
              :is-liked-by-current-user="false" :userId="selectedPost.author" />
            <PostCaption :caption="selectedPost.caption" :user-id="selectedPost.author" />
          </div>

          <!-- Fast Comment Input -->
          <div class="px-4 py-3 bg-zinc-50/20 dark:bg-zinc-950/10 border-t border-border rounded-b-2xl">
            <FastComment :user-id="selectedPost.author" :post-id="selectedPost._id" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>