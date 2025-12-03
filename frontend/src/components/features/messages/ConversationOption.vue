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
import { MessageSquarePlus } from 'lucide-vue-next';
</script>

<template>
    <Dialog>
        <form>
            <DialogTrigger as-child>
                <Button class="shadow-none">
                    <component :is="MessageSquarePlus" />
                </Button>
            </DialogTrigger>
            <DialogContent class="w-[500px] bg-white dark:bg-gray-800 p-0">
                <DialogHeader class="mt-4">
                    <DialogTitle class="text-center text-black dark:text-white m-0">Tin nhắn mới</DialogTitle>
                </DialogHeader>
                <Separator class="bg-gray-200 overflow-hidden" />

                <div class="flex items-center gap-2 justify-between my-2 mx-4">
                    <p class="font-bold">Tới :</p>
                    <Input class="w-[85%] border-none text-gray-500 shadow-none" type="text" placeholder="Nhập tên người dùng" />
                </div>
                <Separator class="bg-gray-200 overflow-hidden m-0 p-0" />
                <div class="flex items-center gap-2 justify-between my-2 mx-4">
                    <p class="font-bold">Gợi ý :</p>
                </div>
            </DialogContent>

        </form>
    </Dialog>
</template>
