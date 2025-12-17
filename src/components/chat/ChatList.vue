<template>
  <div class="chat-list">
    <div v-if="isLoading" class="loading-state">{{ t('chat.loading') }}</div>
    <div v-else-if="processedChats.length === 0" class="empty-state">
        <p>{{ t('chat.noMessages') }}</p>
    </div>

    <div 
      v-else 
      v-for="chat in processedChats" 
      :key="chat.id" 
      class="chat-item" 
      @click="$emit('select-chat', chat)"
    >
      <img 
        v-if="chat.otherUserPhoto" 
        :src="chat.otherUserPhoto" 
        class="avatar-img" 
      />
      <div v-else class="avatar-placeholder">
        {{ chat.otherUserName.charAt(0).toUpperCase() }}
      </div>
      
      <div class="chat-info">
        <div class="top-row">
          <span class="user-name">{{ chat.otherUserName }}</span>
          <span class="date">{{ formatDate(chat.lastMessageDate) }}</span>
        </div>
        
        <div 
            class="preview-text"
            :class="{ 'unread': chat.hasUnread }"
        >
            <span v-if="chat.isLastMessageMine" class="you-prefix">{{ t('chat.you') }}: </span>
            {{ chat.lastMessageText }}
        </div>
      </div>
      
      <div v-if="chat.hasUnread" class="unread-dot"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuth } from '@/store/auth';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emit = defineEmits(['select-chat']);
const { token, userId } = useAuth(); // userId должен быть доступен в store
const chats = ref([]);
const isLoading = ref(true);

const API_HOST = 'https://backend-auto-market-wih5h.ondigitalocean.app/api';

const processedChats = computed(() => {
    return chats.value.map(chat => {
        const myId = Number(userId.value);
        
        // Определяем, кто из двух юзеров в DTO - собеседник
        // Если FirstUser - это я, значит собеседник - SecondUser, и наоборот
        const isFirstUserMe = chat.firstUser.id === myId;
        const otherUser = isFirstUserMe ? chat.secondUser : chat.firstUser;
        
        // Последнее сообщение
        const lastMsg = chat.messages && chat.messages.length > 0 
            ? chat.messages[chat.messages.length - 1] 
            : null;

        // Является ли сообщение непрочитанным и НЕ моим?
        const hasUnread = lastMsg && !lastMsg.isRead && lastMsg.senderId !== myId;
        const isLastMessageMine = lastMsg && lastMsg.senderId === myId;

        return {
            id: chat.id,
            otherUserId: otherUser.id,
            otherUserName: `${otherUser.firstName} ${otherUser.lastName}`,
            otherUserPhoto: otherUser.photoUrl,
            lastMessageText: lastMsg ? lastMsg.text : 'Немає повідомлень',
            lastMessageDate: lastMsg ? lastMsg.sentAt : chat.createdAt,
            hasUnread,
            isLastMessageMine
        };
    })
    // Сортировка: новые сверху
    .sort((a, b) => new Date(b.lastMessageDate) - new Date(a.lastMessageDate));
});

onMounted(async () => {
  try {
    const res = await axios.get(`${API_HOST}/Chat/my`, {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    chats.value = res.data; 
  } catch (e) {
    console.error("Ошибка загрузки чатов", e);
  } finally {
    isLoading.value = false;
  }
});

function formatDate(dateString) {
  if(!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  // Если сегодня - показываем время, иначе дату
  if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  return date.toLocaleDateString();
}
</script>

<style scoped>
.chat-list { 
  flex: 1; 
  overflow-y: auto; 
  background: #fff; 
}

.loading-state, .empty-state { 
  padding: 20px; 
  text-align: center; 
  color: #999; 
  margin-top: 50px;
}

.chat-item { 
  display: flex; 
  padding: 15px; 
  border-bottom: 1px solid #f5f5f5; 
  cursor: pointer; 
  align-items: center; 
  position: relative; 
  transition: background 0.2s;
}

.chat-item:hover { 
  background: #f9f9f9; 
}

.avatar-placeholder, .avatar-img {
  width: 48px; 
  height: 48px; 
  border-radius: 50%; 
  object-fit: cover; 
  margin-right: 15px;
  flex-shrink: 0; /* Чтобы аватар не сжимался */
}

.avatar-placeholder {
  background: #e0e0e0; 
  color: #555; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-weight: bold; 
  font-size: 20px;
}

.chat-info { 
  flex: 1; 
  min-width: 0; /* Критично для работы text-overflow: ellipsis */
} 

.top-row { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 4px; 
}

.user-name { 
  font-weight: 600; 
  font-size: 15px; 
  color: #333; 
}

.date { 
  font-size: 12px; 
  color: #999; 
  white-space: nowrap;
  margin-left: 5px;
}

.preview-text { 
  font-size: 13px; 
  color: #777; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}

.preview-text.unread { 
  font-weight: 700; 
  color: #000; 
}

.you-prefix { 
  font-weight: normal; 
  color: #999; 
}

.unread-dot {
  width: 10px; 
  height: 10px; 
  background-color: #3498db; 
  border-radius: 50%; 
  margin-left: 10px;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .chat-item {
    padding: 12px; /* Чуть меньше отступы */
  }
  
  .avatar-placeholder, .avatar-img {
    width: 40px; /* Чуть меньше аватарки */
    height: 40px;
    margin-right: 10px;
    font-size: 16px;
  }
  
  .user-name {
    font-size: 14px;
  }
  
  .preview-text {
    font-size: 12px;
  }
}
</style>