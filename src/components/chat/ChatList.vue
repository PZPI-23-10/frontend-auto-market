<template>
  <div class="chat-list">
    <div v-if="isLoading" class="state-msg">Загрузка...</div>
    <div v-else-if="chats.length === 0" class="state-msg">У вас пока нет чатов</div>

    <div 
      v-else 
      v-for="chat in processedChats" 
      :key="chat.id" 
      class="chat-item" 
      @click="$emit('select-chat', chat)"
    >
      <div class="avatar-placeholder">
        U
      </div>
      
      <div class="chat-info">
        <div class="top">
          <span class="name">User #{{ chat.otherUserId }}</span>
          <span class="date">{{ formatDate(chat.lastMessageDate) }}</span>
        </div>
        <div class="car-title">Чат #{{ chat.id }}</div>
        <div class="preview">{{ chat.lastMessageText }}</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuth } from '@/store/auth';

const emit = defineEmits(['select-chat']);

// --- ИСПРАВЛЕНИЕ: Безопасное получение ID ---
const { token, userId } = useAuth(); 
const API_HOST = 'https://backend-auto-market-wih5h.ondigitalocean.app/api';
// -------------------------

const chats = ref([]);
const isLoading = ref(true);


const processedChats = computed(() => {
    return chats.value.map(chat => {
        // --- Получаем ID текущего пользователя как число ---
        const myId = Number(userId.value); 
        // -------------------------
        
        // Определяем ID собеседника
        const otherId = chat.firstUserId === myId ? chat.secondUserId : chat.firstUserId;
        
        // Находим последнее сообщение (сообщения теперь загружаются благодаря вашему исправлению на бэкенде)
        const lastMsg = chat.messages && chat.messages.length > 0 
            ? chat.messages[chat.messages.length - 1] 
            : null;

        return {
            ...chat,
            otherUserId: otherId,
            lastMessageText: lastMsg ? lastMsg.text : 'Немає повідомлень',
            lastMessageDate: lastMsg ? lastMsg.sentAt : chat.createdAt
        };
    });
});

onMounted(async () => {
  try {
    const res = await axios.get(`${API_HOST}/Chat/my`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    chats.value = res.data; 
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});

function formatDate(dateString) {
  if(!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
</script>

<style scoped>
.chat-list { flex: 1; overflow-y: auto; background: #fff; }
.state-msg { padding: 20px; text-align: center; color: #888; }
.chat-item { display: flex; padding: 12px 15px; border-bottom: 1px solid #f0f0f0; cursor: pointer; align-items: center; }
.chat-item:hover { background: #f9f9f9; }
.avatar-placeholder { width: 40px; height: 40px; background: #eee; color: #555; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; }
.chat-info { flex: 1; }
.top { display: flex; justify-content: space-between; font-size: 14px; }
.name { font-weight: 600; color: #333; }
.date { color: #999; font-size: 12px; }
.car-title { font-size: 12px; color: #2196f3; margin-top: 2px; }
.preview { font-size: 13px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; }
</style>