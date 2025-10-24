<template>
  <div class="login-container">
    <div class="background">
      <div class="shape blue"></div>
      <div class="shape orange"></div>
    </div>

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/store/auth'
import { useToast } from 'vue-toastification'

const API_URL = 'http://26.113.169.209:5292/api/Account/login'

const { setAuthData } = useAuth()
const toast = useToast()
const username = ref('')
const password = ref('')
const router = useRouter()

async function login() {
  if (!username.value || !password.value) {
    toast.warning('Введіть email та пароль')
    return
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username.value, 
        password: password.value,
        rememberMe: true
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(errorText || 'Помилка логіну')
    }

    const data = await response.json() 
    console.log('ВІДПОВІДЬ ВІД СЕРВЕРА:', data); 


    if (!data.accessToken || !data.userId) { 
      throw new Error('Сервер не повернув "accessToken" або "userId" у відповіді.');
    }

    setAuthData(data.userId, data.accessToken) 
    toast.success('Вхід виконано успішно!')
    router.push('/')

  } catch (error) {
    console.error('Помилка логіну:', error);
    toast.error(`Помилка: ${error.message}`);  
  }
}

function loginWith(provider) {
  toast.info(`Вхід через ${provider} (поки не реалізовано)`)
}

function goToRegister() {
  router.push('/register')
}
</script>

<style scoped>
/* === 1. АДАПТАЦИЯ ФОНА === */
.login-container {
  /* Используем тот же фон, что и на HomePage.vue */
  background-image: url('@/assets/car-header1.jpg'); /* Убедитесь, что путь верный */
  background-size: cover;
  background-position: center;

  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* Добавляем затемнение, как на HomePage.vue */
.login-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); 
}

/* Цветные круги .background и .shape УДАЛЕНЫ, т.к. они не соответствуют теме */


/* === 2. АДАПТАЦИЯ ФОРМЫ === */
form {
  width: 360px;
  /* Используем тот же "стеклянный" фон, что и в hero-form */
  background-color: rgba(30, 30, 30, 0.7);
  
  position: relative;
  border-radius: 12px;
  backdrop-filter: blur(10px); /* Оставляем сильный блюр */
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 40px 30px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

form h3 {
  font-family: 'Open Sans', sans-serif; /* 3. АДАПТАЦИЯ ШРИФТА */
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
  color: #fff;
}
label {
  width: 100%;
  font-family: 'Open Sans', sans-serif; /* 3. АДАПТАЦИЯ ШРИФТА */
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-top: 15px;
  color: #fff;
}

/* === 4. АДАПТАЦИЯ ПОЛЕЙ ВВОДА === */
input {
  font-family: 'Open Sans', sans-serif; /* 3. АДАПТАЦИЯ ШРИФТА */
  display: block;
  width: 100%;
  max-width: 340px;
  height: 45px;
  padding: 0 10px;
  border-radius: 3px;
  /* Используем тот же фон инпута, что и в hero-form */
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555; /* Добавляем рамку, как в hero-form */
  box-shadow: none;
  font-size: 14px;
  font-weight: 300;
  margin-top: 8px;
  color: #fff;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}
input:focus {
  /* Добавляем подсветку в стиле вашего сайта (#ffd700) */
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  outline: none;
}

::placeholder {
  color: #e5e5e5;
}

/* === 5. АДАПТАЦИЯ КНОПОК === */
.login-btn, .register-btn {
  font-family: 'Open Sans', sans-serif; /* 3. АДАПТАЦИЯ ШРИФТА */
  width: 100%;
  max-width: 360px;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: 45px;
  transition: 0.3s;
}

/* Главная кнопка - красная, как "Get Started" */
.login-btn {
  background-color: #cc0000;
  color: #fff;
}
.login-btn:hover {
  background-color: #aa0000;
}

/* Второстепенная кнопка - полупрозрачная */
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
  font-family: 'Open Sans', sans-serif; /* 3. АДАПТАЦИЯ ШРИФТА */
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