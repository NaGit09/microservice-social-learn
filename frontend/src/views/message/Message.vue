<script setup lang="ts">
import Sidebar from '@/components/common/sidebar/Sidebar.vue'
import ConversationPanel from '@/components/features/messages/ConversationPanel.vue';
import MessagePanel from '@/components/features/messages/MessagePanel.vue';
import { SidebarProvider } from '@/components/ui/sidebar';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user.store';
import { router } from '@/router';
import { CookieUtils } from '@/utils/cookie.util';
import { useConversationStore } from '@/stores/conversation.store';
import { storeToRefs } from 'pinia';
import { useMessageStore } from '@/stores/message.store';



const useUser = useUserStore()
const { getOwnInfo } = useUser
const { ownerInfo } = useUser

const conversationStore = useConversationStore()
const { getConversations  } = conversationStore
const { conversation } = storeToRefs(conversationStore)


const messageStore = useMessageStore()
const { createConnection } = messageStore

onMounted(async () => {

    const userId = ownerInfo
        ? ownerInfo.id
        : (CookieUtils.get('userId') as string)

    if (!userId) {
        router.push('/login')
    }
    await createConnection(userId);
    await getOwnInfo(userId);
    await getConversations(userId);

})

</script>
<template>
    <SidebarProvider class="flex" style="--sidebar-width: 15rem; --sidebar-width-mobile: 20rem">
        <Sidebar />
        <main class="flex items-center dark:text-white flex-1">
            <ConversationPanel v-if="ownerInfo" :userInfo="ownerInfo"/>
            <MessagePanel :userId="ownerInfo?.id || ''" :conversation="conversation" />
        </main>
    </SidebarProvider>
</template>
