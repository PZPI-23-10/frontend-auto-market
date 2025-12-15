<template>
  <div class="chat-room">
    
    <div v-if="listingContext" class="car-context">
      <div class="car-details">
        <div class="car-title">{{ listingContext.title || 'Товар' }}</div>
        <div class="car-price" v-if="listingContext.price">{{ listingContext.price }}</div>
      </div>
    </div>

    <div class="messages-area" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state">Напишите сообщение...</div>
      
      <div 
        v-for="msg in messages" 
        :key="msg.id || Math.random()" 
        class="msg-row" 
        :class="{ 'mine': msg.senderId === currentUserId }"
      >
        <div class="bubble">
          {{ msg.text }}
          <span class="time">{{ formatTime(msg.sentAt) }}</span>
        </div>
      </div>
    </div>

    <div class="input-area">
      <input 
        v-model="newMessage" 
        @keyup.enter="send" 
        placeholder="Написати..." 
        :disabled="!isConnected"
      />
      <button @click="send" :disabled="!newMessage.trim() || !isConnected">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#2196f3"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useChat } from '@/composables/useChat'; 
import { useAuth } from '@/store/auth';

const props = defineProps({
  chatId: { type: [Number, String], required: true },
  listingContext: { type: Object, default: null } 
});

// --- ИСПРАВЛЕНИЕ: Безопасное получение ID и приведение к числу ---
const auth = useAuth();
// Получаем userId из store. Если он существует, преобразуем его в число (Number), иначе используем 0.
const currentUserId = ref(auth.userId?.value ? Number(auth.userId.value) : 0);

// Используем функцию для проверки, чтобы избежать ошибок
const isMyMessage = (senderId) => {
    // Сравниваем ID отправителя с ID текущего пользователя
    return Number(senderId) === currentUserId.value;
}
// --------------------------------------------

const newMessage = ref('');
const messagesContainer = ref(null);

const { messages, isConnected, startSignalR, stopSignalR, fetchHistory, sendMessage } = useChat();

const send = async () => {
  if (!newMessage.value.trim()) return;
  
  const text = newMessage.value;
  newMessage.value = ''; 
  
  try {
    await sendMessage(props.chatId, text);
    scrollToBottom();
  } catch (e) {
    console.error(e);
    newMessage.value = text; 
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

watch(messages, () => {
    scrollToBottom();
}, { deep: true });

onMounted(async () => {
  await fetchHistory(props.chatId);
  await startSignalR(props.chatId);
  scrollToBottom();
});

onUnmounted(async () => {
  await stopSignalR();
});

const formatTime = (t) => {
    if(!t) return '';
    return new Date(t).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
</script>

<style scoped>
.chat-room { display: flex; flex-direction: column; height: 100%; background: #fff; }
.car-context { padding: 10px; background: #fff; border-bottom: 1px solid #eee; display: flex; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); z-index: 1; }
.car-title { font-size: 14px; font-weight: bold; color: #2196f3; }
.car-price { font-size: 13px; color: #4caf50; font-weight: 600; margin-left: 10px;}
.messages-area { flex: 1; overflow-y: auto; padding: 15px; background: #f0f2f5; display: flex; flex-direction: column; gap: 8px; }
.empty-state { text-align: center; color: #999; margin-top: 20px; }
.msg-row { display: flex; }
.msg-row.mine { justify-content: flex-end; }
.bubble { max-width: 80%; padding: 8px 12px; border-radius: 12px; background: #fff; box-shadow: 0 1px 1px rgba(0,0,0,0.1); font-size: 14px; position: relative; word-wrap: break-word;}
.mine .bubble { background: #dbf1ff; color: #000; } 
.time { font-size: 10px; color: #999; float: right; margin-left: 8px; margin-top: 4px; }
.input-area { padding: 10px; background: #fff; border-top: 1px solid #eee; display: flex; align-items: center; }
.input-area input { flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 20px; outline: none; }
.input-area button { margin-left: 10px; cursor: pointer; padding: 5px; border: none; background: transparent; }
</style>