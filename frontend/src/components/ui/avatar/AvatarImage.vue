<script setup lang="ts">
import type { AvatarImageProps } from "reka-ui"
import { AvatarImage } from "reka-ui"
import { ref, watch } from 'vue'

const props = defineProps<AvatarImageProps>()

const fallbackAvatar = "https://nlyexidgtzdfthpbmrba.supabase.co/storage/v1/object/sign/uploads/IMG_7884.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hMzZjMDg0MC05YmExLTQ4MWYtYWMxYy0xY2ZkYTlmM2U1NzEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ1cGxvYWRzL0lNR183ODg0LmpwZWciLCJzY29wZSI6ImRvd25sb2FkIiwiaWF0IjoxNzgyMzc3ODQ5LCJleHAiOjE3ODQ5Njk4NDl9.8I7BjOgZzhe0udUzStBOJbRSiANi78b6sRClGLuWeIA"

const currentSrc = ref(props.src)

watch(() => props.src, (newSrc) => {
  currentSrc.value = newSrc
})

const handleError = () => {
  if (currentSrc.value !== fallbackAvatar) {
    currentSrc.value = fallbackAvatar
  }
}
</script>

<template>
  <AvatarImage
    data-slot="avatar-image"
    v-bind="props"
    :src="currentSrc"
    @error="handleError"
    class="aspect-square size-full"
  >
    <slot />
  </AvatarImage>
</template>
