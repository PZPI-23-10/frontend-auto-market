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
               ❮ Назад
            </button>
            <span class="header-title">
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

// Обработка выбора чата из списка
function handleSelectChat(chat) {
  // Мы не передаем listingContext при открытии из списка,
  // так как история уже существует и контекст не нужен.
  chatStore.openChat(chat.id);
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
  height: 55px; background: #fff; border-bottom: 1px solid #eee;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 15px;
}
.header-left { display: flex; align-items: center; gap: 10px; }
.header-title { font-weight: bold; font-size: 16px; color: #333; }
.back-btn { 
    background: none; border: none; color: #2980b9; 
    font-size: 14px; cursor: pointer; font-weight: 500;
}
.close-btn { 
    background: none; border: none; color: #999; 
    font-size: 20px; cursor: pointer; 
}
.close-btn:hover { color: #333; }

.chat-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

/* Анимация появления */
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(20px); opacity: 0; }
</style>