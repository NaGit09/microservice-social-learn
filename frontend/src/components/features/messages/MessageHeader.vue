<script setup lang="ts">
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { Phone, Cctv, EllipsisVertical } from 'lucide-vue-next'
const props = defineProps({
    isGroup: Boolean,
    groupAvatar: String,
    groupname: String,
})
const useUser = useUserStore()
const { userInfo } = storeToRefs(useUser)
</script>

<template>
    <div class="absolute top-0 left-0 w-full h-16 bg-white dark:bg-black 
         flex items-center justify-between border-b border-gray-200 px-3 z-10">

        <div class="flex items-center gap-3">
            <img :src="isGroup ? groupAvatar : userInfo?.avatar.url" class="w-10 h-10 rounded-full object-cover" />

            <div class="flex flex-col">
                <h5 class="font-bold text-[15px] m-0">
                    {{ isGroup ? groupname : userInfo?.fullname }}
                </h5>
                <p class="text-xs text-gray-400 m-0">
                    {{ !isGroup ? userInfo?.username : '' }}
                </p>
            </div>
        </div>

        <div class="flex gap-4 items-center">
            <Phone />
            <Cctv />
            <EllipsisVertical />
        </div>
    </div>

</template>
