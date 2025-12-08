<template>
  <div class="auth-view">
    <div class="form-container">
      <h3>{{ t('auth.forgotPassword.title') }}</h3>
      
      <p class="info-text">
        {{ t('auth.forgotPassword.infoText') }}
      </p>

      <form @submit.prevent="sendResetLink">
        <div class="form-group">
          <label>{{ t('auth.forgotPassword.emailLabel') }}</label>
          <input 
            type="email" 
            v-model="email" 
            placeholder="example@mail.com" 
            required 
          />
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.submitBtn') }}
        </button>

        <div class="back-link">
          <router-link to="/login">
            {{ t('auth.forgotPassword.backToLogin') }}
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const API_URL = 'https://backend-auto-market-wih5h.ondigitalocean.app/api/Auth/reset-password';

const email = ref('');
const isLoading = ref(false);
const toast = useToast();
const { t } = useI18n();

async function sendResetLink() {
  if (!email.value) return;
  
  isLoading.value = true;
  try {
    const clientUrl = `${window.location.origin}/reset-password`;

    const payload = {
      email: email.value,
      clientUrl: clientUrl 
    };

    console.log("Відправка запиту:", payload);

    await axios.post(API_URL, payload, {
       headers: { 'Content-Type': 'application/json' }
    });
    
    toast.success("Лист надіслано! Перевірте пошту.");
    email.value = '';

  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 404) {
        toast.success("Лист надіслано! Перевірте пошту."); 
    } else {
        toast.error("Помилка сервера. Спробуйте пізніше.");
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Використовуємо ті ж стилі, що і в Login/Register для краси */
.auth-view {
  min-height: 100vh;
  background-image: url('@/assets/car-header1.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.auth-view::before {
  content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 0;
}
.form-container {
  position: relative; z-index: 1;
  background: rgba(30, 30, 30, 0.75);
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  width: 100%; max-width: 400px;
  color: #fff; text-align: center;
}
h3 { margin-top: 0; font-size: 24px; margin-bottom: 15px; }
.info-text { color: #ccc; font-size: 14px; margin-bottom: 25px; line-height: 1.5; }
.form-group { text-align: left; margin-bottom: 20px; }
label { display: block; margin-bottom: 5px; font-size: 13px; color: #aaa; }
input {
  width: 100%; height: 45px; padding: 0 10px;
  background: rgba(255,255,255,0.1); border: 1px solid #555;
  border-radius: 5px; color: #fff; box-sizing: border-box;
}
.btn-primary {
  width: 100%; padding: 12px; background: #cc0000; color: #fff;
  border: none; border-radius: 5px; font-weight: bold; cursor: pointer; transition: 0.2s;
}
.btn-primary:hover { background: #ff0000; }
.back-link { margin-top: 20px; font-size: 14px; }
.back-link a { color: #ffd700; text-decoration: none; }
</style>