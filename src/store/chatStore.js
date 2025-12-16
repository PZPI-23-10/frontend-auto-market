import { reactive } from 'vue';

export const chatStore = reactive({
  isOpen: false,           
  activeChatId: null,       
  activeListingContext: null,
  // НОВОЕ ПОЛЕ: Хранит { name: 'Иван', photo: 'url' } для шапки
  activeChatHeader: null, 

  openInbox() {
    this.isOpen = true;
    this.resetActiveChat();
  },

  // Обновляем функцию открытия чата, теперь она принимает headerInfo
  openChat(chatId, headerInfo = null, listingContext = null) {
    this.isOpen = true;
    this.activeChatId = chatId;
    // Сохраняем информацию для шапки
    this.activeChatHeader = headerInfo; 

    if (listingContext) {
      this.activeListingContext = listingContext;
    }
  },

  close() {
    this.isOpen = false;
  },

  backToInbox() {
    this.resetActiveChat();
  },

  // Вспомогательная функция для сброса состояния
  resetActiveChat() {
    this.activeChatId = null;
    this.activeListingContext = null;
    this.activeChatHeader = null; // Сбрасываем заголовок
  }
});