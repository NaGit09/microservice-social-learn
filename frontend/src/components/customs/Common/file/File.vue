<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { File } from '@/types/common/file';
import { ArrowDownToLine } from 'lucide-vue-next';
import { push } from 'notivue';
import { ref, computed } from 'vue'

const props = defineProps<File>()

const isLoading = ref(false)
const fileTypeClass = computed(() => {
    const type = props.type?.toLowerCase() || 'default';

    if (type.includes('pdf')) return 'type-pdf';
    if (type.includes('doc') || type.includes('word')) return 'type-word';
    if (type.includes('xls') || type.includes('excel')) return 'type-excel';
    if (type.includes('ppt') || type.includes('powerpoint')) return 'type-ppt';
    if (type.includes('zip') || type.includes('rar')) return 'type-zip';
    if (type.includes('jpg') || type.includes('jpeg') || type.includes('png')) return 'type-image';

    return 'type-default';
});

async function downloadFile() {
    if (isLoading.value || !props.url) return;
    isLoading.value = true;

    try {
        const response = await fetch(props.url as string);
        if (!response.ok) throw new Error('Network response was not ok');

        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.style.display = 'none';
        link.href = blobUrl;
        link.download = props.fileName as string || 'download';

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);

    } catch (error) {
        push.error('Lỗi khi tải file:');
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="file-item rounded-full">

        <div class="file-info">
            <h6>{{ fileName }}</h6>

            <span v_if="type" class="file-type-badge" :class="fileTypeClass">
                {{ type?.split('/')[0] }}
            </span>
        </div>

        <Button variant="outline" href="#" @click.prevent="downloadFile" class="download-link rounded-full">
            <ArrowDownToLine />
        </Button>
    </div>
</template>

<style scoped>
.file-item {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 4px 8px;
    border: 1px solid #e2e8f0;
    margin-bottom: 8px;
    background-color: #fdfdfd;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.file-info h6 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
}

.download-link {
    font-size: 0.9rem;
    color: #3182ce;
    text-decoration: none;
    font-weight: 500;
}

.download-link:hover {
    text-decoration: underline;
}

.file-type-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: bold;
    color: white;
    text-transform: uppercase;
}


.type-pdf {
    background-color: #E53E3E;
}

.type-word {
    background-color: #3182CE;
}

.type-excel {
    background-color: #38A169;
}

.type-ppt {
    background-color: #D69E2E;
}

.type-image {
    background-color: #805AD5;
}

.type-zip {
    background-color: #718096;
}

.type-default {
    background-color: #A0AEC0;
}
</style>