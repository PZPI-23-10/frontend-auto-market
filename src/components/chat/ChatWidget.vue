<template>
  <div class="chat-widget-container">
    
    <div v-if="!chatStore.isOpen" class="chat-launcher" @click="chatStore.openInbox()">
       <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path>
       </svg>
       </div>

    <Transition name="slide-up">
      <div v-if="chatStore.isOpen" class="chat-window">
        
        <div class="chat-header">
          <div class="header-left">
            <button v-if="chatStore.activeChatId" @click="chatStore.backToInbox()" class="back-btn">
               <svg viewBox="0 0 24 24" width="24" height="24" fill="#2980b9"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            
            <div v-if="chatStore.activeChatId && chatStore.activeChatHeader" class="header-user-info">
               <img 
                 v-if="chatStore.activeChatHeader.photo" 
                 :src="chatStore.activeChatHeader.photo" 
                 class="header-avatar-img" 
               />
               <div v-else class="header-avatar-placeholder">
                 {{ chatStore.activeChatHeader.name.charAt(0).toUpperCase() }}
               </div>
               <span class="header-title header-user-name">
                   {{ chatStore.activeChatHeader.name }}
               </span>
            </div>

            <span v-else class="header-title">
               {{ chatStore.activeChatId ? 'Діалог' : 'Мої повідомлення' }}
            </span>
          </div>
          <button class="close-btn" @click="chatStore.close()">✕</button>
        </div>

        <div class="chat-body">
          <ChatList 
             v-if="!chatStore.activeChatId" 
             @select-chat="handleSelectChat"
          />
          <ChatRoom 
             v-else 
             :chatId="chatStore.activeChatId"
             :listingContext="chatStore.activeListingContext"
          />
        </div>

      </div>
    </Transition>
  </div>
</template>

<script setup>
import { chatStore } from '@/store/chatStore';
import ChatList from './ChatList.vue';
import ChatRoom from './ChatRoom.vue';

// ИЗМЕНЕНО: Обработка выбора чата из списка
function handleSelectChat(chat) {
  // chat - это объект из processedChats в ChatList.vue.
  // Он уже содержит otherUserName и otherUserPhoto.
  
  // Формируем данные для шапки
  const headerInfo = {
      name: chat.otherUserName,
      photo: chat.otherUserPhoto
  };
  
  // Передаем их в стор при открытии
  chatStore.openChat(chat.id, headerInfo);
}
</script>

<style scoped>
.chat-launcher {
  position: fixed; bottom: 25px; right: 25px;
  width: 60px; height: 60px;
  background: #2980b9; 
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  z-index: 9999;
  transition: transform 0.2s, background 0.2s;
}
.chat-launcher:hover { transform: scale(1.05); background: #3498db; }

.chat-window {
  position: fixed; bottom: 90px; right: 25px;
  width: 380px; height: 550px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 5px 25px rgba(0,0,0,0.2);
  z-index: 10000;
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: 'Segoe UI', sans-serif;
  border: 1px solid #eee;
}

.chat-header {
  height: 60px; /* Чуть увеличили высоту для аватара */
  background: #fff; border-bottom: 1px solid #eee;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 15px;
}
.header-left { display: flex; align-items: center; gap: 5px; flex: 1; min-width: 0; }

/* Стили для инфо о юзере в шапке */
.header-user-info { display: flex; align-items: center; flex: 1; min-width: 0; }

.header-avatar-img, .header-avatar-placeholder {
    width: 36px; height: 36px; border-radius: 50%; margin-right: 10px; flex-shrink: 0;
}
.header-avatar-img { object-fit: cover; }
.header-avatar-placeholder {
    background: #e0e0e0; color: #555; display: flex; 
    align-items: center; justify-content: center; font-weight: 600; font-size: 16px;
}

.header-title { font-weight: bold; font-size: 17px; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.header-user-name { font-size: 16px; }

.back-btn { 
    background: none; border: none; 
    padding: 5px; display: flex; align-items: center;
    cursor: pointer; margin-right: 5px;
}
.close-btn { 
    background: none; border: none; color: #999; 
    font-size: 24px; cursor: pointer; padding: 5px;
}
.close-btn:hover { color: #333; }

.chat-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(20px); opacity: 0; }
</style>