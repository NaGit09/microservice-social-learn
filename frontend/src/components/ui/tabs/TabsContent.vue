<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { TabsContentProps } from 'radix-vue'
import { TabsContent, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsContentProps & { class?: HTMLAttributes['class'] }>()

const forwarded = useForwardProps(props)
</script>

<template>
    <TabsContent v-bind="forwarded" :class="cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        props.class,
    )">
        <slot />
    </TabsContent>
</template>
