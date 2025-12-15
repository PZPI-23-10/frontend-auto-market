<template>
  <div class="chat-container">
    
    <div class="chat-header">
      <div class="header-info">
        <h3>Чат</h3>
        <span class="status-badge" :class="{ 'online': isConnected, 'offline': !isConnected }">
          {{ isConnected ? '● Online' : '○ Підключення...' }}
        </span>
      </div>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <div class="messages-area" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-state">
        <p>Історія повідомлень порожня.</p>
        <small>Напишіть перше повідомлення!</small>
      </div>

      <div 
        v-for="msg in messages" 
        :key="msg.id || Math.random()" 
        class="message-wrapper"
        :class="{ 'my-message': msg.senderId === currentUserId }"
      >
        <div class="message-bubble">
          <div class="message-text">{{ msg.text }}</div>
          <div class="message-meta">
            <span class="time">{{ formatTime(msg.sentAt) }}</span>
            <span v-if="msg.senderId === currentUserId" class="checks">
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
        type="text" 
        placeholder="Напишіть повідомлення..." 
        :disabled="!isConnected"
      />
      <button 
        class="send-btn" 
        @click="handleSend" 
        :disabled="!isConnected || !newMessage.trim()"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
      </button>
    </div>

    <div v-if="error" class="error-banner">{{ error }}</div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useChat } from '@/composables/useChat';
import { useAuth } from '@/store/auth';

// Приймаємо ID чату як параметр
const props = defineProps({
  chatId: {
    type: [Number, String],
    required: true
  }
});

const emit = defineEmits(['close']);

const { user } = useAuth();
const currentUserId = user.value?.id; // ID поточного користувача для стилізації

const { 
  messages, 
  isConnected, 
  error, 
  startSignalR, 
  stopSignalR,
  fetchHistory, 
  sendMessage 
} = useChat();

const newMessage = ref('');
const messagesContainer = ref(null);

// Функція форматування часу
const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Відправка повідомлення
const handleSend = async () => {
  if (!newMessage.value.trim()) return;
  
  const textToSend = newMessage.value;
  newMessage.value = ''; // Очищаємо поле одразу для кращого UX
  
  try {
    await sendMessage(props.chatId, textToSend);
    scrollToBottom();
  } catch (e) {
    newMessage.value = textToSend; // Повертаємо текст, якщо помилка
  }
};

// Прокрутка вниз
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Слідкуємо за новими повідомленнями, щоб прокручувати вниз
watch(messages, () => {
  scrollToBottom();
}, { deep: true });

// Життєвий цикл компонента
onMounted(async () => {
  await fetchHistory(props.chatId); // 1. Завантажити старі
  await startSignalR(props.chatId); // 2. Підключитися до нових
  scrollToBottom();
});

onUnmounted(async () => {
  await stopSignalR(props.chatId);
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px;
  max-width: 100%;
  background: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  border: 1px solid #333;
  color: #fff;
  font-family: sans-serif;
  position: relative;
}

/* Header */
.chat-header {
  padding: 15px 20px;
  background: #252525;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 12px 12px 0 0;
}
.chat-header h3 { margin: 0; font-size: 18px; color: #fff; }
.status-badge { font-size: 12px; margin-left: 10px; transition: color 0.3s; }
.status-badge.online { color: #2ecc71; }
.status-badge.offline { color: #7f8c8d; }
.close-btn { background: none; border: none; color: #aaa; font-size: 20px; cursor: pointer; }
.close-btn:hover { color: #fff; }

/* Messages Area */
.messages-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #1a1a1a;
}

/* Scrollbar styling */
.messages-area::-webkit-scrollbar { width: 6px; }
.messages-area::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }

.empty-state { text-align: center; color: #666; margin-top: 50px; }

/* Message Bubble */
.message-wrapper {
  display: flex;
  width: 100%;
}
.my-message { justify-content: flex-end; }

.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 16px;
  background: #2c3e50; /* Колір для співрозмовника */
  color: #ecf0f1;
  position: relative;
  word-wrap: break-word;
}

.my-message .message-bubble {
  background: #d4ac0d; /* Жовтий акцент для своїх */
  color: #000;
  border-bottom-right-radius: 4px;
}
.message-wrapper:not(.my-message) .message-bubble {
  border-bottom-left-radius: 4px;
}

.message-text { font-size: 14px; line-height: 1.4; }

.message-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  margin-top: 4px;
  font-size: 10px;
  opacity: 0.7;
}

/* Input Area */
.input-area {
  padding: 15px;
  background: #252525;
  border-top: 1px solid #333;
  display: flex;
  gap: 10px;
  border-radius: 0 0 12px 12px;
}

.input-area input {
  flex: 1;
  padding: 12px 15px;
  border-radius: 25px;
  border: 1px solid #444;
  background: #1a1a1a;
  color: white;
  outline: none;
  transition: border-color 0.2s;
}
.input-area input:focus { border-color: #d4ac0d; }
.input-area input:disabled { opacity: 0.5; cursor: not-allowed; }

.send-btn {
  background: #d4ac0d;
  color: #000;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s, background 0.2s;
}
.send-btn:hover:not(:disabled) { background: #f1c40f; transform: scale(1.05); }
.send-btn:active:not(:disabled) { transform: scale(0.95); }
.send-btn:disabled { background: #555; cursor: not-allowed; }

.error-banner {
  background: #e74c3c;
  color: white;
  text-align: center;
  font-size: 12px;
  padding: 5px;
}
</style>