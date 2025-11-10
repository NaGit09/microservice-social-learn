<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Forward, BookHeart } from 'lucide-vue-next'
</script>
<template>
    <div class="flex items-center justify-between mx-2">
        <div class="flex gap-2">
            <Button>
                <Heart />
            </Button>
            <Button>
                <MessageCircle />
            </Button>
            <Button>
                <Forward />
            </Button>
        </div>
        <div class="flex items-center justify-center">
            <Button>
                <BookHeart />
            </Button>
        </div>
    </div>
</template>
<style></style>
