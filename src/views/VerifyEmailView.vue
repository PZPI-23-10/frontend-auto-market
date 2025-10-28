<template>
  <div class="verify-container">
    <form @submit.prevent="verifyEmail">
      <h3>Підтвердження Email</h3>

      <p class="info-text">
        Будь ласка, введіть 6-значний код, який було надіслано на вашу електронну адресу.
      </p>

      <label for="verificationCode">Код підтвердження</label>
      <input 
        id="verificationCode" 
        type="text" 
        placeholder="Введіть код" 
        v-model="verificationCode" 
        maxlength="6" 
      />

      <button type="submit" class="verify-btn" :disabled="isLoading">
        {{ isLoading ? 'Перевірка...' : 'Підтвердити' }}
      </button>

      <button type="button" class="resend-btn" @click="resendCode" :disabled="isLoading">
        Надіслати код повторно
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/store/auth'; // Для отримання токена
import { useToast } from 'vue-toastification';
import axios from 'axios';

const API_BASE_URL = 'https://backend-auto-market.onrender.com/api/Account'; 
const VERIFY_EMAIL_URL = `${API_BASE_URL}/verify-email`;
const { token } = useAuth(); // Отримуємо токен
const toast = useToast();
const router = useRouter();

const verificationCode = ref('');
const isLoading = ref(false);

async function verifyEmail() {
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    toast.warning('Будь ласка, введіть 6-значний код.');
    return;
  }
  if (!token.value) {
      toast.error('Помилка: Токен авторизації не знайдено. Увійдіть знову.');
      router.push('/login'); 
      return;
  }

  isLoading.value = true;

  try {
    const response = await axios.post(VERIFY_EMAIL_URL, 
      { code: verificationCode.value }, // Тіло запиту
      { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}` // Додаємо токен
        }
      }
    );

    toast.success('Email успішно підтверджено!');
    // Тут можна перенаправити користувача, наприклад, на сторінку профілю
    router.push('/profile'); 

  } catch (error) {
    console.error('Помилка підтвердження email:', error);
    let errorMessage = 'Не вдалося підтвердити email.';
    if (error.response) {
      // Обробляємо конкретні помилки від бекенду
      if (error.response.status === 400) {
        if (typeof error.response.data === 'string') {
           errorMessage = error.response.data; // Наприклад, "Invalid verification code."
        } else {
           errorMessage = 'Невірний запит.';
        }
      } else if (error.response.status === 401) { // Unauthorized
          errorMessage = 'Помилка авторизації. Спробуйте увійти знову.';
          clearAuthData(); // Можливо, потрібно очистити дані аутентифікації
          router.push('/login');
      } else if (error.response.status === 404) { // Not Found
          errorMessage = 'Користувача не знайдено.';
      } else {
          errorMessage = error.response.data?.message || 'Помилка сервера.';
      }
    } else if (error.request) {
      errorMessage = 'Немає відповіді від сервера.';
    } else {
      errorMessage = error.message;
    }
    toast.error(`Помилка: ${errorMessage}`);
  } finally {
    isLoading.value = false;
  }
}

async function resendCode() {
  // ‼️ ЦЯ ФУНКЦІЯ ПОТРЕБУЄ РЕАЛІЗАЦІЇ ЕНДПОІНТУ НА БЕКЕНДІ ‼️
  toast.info('Функція повторної відправки коду ще не реалізована.');
  
  
}
</script>

<style scoped>
/* === Використовуємо стилі, схожі на Login/Register === */
.verify-container {
  background-image: url('@/assets/car-header1.jpg'); /* Або інший фон */
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 40px 20px; /* Додаємо відступи */
}

.verify-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); 
}

form {
  width: 100%; /* Адаптивна ширина */
  max-width: 400px; /* Обмеження максимальної ширини */
  background-color: rgba(30, 30, 30, 0.7);
  position: relative;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 40px 30px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  color: #fff;
}

form h3 {
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 20px;
}

.info-text {
    font-size: 14px;
    color: #ccc;
    text-align: center;
    margin-bottom: 25px;
    line-height: 1.5;
}

label {
  width: 100%;
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-top: 15px;
  margin-bottom: 5px; /* Додав відступ */
}

input {
  display: block;
  width: 100%;
  height: 45px;
  padding: 0 10px;
  border-radius: 3px;
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555;
  box-shadow: none;
  font-size: 16px; /* Трохи більший шрифт для коду */
  font-weight: 500;
  margin-top: 8px;
  color: #fff;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  text-align: center; /* Центруємо введення коду */
  letter-spacing: 0.2em; /* Розріджуємо символи */
}
input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  outline: none;
}

::placeholder {
  color: #e5e5e5;
  letter-spacing: normal; /* Звичайний інтервал для плейсхолдера */
}

.verify-btn, .resend-btn {
  width: 100%;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: 25px; 
  transition: 0.3s;
  font-family: 'Open Sans', sans-serif;
}

.verify-btn {
  background-color: #cc0000;
  color: #fff;
}
.verify-btn:hover:not(:disabled) {
  background-color: #aa0000;
}
.verify-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
}
.resend-btn {
  background-color: rgba(255,255,255,0.27);
  color: #fff;
  margin-top: 15px;
}
.resend-btn:hover:not(:disabled) {
  background-color: rgba(255,255,255,0.4);
}
.resend-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>