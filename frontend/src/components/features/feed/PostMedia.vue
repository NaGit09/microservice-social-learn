<script setup lang="ts">
import { computed } from "vue"
import File from "../../common/file/File.vue"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"

import { Card, CardContent } from "@/components/ui/card"

const props = defineProps({
  files: {
    type: Array as () => any[],
    default: () => [],
  },
  objectFit: { type: String, default: "cover" },
  heightClass: { type: String, default: "aspect-[4/5]" },
})

// Tối ưu: Filter 1 lần
const separatedFiles = computed(() => {
  const images: any[] = []
  const others: any[] = []

  for (const f of props.files) {
    if (f?.type?.includes("image/")) images.push(f)
    else others.push(f)
  }

  return { images, others }
})
</script>

<template>
  <div :class="{ 'h-full flex flex-col justify-center': heightClass.includes('h-') }">
    <!-- IMAGE CAROUSEL -->
    <div v-if="separatedFiles.images.length" :class="{ 'h-full': heightClass.includes('h-') }">
      <Carousel class="relative w-full select-none" :class="{ 'h-full h-full-carousel': heightClass.includes('h-') }">
        <CarouselContent :class="{ 'h-full': heightClass.includes('h-') }">
          <CarouselItem v-for="(item, index) in separatedFiles.images" :key="item.fileId || index" :class="{ 'h-full': heightClass.includes('h-') }">
            <Card class="border-none shadow-none p-0" :class="{ 'h-full': heightClass.includes('h-') }">
              <CardContent
                class="flex items-center justify-center p-0 w-full overflow-hidden bg-black/5 dark:bg-white/5"
                :class="heightClass">
                <img :src="item.url" :alt="`image-${index}`" class="w-full h-full" :class="`object-${objectFit}`" />
              </CardContent>
            </Card>

            <!-- NEXT / PREVIOUS -->
            <div v-if="separatedFiles.images.length > 1"
              class="absolute inset-0 flex justify-between items-center px-4 pointer-events-none">
              <CarouselPrevious
                class="pointer-events-auto h-10 w-10 flex items-center justify-center text-black dark:text-white bg-white/80 shadow-lg" />
              <CarouselNext
                class="pointer-events-auto h-10 w-10 flex items-center justify-center text-black dark:text-white bg-white/80 shadow-lg hover:bg-white/10 transition-all" />
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>

    <!-- OTHER FILES -->
    <div v-if="separatedFiles.others.length" class="mt-3 space-y-2">
      <File v-for="(file, idx) in separatedFiles.others" :key="file.fileId || idx" v-bind="file" />
    </div>
  </div>
</template>

<style scoped>
.h-full-carousel,
.h-full-carousel :deep([data-slot="carousel-content"]),
.h-full-carousel :deep([data-slot="carousel-content"]) > div {
  height: 100%;
}
</style>
