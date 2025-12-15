import { reactive } from 'vue';

export const chatStore = reactive({
    isOpen: false,          
    activeChatId: null,      
    activeListingContext: null, 
    openInbox() {
        this.isOpen = true;
        this.activeChatId = null;
        this.activeListingContext = null;
    },

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