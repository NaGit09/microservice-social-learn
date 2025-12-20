<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import type { TabsListProps } from 'radix-vue'
import { TabsList, useForwardProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsListProps & { class?: HTMLAttributes['class'] }>()

const forwarded = useForwardProps(props)
</script>

<template>
    <TabsList v-bind="forwarded" :class="cn(
        'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
        props.class,
    )">
        <slot />
    </TabsList>
</template>
