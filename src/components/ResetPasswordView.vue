<template>
  <div class="auth-view">
    <div class="form-container">
      <h3>{{ t('auth.resetPassword.title') }}</h3>
      
      <form @submit.prevent="resetPassword">
        <div class="form-group">
          <label>{{ t('auth.resetPassword.newPasswordLabel') }}</label>
          <input type="password" v-model="password" required placeholder="••••••"/>
        </div>

        <div class="form-group">
          <label>{{ t('auth.resetPassword.confirmPasswordLabel') }}</label>
          <input type="password" v-model="confirmPassword" required placeholder="••••••"/>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? t('auth.resetPassword.updating') : t('auth.resetPassword.submitBtn') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';

// URL для підтвердження зміни
const API_URL = 'https://backend-auto-market.onrender.com/api/Auth/confirm-password-change'; 

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const toast = useToast();

const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

const token = ref('');
const email = ref('');

// --- 1. ОТРИМАННЯ ДАНИХ З ПОСИЛАННЯ ---
onMounted(() => {
  const rawEmail = route.query.email || '';
  const rawToken = route.query.token || '';

  email.value = rawEmail.trim();

  if (rawToken) {
      token.value = rawToken.replace(/ /g, '+');
  }

  if (!token.value || !email.value) {
    toast.error("Невірне посилання: відсутній токен або email.");
  } else {
    console.log("Дані з URL отримано:", { email: email.value, token: token.value });
  }
});

// --- 2. ЗМІНА ПАРОЛЯ ---
async function resetPassword() {
  if (password.value.length < 6) { toast.warning("Пароль занадто короткий (мін 6)."); return; }
  if (!/\d/.test(password.value)) { toast.warning("Потрібна хоча б одна цифра."); return; }
  if (!/[a-z]/.test(password.value)) { toast.warning("Потрібна маленька літера."); return; }
  if (!/[A-Z]/.test(password.value)) { toast.warning("Потрібна велика літера."); return; }
  if (!/[^a-zA-Z0-9]/.test(password.value)) { toast.warning("Потрібен спецсимвол (!@#)."); return; }
  
  if (password.value !== confirmPassword.value) { 
      toast.warning("Паролі не співпадають."); 
      return; 
  }

  isLoading.value = true;
  try {
    // Формуємо JSON, як вимагає бекенд
    const payload = {
      email: email.value,
      token: token.value,
      newPassword: password.value
    };

    console.log("Відправка JSON:", JSON.stringify(payload));

    // Відправляємо запит
    await axios.post(API_URL, payload, {
       headers: { 'Content-Type': 'application/json' }
    });
    
    toast.success("Пароль успішно змінено!");
    
    setTimeout(() => {
        router.push('/login');
    }, 2000);

  } catch (error) {
    console.error("Помилка API:", error);
    
    let msg = "Помилка зміни пароля";
    
    if (error.response) {
        // Якщо сервер повернув текст помилки (наприклад "User not found")
        if (typeof error.response.data === 'string') {
            msg = error.response.data;
        } 
        // Якщо сервер повернув JSON з помилкою
        else if (error.response.data?.message) {
            msg = error.response.data.message;
        }
    }
    
    toast.error(msg);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  background-image: url('@/assets/car-header1.jpg');
  background-size: cover;
  background-position: center;
  display: flex; align-items: center; justify-content: center; position: relative;
}
.auth-view::before {
  content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 0;
}
.form-container {
  position: relative; z-index: 1; background: rgba(30, 30, 30, 0.75); backdrop-filter: blur(10px);
  padding: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
  width: 100%; max-width: 400px; color: #fff; text-align: center;
}
h3 { margin-top: 0; font-size: 24px; margin-bottom: 25px; }
.form-group { text-align: left; margin-bottom: 20px; }
label { display: block; margin-bottom: 5px; font-size: 13px; color: #aaa; }
input {
  width: 100%; height: 45px; padding: 0 10px; background: rgba(255,255,255,0.1); border: 1px solid #555;
  border-radius: 5px; color: #fff; box-sizing: border-box;
}
.btn-primary {
  width: 100%; padding: 12px; background: #cc0000; color: #fff;
  border: none; border-radius: 5px; font-weight: bold; cursor: pointer; transition: 0.2s;
}
.btn-primary:hover { background: #ff0000; }
</style>