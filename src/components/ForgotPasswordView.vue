<template>
  <div class="forgot-password-container">
    <form @submit.prevent="requestPasswordReset">
      <h3>{{ t('forgotPassword.title') }}</h3>

      <p class="info-text">
        {{ t('forgotPassword.infoText') }}
      </p>

      <label for="email">{{ t('login.emailLabel') }}</label>
      <input 
        id="email" 
        type="email" 
        :placeholder="t('login.emailPlaceholder')" 
        v-model="email" 
        required 
        :disabled="isEmailDisabled" 
      />

      <label for="newPassword">{{ t('profile.passwordTab.new') }}</label>
      <input 
        id="newPassword" 
        type="password" 
        :placeholder="t('profile.passwordTab.new')" 
        v-model="newPassword" 
        required 
      />

      <label for="confirmPassword">{{ t('profile.passwordTab.confirm') }}</label>
      <input 
        id="confirmPassword" 
        type="password" 
        :placeholder="t('profile.passwordTab.confirm')" 
        v-model="confirmPassword" 
        required 
      />

      <button type="submit" class="submit-btn" :disabled="isLoading">
        {{ isLoading ? t('forgotPassword.submitting') : t('forgotPassword.submit') }}
      </button>

      <div class="back-to-login">
        <router-link to="/login">{{ t('forgotPassword.backToLogin') }}</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
// --- Імпорти ---
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n'; // 1. Імпорт локалізації
import axios from 'axios';

// --- Константи та ініціалізація ---
const API_FORGOT_PASSWORD_URL = 'https://backend-auto-market.onrender.com/api/Auth/reset-password'; 
const toast = useToast();
const router = useRouter();
const route = useRoute();
const { t } = useI18n(); // 2. Ініціалізація функції перекладу

// --- Refs для стану ---
const email = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const isEmailDisabled = ref(false);

// --- Хук життєвого циклу ---
onMounted(() => {
  const emailFromQuery = route.query.email;
  if (emailFromQuery && typeof emailFromQuery === 'string') {
    email.value = emailFromQuery;
    isEmailDisabled.value = true;
  }
});

// --- Функція відправки запиту ---
async function requestPasswordReset() {
  // Валідація
  if (!email.value || !newPassword.value || !confirmPassword.value) {
    toast.warning(t('forgotPassword.toast.fillAll')); // Локалізована помилка
    return;
  }
  
  if (newPassword.value.length < 5 || newPassword.value.length > 27) {
    // Використовуємо існуючий ключ для довжини пароля
    toast.warning(t('profile.passwordTab.toast.lengthError', { min: 5, max: 27 }));
    return;
  }
  
  if (newPassword.value !== confirmPassword.value) {
    // Використовуємо існуючий ключ для неспівпадіння
    toast.warning(t('profile.passwordTab.toast.mismatchError'));
    return;
  }

  isLoading.value = true;

  const payload = {
      Email: email.value,
      Password: newPassword.value,
      PasswordConfirmation: confirmPassword.value 
  };

  try {
    console.log(`Відправляємо запит на скидання для ${email.value}`);
    
    await axios.post(API_FORGOT_PASSWORD_URL, payload, {
        headers: { 'Content-Type': 'application/json' }
    });

    toast.success(t('forgotPassword.toast.sentSuccess')); // Локалізований успіх
    router.push('/login'); 

  } catch (error) {
    console.error('Помилка запиту на скидання пароля:', error);
    
    // Локалізована дефолтна помилка
    let errorMessage = t('forgotPassword.toast.sendFail');
    
    if (error.response) {
       if (error.response.status === 404) {
           // Можна залишити це повідомлення або додати ключ
           errorMessage = t('forgotPassword.toast.sentSuccess'); // Для безпеки часто пишуть "успіх", навіть якщо мейла немає
           toast.info(errorMessage); 
           return; // Щоб не показувати error знизу
       } else if (error.response.status === 400 && typeof error.response.data === 'string') {
           errorMessage = error.response.data; // Повідомлення з бекенду зазвичай не перекладають, або треба мапити
           toast.error(`${t('login.errors.prefix', { error: '' })} ${errorMessage}`);
           return;
       } else {
           errorMessage = error.response.data?.message || t('profile.errors.serverError');
       }
    } else if (error.request) {
      errorMessage = t('profile.errors.noResponse');
    } else {
      errorMessage = error.message;
    }
    
    toast.error(t('profile.errors.prefix', { error: errorMessage }));
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* ВАШІ СТИЛІ ЗАЛИШАЮТЬСЯ БЕЗ ЗМІН */
.forgot-password-container {
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

.forgot-password-container::before {
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

.submit-btn {
  width: 100%;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: 30px;
  transition: 0.3s;
  font-family: 'Open Sans', sans-serif;
  background-color: #cc0000;
  color: #fff;
}
.submit-btn:hover:not(:disabled) {
  background-color: #aa0000;
}
.submit-btn:disabled {
  background-color: #555;
  cursor: not-allowed;
}

.back-to-login {
  margin-top: 20px;
  font-size: 14px;
}
.back-to-login a {
  color: #ccc;
  text-decoration: none;
}
.back-to-login a:hover {
  color: #fff;
  text-decoration: underline;
}
input:disabled {
  background-color: rgba(255, 255, 255, 0.05);
  color: #aaa;
  cursor: not-allowed; 
  border-color: #444; 
}
input:disabled:focus {
    border-color: #444; 
    box-shadow: none;
}
</style>