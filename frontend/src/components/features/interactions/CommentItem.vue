<script setup lang="ts">
import { getUserInfoApi } from "@/services/api/user.api";
import type { Comment } from "@/types/comment.type"
import type { UserInfo } from "@/types/user.type";
import { onMounted, ref } from "vue";
import Like from "./Like.vue";

const props = defineProps<{
    comment: Comment,
    likes : number,
}>()

const userInfo = ref<UserInfo>()
onMounted(async () => {
    userInfo.value = await getUserInfoApi(props.comment.userId)
})
</script>

<template>
    <div class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 transition">

        <!-- AVATAR -->
        <img :src="userInfo?.avatar?.url ?? ''" class="w-10 h-10 rounded-full object-cover" />

        <div class="flex-1">
            <!-- USERNAME + CONTENT -->
            <p class="text-sm leading-snug">
                <span class="font-semibold mr-2 hover:underline cursor-pointer dark:text-gray-50">
                    {{ userInfo?.username }}
                </span>
                <span class="dark:text-gray-50">{{ comment.content }}</span>
            </p>

            <!-- TIMESTAMP + ACTION -->
            <div class="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                <button class="hover:underline text-gray-500 dark:text-gray-400">
                    Reply
                </button>
            </div>
        </div>

        <!-- LIKE BUTTON FOR COMMENT -->
        <Like :total-like="likes" :target-id="comment._id" target-type="comment" :isInitiallyLiked="false"/>
    </div>
</template>
