<script setup lang="ts">
import { useUserStore } from '@/stores/user.store'
import { storeToRefs } from 'pinia'
import { Phone, Cctv, EllipsisVertical } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
    isGroup: Boolean,
    groupAvatar: String,
    groupname: String,
    userId: String,
})
const useUser = useUserStore()
const { paticipants } = storeToRefs(useUser)

const otherUser = computed(() => {
    return paticipants.value.find((p) => p.id !== props.userId)
})

const avatar = computed(() => {
    if (props.isGroup) {
        if(props.groupAvatar){
            return props.groupAvatar
        }
        return '/src/assets/group-svgrepo-com.svg'
    }
    if (!otherUser.value?.avatar) {
        return 'CF'
    }
   
    return otherUser.value?.avatar.url
})
</script>

<template>
    <div class="absolute top-0 left-0 w-[calc(100%-24px)]  h-16 bg-white dark:bg-black 
         flex items-center justify-between border-b border-gray-200 px-3 z-10">

        <div class="flex items-center gap-3">
            <img :src="avatar" class="w-10 h-10 rounded-full object-cover" />

            <div class="flex flex-col">
                <h5 class="font-bold text-[15px] m-0">
                    {{ isGroup ? groupname : otherUser?.fullname }}
                </h5>
                <p class="text-xs text-gray-400 m-0">
                    {{ isGroup ? '' : otherUser?.username }}
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
