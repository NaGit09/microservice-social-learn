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
  objectFit: {
    type: String,
    default: "cover", // contain = đảm bảo scale không bị crop
  },
  heightClass: {
    type: String,
    default: "h-[500px]", // tất cả ảnh sẽ vào khung cao 500px
  },
})

const imageFiles = computed(() =>
  props.files.filter((f) => f?.type?.includes("image/"))
)

const otherFiles = computed(() =>
  props.files.filter((f) => !f?.type?.includes("image/"))
)
</script>

<template>
  <div class="w-full">

    <!-- IMAGE CAROUSEL -->
    <div v-if="imageFiles.length" class="w-full">
      <Carousel class="relative w-full select-none">
        <CarouselContent>
          <CarouselItem v-for="(item, index) in imageFiles" :key="index">
            <div class="relative w-full h-full">
              <Card class="border-none shadow-none p-0">
                <CardContent
                  class="flex items-center justify-center p-0 w-full overflow-hidden bg-black/5 dark:bg-white/5"
                  :class="heightClass">
                  <img :src="item.url" :alt="`image-${index}`" class="w-full h-full" :class="`object-${objectFit}`" />
                </CardContent>
              </Card>

              <!-- NEXT & PREVIOUS OVERLAY BUTTONS -->
              <div v-if="imageFiles.length > 1">

                <!-- Previous -->
                <CarouselPrevious class="
              absolute left-4 top-1/2 -translate-y-1/2
              h-10 w-10
              flex items-center justify-center
              dark:text-white
              text-black shadow-lg bg-white/80
            " />

                <!-- Next -->
                <CarouselNext class="
              absolute right-4 top-1/2 -translate-y-1/2
              h-10 w-10
              flex items-center justify-center
              text-black shadow-lg bg-white/80
              dark:text-white 
              hover:bg-white/10 transition-all duration-300
            " />

              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

    </div>

    <!-- OTHER FILES -->
    <div v-if="otherFiles.length" class="mt-3 space-y-2">
      <File v-for="(file, idx) in otherFiles" :key="file?.fileId ?? idx" v-bind="file" />
    </div>

  </div>
</template>
