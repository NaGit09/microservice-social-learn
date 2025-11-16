<script setup lang="ts">
import { computed } from 'vue'
import File from '../Common/file/File.vue'
import {
  CarouselContent,
  CarouselPrevious,
  Carousel,
  CarouselNext,
  CarouselItem,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'

const props = defineProps({
  files: {
    type: Array as () => any[],
    default: () => [],
  },
})

const imageFiles = computed(() => {
  return props.files.filter((f) => f && f.type && f.type.includes('image/'))
})

const otherFiles = computed(() => {
  return props.files.filter((f) => !f || !f.type || !f.type.includes('image/'))
})
</script>

<template>
  <div>
    <div v-if="imageFiles.length > 0" class="image-carousel-container border-none">
      <Carousel class="relative w-full max-w border-none">
        <CarouselContent>
          <CarouselItem v-for="(item, index) in imageFiles" :key="index">
            <div class="p-0">
              <Card class="p-0 border-none">
                <CardContent class="flex items-center justify-center p-0 max-w-[500px] max-h-[600px]">
                  <img :src="item.url" alt="" class="h-full w-full object-contain" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        </CarouselContent>
        <div v-if="imageFiles.length > 1">
          <CarouselPrevious class="dark:text-gray-200" />
          <CarouselNext class="dark:text-gray-200" />
        </div>
      </Carousel>
    </div>

    <div v-if="otherFiles.length > 0" class="other-files-list">
      <File v-for="(file, idx) in otherFiles" :key="String(file && file.fileId ? file.fileId : idx)" v-bind="file" />
    </div>
  </div>
</template>
