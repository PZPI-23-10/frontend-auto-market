<template>
  <div class="chat-widget">
    <div v-if="!chatStore.isOpen" class="launcher" @click="chatStore.openInbox()">
      <svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"></path></svg>
    </div>

    <Transition name="slide">
      <div v-if="chatStore.isOpen" class="window">
        
        <div class="header">
          <div class="left-controls">
            <button v-if="chatStore.activeChatId" @click="chatStore.backToInbox()" class="back-btn">
              ❮
            </button>
            <span class="title">{{ chatStore.activeChatId ? 'Чат' : 'Повідомлення' }}</span>
          </div>
          <button class="close-btn" @click="chatStore.close()">✕</button>
        </div>

        <div class="body">
          <ChatList 
            v-if="!chatStore.activeChatId" 
            @select-chat="selectChat"
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

function selectChat(chat) {
  chatStore.openChat(chat.id, {
    id: chat.listingId,
    title: chat.listingTitle,
    price: chat.listingPrice,
    image: chat.listingImage
  });
}
</script>

<style scoped>
.launcher {
  position: fixed; bottom: 20px; right: 20px;
  width: 60px; height: 60px;
  background: #db5c4c; 
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  z-index: 9999;
  transition: transform 0.2s;
}
.launcher:hover { transform: scale(1.1); }

.window {
  position: fixed; bottom: 20px; right: 20px;
  width: 360px; height: 550px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.2);
  z-index: 10000;
  display: flex; flex-direction: column;
  overflow: hidden;
  font-family: Arial, sans-serif;
}

.header {
  height: 50px; background: #fff; border-bottom: 1px solid #eee;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 15px;
}
.left-controls { display: flex; align-items: center; gap: 10px; }
.back-btn, .close-btn { background: none; border: none; font-size: 18px; cursor: pointer; color: #555; }
.title { font-weight: bold; font-size: 16px; color: #333; }

.body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateY(20px); opacity: 0; }
</style>