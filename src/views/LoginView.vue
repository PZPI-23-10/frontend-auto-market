<template>
  <div class="login-container">
    <form @submit.prevent="login">
      <h3>{{ t('login.title') }}</h3>

      <label for="username">{{ t('login.emailLabel') }}</label>
      <input 
        id="username" 
        type="text" 
        :placeholder="t('login.emailPlaceholder')" 
        v-model="username" 
      />

      <label for="password">{{ t('login.passwordLabel') }}</label>
      <input 
        id="password" 
        type="password" 
        :placeholder="t('login.passwordPlaceholder')" 
        v-model="password" 
      />
      
      <div class="forgot-password">
        <router-link to="/forgot-password">{{ t('login.forgotPassword') }}</router-link>
      </div>

      <button type="submit" class="login-btn">{{ t('login.submit') }}</button>

      <div class="divider"><span>{{ t('login.or') }}</span></div>
      <div id="googleSignInButton"></div>

      <button type="button" class="register-btn" @click="goToRegister">
        {{ t('login.register') }}
      </button>
    </form>
  </div>
</template><script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/store/auth';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const API_LOGIN_URL = 'https://backend-auto-market-wih5h.ondigitalocean.app/api/Auth/login';
const API_GOOGLE_LOGIN_URL = 'https://backend-auto-market-wih5h.ondigitalocean.app/api/Auth/web/google';
const GOOGLE_CLIENT_ID = '71975591740-1ikt0qhpb1g570oogv7pomahcr09hqf8.apps.googleusercontent.com';

const { setAuthData, checkVerificationStatus } = useAuth(); 
const toast = useToast();
const { t } = useI18n();
const username = ref('');
const password = ref('');
const router = useRouter();

async function login() {
  if (!username.value || !password.value) {
    toast.warning(t('login.validation.emailPasswordRequired'));
    return;
  }
  try {
    const response = await axios.post(API_LOGIN_URL, {
      email: username.value,
      password: password.value,
      rememberMe: true
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    const data = response.data;
    if (!data.accessToken || !data.userId) { 
      throw new Error(t('login.errors.noToken')); 
    }
    
    setAuthData(data.userId, data.accessToken);

    await checkVerificationStatus(); 

    toast.success(t('login.success'));
    router.push('/');
    
  } catch (error) {
    console.error('Помилка логіну (Axios):', error);
    let errorMessage;
    if (error.response) {
      errorMessage = error.response.data?.message || error.response.data || error.response.statusText || t('login.errors.invalidCredentials');
    } else if (error.request) {
      errorMessage = t('login.errors.serverConnection');
    } else {
      errorMessage = error.message;
    }
    toast.error(t('login.errors.prefix', { error: errorMessage }));
  }
}

async function handleGoogleCredentialResponse(response) {
  const googleToken = response.credential;
  console.log("Отримано Google ID Token:", googleToken);
  try {
    const backendResponse = await axios.post(API_GOOGLE_LOGIN_URL, { googleToken, rememberMe: true });
    const data = backendResponse.data;
    if (!data.accessToken || !data.userId) { throw new Error(t('login.errors.noToken')); }
    
    setAuthData(data.userId, data.accessToken);

    await checkVerificationStatus();

    toast.success(t('login.googleSuccess'));
    router.push('/');
    
  } catch (error) {
    console.error('Помилка Google логіну на бекенді:', error);
    let errorMessage;
     if (error.response) {
       errorMessage = error.response.data?.message || error.response.data || t('login.errors.googleServer');
     } else if (error.request) {
       errorMessage = t('login.errors.serverConnection');
     } else {
       errorMessage = error.message || t('login.errors.googleGeneric');
     }
    toast.error(t('login.errors.prefix', { error: errorMessage }));
  }
}

onMounted(() => {
  if (!GOOGLE_CLIENT_ID) {
    console.error('VITE_GOOGLE_CLIENT_ID не знайдено у змінних середовища!');
    toast.error(t('login.errors.googleConfig'));
    return; 
  }

  if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse
      });
      google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large", width: "300" } 
      );
    } catch (error) {
      console.error("Помилка ініціалізації Google Sign-In:", error);
      toast.error(t('login.errors.googleInit'));
    }
  } else {
    console.error("Бібліотека Google Identity Services (GSI) не завантажилась або недоступна.");
  }
});

function goToRegister() {
  router.push('/register');
}
</script>
  
<style scoped>
/* СТИЛІ НЕ ЗМІНЕНО */
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

  input {
    font-family: 'Open Sans', sans-serif;
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

  .login-btn, .register-btn {
    font-family: 'Open Sans', sans-serif;
    width: 100%;
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
  .forgot-password {
  width: 100%; 
  text-align: right;
  margin-top: 10px; 
  margin-bottom: -25px; 
}
.forgot-password a {
  color: #ccc; 
  font-size: 13px;
  text-decoration: none;
}
.forgot-password a:hover {
  color: #fff; 
  text-decoration: underline;
}
.login-btn {
  margin-top: 45px;
}
/* ‼️ СТИЛІ ДЛЯ #googleSignInButton ТА .divider 
 *   (Вони керуються Google та стилями форми)
 *   Але ми додамо відступи:
 */
.divider {
  font-family: 'Open Sans', sans-serif;
  color: #ccc;
  text-align: center;
  margin-top: 25px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.divider span {
  padding: 0 15px;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #555;
}

#googleSignInButton {
  margin-top: 20px;
  /* Google сам встановить ширину 300px */
}

.register-btn {
  margin-top: 20px; /* Зменшено відступ, бо він після Google */
}
</style>