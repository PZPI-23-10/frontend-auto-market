import { ref, onUnmounted } from 'vue';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';
import { useAuth } from '@/store/auth'; 

export function useChat() {
    // 1. ИЗМЕНЕНИЕ: Достаем userId, чтобы знать свой ID
    const { token, userId } = useAuth(); 
    
    const connection = ref(null);
    const messages = ref([]);
    const isConnected = ref(false);
    const error = ref(null);

    const BASE_URL = 'https://backend-auto-market-wih5h.ondigitalocean.app'; 
    const API_URL = `${BASE_URL}/api`;
    const HUB_URL = `${BASE_URL}/hubs/chat`;

    const startSignalR = async (chatId) => {
        if (connection.value && isConnected.value) return;

        try {
            connection.value = new HubConnectionBuilder()
                .withUrl(HUB_URL, {
                    accessTokenFactory: () => token.value 
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Error)
                .build();

            connection.value.on('ReceiveMessage', (messageDto) => {
                messages.value.push(messageDto);
            });

            // 2. ИЗМЕНЕНИЕ: Принимаем readerId и проверяем, кто прочитал
            connection.value.on('MessagesRead', (readChatId, readerId) => {
                const myId = Number(userId.value);
                const rId = Number(readerId);
                const cId = Number(readChatId);

                // Если это событие этого чата И читал НЕ Я
                if(cId === Number(chatId) && rId !== myId) {
                    messages.value.forEach(m => {
                        // Ставим галочки только на МОИХ сообщениях
                        if (m.senderId === myId) {
                            m.isRead = true;
                        }
                    });
                }
            });

            await connection.value.start();
            await connection.value.invoke('JoinChat', Number(chatId));
            
            isConnected.value = true;
        } catch (err) {
            console.error('SignalR Error:', err);
            error.value = 'Ошибка подключения к чату';
        }
    };

    const stopSignalR = async () => {
        if (connection.value) {
            try {
                await connection.value.stop();
            } catch (e) { console.error(e); }
            finally {
                isConnected.value = false;
                connection.value = null;
                messages.value = [];
            }
        }
    };

    const fetchHistory = async (chatId) => {
        try {
            const res = await axios.get(`${API_URL}/Chat/${chatId}/history`, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            messages.value = res.data || [];
        } catch (err) {
            console.error('Fetch history error:', err);
        }
    };

    const sendMessage = async (chatId, text) => {
        if (!connection.value || !isConnected.value) throw new Error("No connection");
        await connection.value.invoke('SendMessage', Number(chatId), text);
    };

    const markAsRead = async (chatId) => {
        if (!connection.value || !isConnected.value) return;
        try {
            await connection.value.invoke('MarkAsRead', Number(chatId));
        } catch (err) {
            console.error('MarkAsRead error:', err);
        }
    };

    onUnmounted(() => {
        stopSignalR();
    });

    return { 
        messages, 
        isConnected, 
        error, 
        startSignalR, 
        stopSignalR, 
        fetchHistory, 
        sendMessage,
        markAsRead
    };
}