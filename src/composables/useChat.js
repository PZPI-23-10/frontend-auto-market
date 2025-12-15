import { ref, onUnmounted } from 'vue';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import axios from 'axios';
import { useAuth } from '@/store/auth';

export function useChat() {
    const { token } = useAuth();
    const connection = ref(null);
    const messages = ref([]);
    const isConnected = ref(false);
    const error = ref(null);

    const BASE_URL = 'https://backend-auto-market-wih5h.ondigitalocean.app';
    const API_URL = `${BASE_URL}/api`;
    const HUB_URL = `${BASE_URL}/hubs/chat`;

    // Запуск SignalR
    const startSignalR = async (chatId) => {
        if (connection.value && isConnected.value) return;

        try {
            connection.value = new HubConnectionBuilder()
                .withUrl(HUB_URL, {
                    accessTokenFactory: () => token.value
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            connection.value.on('ReceiveMessage', (messageDto) => {
                console.log('Новое сообщение:', messageDto);
                messages.value.push(messageDto);
            });

            await connection.value.start();
            isConnected.value = true;
            console.log('SignalR connected');

            await connection.value.invoke('JoinChat', Number(chatId));

        } catch (err) {
            console.error('Ошибка SignalR:', err);
            error.value = 'Ошибка подключения к чату';
        }
    };

    const fetchHistory = async (chatId) => {
        try {
            const res = await axios.get(`${API_URL}/Chat/${chatId}/history`, {
                headers: { Authorization: `Bearer ${token.value}` }
            });
            messages.value = res.data || [];
        } catch (err) {
            console.error('Ошибка загрузки истории:', err);
        }
    };

    const sendMessage = async (chatId, text) => {
        if (!connection.value || !isConnected.value) {
            console.error('Нет соединения с SignalR');
            return;
        }

        try {

            await connection.value.invoke('SendMessage', Number(chatId), text);

        } catch (err) {
            console.error('Ошибка отправки:', err);
            error.value = 'Не удалось отправить сообщение.';
            throw err;
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

    onUnmounted(() => {
        stopSignalR();
    });

    return { messages, isConnected, error, startSignalR, stopSignalR, fetchHistory, sendMessage };
}