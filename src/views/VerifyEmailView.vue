<template>
  <div class="verify-container">
    <form @submit.prevent="verifyEmail">
      <h3>{{ t('verifyEmail.title') }}</h3>

      <p class="info-text">
        {{ t('verifyEmail.infoText') }}
      </p>

      <label for="verificationCode">{{ t('verifyEmail.codeLabel') }}</label>
      <input 
        id="verificationCode" 
        type="text" 
        :placeholder="t('verifyEmail.codePlaceholder')" 
        v-model="verificationCode" 
        maxlength="6" 
      />

      <button type="submit" class="verify-btn" :disabled="isLoading">
        {{ isLoading ? t('verifyEmail.verifyingButton') : t('verifyEmail.verifyButton') }}
      </button>

      <button type="button" class="resend-btn" @click="resendCode" :disabled="isLoading">
        {{ t('verifyEmail.resendButton') }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/store/auth'; 
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n'; // 1. ІМПОРТ I18N
import axios from 'axios';

const API_BASE_URL = 'https://backend-auto-market.onrender.com/api/Auth'; 
const VERIFY_EMAIL_URL = `${API_BASE_URL}/verify-email`;

// 2. ОНОВЛЕНО: Отримуємо clearAuthData
const { token, clearAuthData } = useAuth(); 
const toast = useToast();
const router = useRouter();
const { t } = useI18n(); // 3. ОТРИМАННЯ t

const verificationCode = ref('');
const isLoading = ref(false);

async function verifyEmail() {
  // 4. Локалізація
  if (!verificationCode.value || verificationCode.value.length !== 6) {
    toast.warning(t('verifyEmail.toast.codeRequired'));
    return;
  }
  if (!token.value) {
      toast.error(t('verifyEmail.toast.noToken'));
      router.push('/login'); 
      return;
  }

  isLoading.value = true;

  try {
    const response = await axios.post(VERIFY_EMAIL_URL, 
      { code: verificationCode.value },
      { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.value}` 
        }
      }
    );

    toast.success(t('verifyEmail.toast.success')); // 5. Локалізація
    router.push('/profile'); 

  } catch (error) {
    console.error('Помилка підтвердження email:', error);
    // 6. Локалізація блоку помилок
    let errorMessage = t('verifyEmail.toast.errorDefault');
    if (error.response) {
      if (error.response.status === 400) {
        if (typeof error.response.data === 'string' && error.response.data.includes("Invalid verification code")) {
           errorMessage = t('verifyEmail.toast.invalidCode'); // Специфічна помилка
        } else {
           errorMessage = error.response.data || t('verifyEmail.toast.badRequest');
        }
      } else if (error.response.status === 401) { 
          errorMessage = t('verifyEmail.toast.unauthorized');
          clearAuthData(); // Використовуємо імпортовану функцію
          router.push('/login');
      } else if (error.response.status === 404) { 
          errorMessage = t('verifyEmail.toast.notFound');
      } else {
          errorMessage = error.response.data?.message || t('verifyEmail.toast.serverError');
      }
    } else if (error.request) {
      errorMessage = t('verifyEmail.toast.noResponse');
    } else {
      errorMessage = error.message;
    }
    toast.error(t('verifyEmail.toast.errorPrefix', { error: errorMessage }));
  } finally {
    isLoading.value = false;
  }
}

async function resendCode() {
  // ‼️ ЦЯ ФУНКЦІЯ ПОТРЕБУЄ РЕАЛІЗАЦІЇ ЕНДПОІНТУ НА БЕКЕНДІ ‼️
  // 7. Локалізація
  toast.info(t('verifyEmail.toast.resendNotImplemented'));
}
</script>

<style scoped>
/* (СТИЛІ НЕ ЗМІНЕНО) */
.verify-container {
  background-image: url('@/assets/car-header1.jpg'); 
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 40px 20px; 
}
.verify-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); 
}
form {
  width: 100%; 
  max-width: 400px; 
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
  margin-bottom: 5px; 
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
  font-size: 16px; 
  font-weight: 500;
  margin-top: 8px;
  color: #fff;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  text-align: center; 
  letter-spacing: 0.2em; 
  box-sizing: border-box; /* Додано для коректного width 100% */
}
input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  outline: none;
}
::placeholder {
  color: #e5e5e5;
  letter-spacing: normal; 
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