import { reactive } from 'vue';

export const chatStore = reactive({
  isOpen: false,           
  activeChatId: null,       
  activeListingContext: null, // { id, title, price, image }

  openInbox() {
    this.isOpen = true;
    this.activeChatId = null;
    this.activeListingContext = null;
  },

  // Открыть конкретный чат (например, нажали кнопку "Написать" на странице товара)
  openChat(chatId, listingContext = null) {
    this.isOpen = true;
    this.activeChatId = chatId;
    if (listingContext) {
      this.activeListingContext = listingContext;
    }
  },

  close() {
    this.isOpen = false;
  },

  backToInbox() {
    this.activeChatId = null;
    this.activeListingContext = null;
  }
});