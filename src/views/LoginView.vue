<template>
  <div class="login-container">
    <form @submit.prevent="login">
      <h3>Login Here</h3>

      <label for="username">Email</label>
      <input id="username" type="text" placeholder="Email" v-model="username" />

      <label for="password">Password</label>
      <input id="password" type="password" placeholder="Password" v-model="password" />

      <button type="submit" class="login-btn">Log In</button>

      <div class="social">
        <div class="social-btn google" @click="loginWith('Google')">
          <i class="fab fa-google"></i> Google
        </div>
        <div class="social-btn facebook" @click="loginWith('Facebook')">
          <i class="fab fa-facebook"></i> Facebook
        </div>
      </div>

      <button type="button" class="register-btn" @click="goToRegister">
        Register
      </button>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/store/auth';
import { useToast } from 'vue-toastification';
import { inject } from 'vue';
import axios from 'axios'; 

const API_URL = 'https://backend-auto-market.onrender.com/api/Account/login';
const API_URL_GOOGLE = 'https://backend-auto-market.onrender.com/api/Account/web/google';

const { setAuthData } = useAuth();
const toast = useToast();
const username = ref('');
const password = ref('');
const router = useRouter();
const $gAuth = inject('gAuth');

// === ФУНКЦІЯ ОНОВЛЕНА ДЛЯ AXIOS ===
async function login() {
  if (!username.value || !password.value) {
    toast.warning('Введіть email та пароль');
    return;
  }

  try {
    // 2. Використовуй axios.post
    const response = await axios.post(API_URL, {
      // Дані для відправки
      email: username.value,
      password: password.value,
      rememberMe: true
    }, {
      // Конфігурація запиту (заголовки)
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // 3. Дані вже в response.data
    const data = response.data;
    console.log('ВІДПОВІДЬ ВІД СЕРВЕРА (Axios):', data);

    // 4. Перевірка необхідних полів
    if (!data.accessToken || !data.userId) {
      throw new Error('Сервер не повернув "accessToken" або "userId" у відповіді.');
    }

    setAuthData(data.userId, data.accessToken);
    toast.success('Вхід виконано успішно!');
    router.push('/');

  } catch (error) {
    console.error('Помилка логіну (Axios):', error);

    // 5. Обробка помилок Axios
    let errorMessage = 'Помилка логіну';
    if (error.response) {
      // Сервер відповів помилкою (4xx, 5xx)
      errorMessage = error.response.data?.message || error.response.data || error.response.statusText || 'Невірний email або пароль';
    } else if (error.request) {
      // Немає відповіді від сервера
      errorMessage = 'Не вдалося підключитися до сервера';
    } else {
      // Помилка налаштування запиту
      errorMessage = error.message;
    }
    toast.error(`Помилка: ${errorMessage}`);
  }
}

async function loginWith(provider) {
  if (provider === 'Google') {
    // --- Починаємо логіку Google ---
    toast.info('Відкриваємо вікно Google...');
    try {
      // 4.1. Викликаємо спливаюче вікно Google
      const googleUser = await $gAuth.signIn();

      // 4.2. Отримуємо id_token (саме його очікує ваш бекенд)
      const googleToken = googleUser.getAuthResponse().id_token;

      if (!googleToken) {
        throw new Error('Не вдалося отримати токен від Google');
      }

      // 4.3. Встановлюємо "запам'ятати мене"
      const rememberMe = true;

      // 4.4. Відправляємо токен на наш бекенд
      await sendGoogleTokenToBackend(googleToken, rememberMe);

    } catch (error) {
      console.error('Помилка входу через Google:', error);
      toast.error('Вхід через Google скасовано або сталася помилка.');
    }
    // --- Кінець логіки Google ---

  } else if (provider === 'Facebook') {
    toast.info(`Вхід через ${provider} (поки не реалізовано)`);
  }
}

async function sendGoogleTokenToBackend(googleToken, rememberMe) {
  const payload = {
    googleToken: googleToken,
    rememberMe: rememberMe
  };

  toast.info('Перевіряємо ваші дані...');

  try {
    // 5.1. Робимо POST-запит з токеном
    const response = await axios.post(API_URL_GOOGLE, payload);
    const data = response.data;

    // 5.2. Успіх! Обробляємо відповідь ТАК САМО, як у звичайному логіні
    if (!data.accessToken || !data.userId) {
      throw new Error('Сервер не повернув "accessToken" або "userId".');
    }

    // Використовуємо ті ж самі функції зі store та router
    setAuthData(data.userId, data.accessToken);
    toast.success('Вхід через Google виконано успішно!');
    router.push('/');

  } catch (error) {
    // 5.3. Обробка помилок від вашого бекенду
    console.error('Помилка під час відправки Google-токена на бекенд:', error);
    if (error.response) {
      toast.error(`Помилка: ${error.response.data.message || 'Невірні дані'}`);
    } else {
      toast.error('Не вдалося з\'єднатися з сервером.');
    }
  }
}

function goToRegister() {
  router.push('/register');
}
</script>
<style scoped>
/* === 1. АДАПТАЦИЯ ФОНА === */
.login-container {
  background-image: url('@/assets/car-header1.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.login-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); 
}

/* === 2. АДАПТАЦИЯ ФОРМЫ === */
form {
  width: 360px;
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
}

form h3 {
  font-family: 'Open Sans', sans-serif;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
  color: #fff;
}
label {
  width: 100%;
  font-family: 'Open Sans', sans-serif;
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-top: 15px;
  color: #fff;
}

/* === 4. АДАПТАЦИЯ ПОЛЕЙ ВВОДА === */
input {
  font-family: 'Open Sans', sans-serif;
  display: block;
  width: 100%;
  /* ‼️ max-width: 340px; УДАЛЕН (избыточен) */
  height: 45px;
  padding: 0 10px;
  border-radius: 3px;
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555;
  box-shadow: none;
  font-size: 14px;
  font-weight: 300;
  margin-top: 8px;
  color: #fff;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  outline: none;
}

::placeholder {
  color: #e5e5e5;
}

/* === 5. АДАПТАЦИЯ КНОПОК === */
.login-btn, .register-btn {
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  /* ‼️ max-width: 360px; УДАЛЕН (избыточен) */
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: 45px;
  transition: 0.3s;
}

.login-btn {
  background-color: #cc0000;
  color: #fff;
}
.login-btn:hover {
  background-color: #aa0000;
}

.register-btn {
  background-color: rgba(255,255,255,0.27);
  color: #fff;
}
.register-btn:hover {
  background-color: rgba(255,255,255,0.4);
}

.social {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.social-btn {
  font-family: 'Open Sans', sans-serif;
  width: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  border-radius: 6px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  transition: 0.3s;
  gap: 6px;
  background-color: rgba(255,255,255,0.27);
}

.social-btn:hover {
  background-color: rgba(255,255,255,0.4);
}

.social-btn i {
  margin-right: 4px;
}
</style>