<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { RecommentUser } from '@/types/user.type';
import { MessageSquarePlus } from 'lucide-vue-next';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ref } from 'vue';
import type { CreateConversation } from '@/types/conversation.type';
import { useConversationStore } from '@/stores/conversation.store';
import { toast } from 'vue-sonner';

const props = defineProps<{
    userRecommend: RecommentUser[],
    ownerId : string
}>()
const useConversation = useConversationStore();
const {createConversation} = useConversation
const selectedUser = ref<string[]>([props.ownerId])
const handleSelected = (userId: string) => {
    console.log(userId);
    
    if (selectedUser.value.includes(userId)) {
        selectedUser.value = selectedUser.value.filter((id) => id !== userId)
    } else {
        selectedUser.value.push(userId)
    }
}
const hanldeCreateConversation = async () => {
    const dto: CreateConversation = {
        participants: selectedUser.value,
        isGroup: selectedUser.value.length > 2 ? true : false,
        name: 'Nhóm trò chuyện !',
        owner: props.ownerId,
        latest: null
    }
    await createConversation(dto)
    toast.success('Tạo cuộc trò chuyện thành công !')

}
</script>
<template>
    <Dialog>
        <DialogTrigger as-child>
            <Button class="shadow-none">
                <component :is="MessageSquarePlus" />
            </Button>
        </DialogTrigger>
        <DialogContent class="w-[500px] bg-white dark:bg-gray-800 p-0">
            <DialogHeader class="mt-4">
                <DialogTitle class="text-center text-black dark:text-white m-0">Tin nhắn mới</DialogTitle>
            </DialogHeader>
            <Separator class="bg-gray-200" />

            <div class="flex items-center gap-2 justify-between my-2 mx-4">
                <p class="font-bold">Tới :</p>
                <Input class="w-[85%] border-none text-gray-500 shadow-none" type="text"
                    placeholder="Nhập tên người dùng" />
            </div>
            <Separator class="bg-gray-200 overflow-hidden m-0 p-0" />
            <div class="flex items-center gap-2 justify-center my-2 mx-4 flex-col">
                <p class="font-bold text-start w-full">Gợi ý :</p>
                <ul class="list-none w-full p-0">
                    <li class="flex justify-between items-center hover:bg-gray-200 px-4 py-2 rounded-lg"
                        v-for="user in props.userRecommend" :key="user.id">
                        <div class="flex items-center gap-2">
                            <Avatar class="h-12 w-12 rounded-full border-gray-300 border-1">
                                <AvatarImage class="object-cover" :src="user.avatar?.url ?? ''"
                                    :alt="user.username ?? ''" />
                                <AvatarFallback class="rounded-lg"> CN </AvatarFallback>
                            </Avatar>
                            <div class="flex flex-col items-center ">
                                <span>{{ user.fullname }}</span>
                                <span class="text-gray-500">{{ user.username }}</span>
                            </div>
                        </div>
                        <Input :id="user.id" @click="handleSelected(user.id)" :checked="selectedUser.includes(user.id)"
                            type="radio" class="shadow-none w-[50px]" />
                    </li>
                    <li v-if="props.userRecommend.length === 0">
                        <p>Không có gợi ý</p>
                    </li>
                </ul>
                <Button @click="hanldeCreateConversation" variant="destructive" class="w-full bg-blue-400 hover:bg-blue-500 transition-colors">Tạo tin nhắn</Button>

            </div>
        </DialogContent>

    </Dialog>
</template>
