<template>
  <div class="chat-room">
    
    <div v-if="listingContext" class="listing-header">
      <div class="listing-info">
        <span class="listing-title">{{ listingContext.title }}</span>
        <span class="listing-price">{{ listingContext.price }}</span>
      </div>
    </div>

    <div class="messages-area" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-chat-state">
        Напишіть перше повідомлення...
      </div>
      
      <div 
        v-for="msg in messages" 
        :key="msg.id || Math.random()" 
        class="msg-row" 
        :class="{ 'mine': isMyMessage(msg.senderId) }"
      >
        <div class="bubble">
          {{ msg.text }}
          <div class="meta">
             <span class="time">{{ formatTime(msg.sentAt) }}</span>
             <span v-if="isMyMessage(msg.senderId)" class="checks">
                {{ msg.isRead ? '✓✓' : '✓' }}
             </span>
          </div>
        </div>
      </div>
    </div>

    <div class="input-area">
      <input 
        v-model="newMessage" 
        @keyup.enter="handleSend" 
        placeholder="Ваше повідомлення..." 
        :disabled="!isConnected"
      />
      <button class="send-btn" @click="handleSend" :disabled="!newMessage.trim() || !isConnected">
        ➤
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

const { userId } = useAuth();
// Преобразуем ID текущего юзера в число
const currentUserId = Number(userId.value);

const isMyMessage = (senderId) => Number(senderId) === currentUserId;

const newMessage = ref('');
const messagesContainer = ref(null);

const { 
    messages, isConnected, startSignalR, stopSignalR, 
    fetchHistory, sendMessage, markAsRead 
} = useChat();

// Функция отправки
const handleSend = async () => {
  if (!newMessage.value.trim()) return;
  const text = newMessage.value;
  newMessage.value = ''; 
  
  try {
    await sendMessage(props.chatId, text);
    scrollToBottom();
  } catch (e) {
    console.error(e);
    newMessage.value = text; // Вернуть текст при ошибке
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Следим за сообщениями: скроллим и помечаем как прочитанные
watch(messages, async (newVal, oldVal) => {
    scrollToBottom();
    
    // Если пришли новые сообщения и последнее НЕ от меня
    if (newVal.length > 0) {
        const lastMsg = newVal[newVal.length - 1];
        if (!isMyMessage(lastMsg.senderId) && isConnected.value) {
            await markAsRead(props.chatId);
        }
    }
}, { deep: true });

onMounted(async () => {
  await fetchHistory(props.chatId);
  await startSignalR(props.chatId);
  
  // При открытии сразу помечаем прочитанным
  if(isConnected.value) {
      await markAsRead(props.chatId);
  }

  // Если это новый чат по конкретной машине — предзаполняем текст
  if (props.listingContext && messages.value.length === 0) {
      newMessage.value = `Доброго дня! Мене цікавить ${props.listingContext.title}. Чи актуально?`;
  }

  scrollToBottom();
});

onUnmounted(() => {
  stopSignalR();
});

const formatTime = (t) => {
    if(!t) return '';
    return new Date(t).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
}
</script>

<style scoped>
.chat-room { display: flex; flex-direction: column; height: 100%; background: #f0f2f5; }

.listing-header {
    padding: 10px 15px; background: #fff; border-bottom: 1px solid #ddd;
    font-size: 14px; color: #444; box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.listing-title { font-weight: bold; color: #2980b9; margin-right: 10px;}
.listing-price { color: #27ae60; font-weight: bold; }

.messages-area { 
    flex: 1; overflow-y: auto; padding: 15px; 
    display: flex; flex-direction: column; gap: 6px; 
}
.empty-chat-state { text-align: center; color: #aaa; margin-top: 40px; }

.msg-row { display: flex; width: 100%; }
.msg-row.mine { justify-content: flex-end; }

.bubble { 
    max-width: 75%; padding: 8px 12px; border-radius: 14px; 
    background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.1); 
    font-size: 14px; line-height: 1.4; position: relative;
    border-bottom-left-radius: 2px;
}
.mine .bubble { 
    background: #dcf8c6; /* Цвет как в WhatsApp/Telegram */
    border-bottom-left-radius: 14px; border-bottom-right-radius: 2px;
}

.meta { 
    display: flex; justify-content: flex-end; align-items: center; 
    font-size: 10px; color: #999; margin-top: 2px; gap: 4px;
}
.checks { letter-spacing: -2px; font-weight: bold; color: #3498db; }

.input-area { 
    padding: 10px; background: #fff; border-top: 1px solid #ddd; display: flex; gap: 10px; 
}
.input-area input { 
    flex: 1; padding: 10px 15px; border: 1px solid #ddd; border-radius: 20px; outline: none; transition: border 0.2s;
}
.input-area input:focus { border-color: #3498db; }

.send-btn {
    background: #3498db; color: white; border: none; width: 40px; height: 40px;
    border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 16px;
}
.send-btn:disabled { background: #ccc; cursor: default; }
</style>