<template>
  <div class="forgot-password-container">
    <form @submit.prevent="requestPasswordReset">
      <h3>Скидання пароля</h3>

      <p class="info-text">
        Введіть ваш email та новий пароль. Ми надішлемо лист для підтвердження зміни.
      </p>

      <label for="email">Email</label>
      <input 
        id="email" 
        type="email" 
        placeholder="Введіть ваш email" 
        v-model="email" 
        required 
        :disabled="isEmailDisabled" 
      />

      <label for="newPassword">Новий Пароль</label>
      <input 
        id="newPassword" 
        type="password" 
        placeholder="Введіть новий пароль" 
        v-model="newPassword" 
        required 
      />

      <label for="confirmPassword">Підтвердіть Пароль</label>
      <input 
        id="confirmPassword" 
        type="password" 
        placeholder="Повторіть новий пароль" 
        v-model="confirmPassword" 
        required 
      />

      <button type="submit" class="submit-btn" :disabled="isLoading">
        {{ isLoading ? 'Відправка...' : 'Надіслати лист підтвердження' }}
      </button>

      <div class="back-to-login">
        <router-link to="/login">Повернутися до входу</router-link>
      </div>
    </form>
  </div>
</template><script setup>
// --- Імпорти ---
import { ref, onMounted } from 'vue'; // Додано onMounted
import { useRouter, useRoute } from 'vue-router'; // Додано useRoute
import { useToast } from 'vue-toastification';
import axios from 'axios';

// --- Константи та ініціалізація ---
const API_FORGOT_PASSWORD_URL = 'https://backend-auto-market.onrender.com/api/Auth/reset-password'; 
const toast = useToast();
const router = useRouter();
const route = useRoute(); // Ініціалізуємо route

// --- Refs для стану ---
const email = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const isEmailDisabled = ref(false); // Для блокування поля email

// --- Хук життєвого циклу ---
onMounted(() => {
  // Перевіряємо, чи є email в query параметрах URL
  const emailFromQuery = route.query.email;
  if (emailFromQuery && typeof emailFromQuery === 'string') {
    email.value = emailFromQuery; // Встановлюємо email
    isEmailDisabled.value = true; // Блокуємо поле для редагування
  }
});

// --- Функція відправки запиту на скидання пароля ---
async function requestPasswordReset() {
  // Валідація полів
  if (!email.value || !newPassword.value || !confirmPassword.value) {
    toast.warning('Будь ласка, заповніть усі поля.');
    return;
  }
  // Додаткова перевірка формату email (можна додати isValidEmail)
  
  if (newPassword.value.length < 5 || newPassword.value.length > 27) {
    toast.warning('Пароль має містити від 5 до 27 символів.');
    return;
  }
  if (newPassword.value !== confirmPassword.value) {
    toast.warning('Нові паролі не співпадають.');
    return;
  }

  isLoading.value = true; // Показуємо індикатор завантаження

  // Формуємо тіло запиту відповідно до бекенду
  const payload = {
      Email: email.value,
      Password: newPassword.value, // Бекенд очікує новий пароль тут
      PasswordConfirmation: confirmPassword.value 
  };

  try {
    console.log(`Відправляємо запит на скидання для ${email.value} на ${API_FORGOT_PASSWORD_URL}`);
    
    // Відправляємо POST запит
    await axios.post(API_FORGOT_PASSWORD_URL, payload, {
        headers: { 'Content-Type': 'application/json' }
    });

    toast.success('Лист для підтвердження зміни пароля надіслано на вашу пошту.');
    router.push('/login'); 

  } catch (error) {
    console.error('Помилка запиту на скидання пароля:', error);
    let errorMessage = 'Не вдалося відправити запит.';
    if (error.response) {
       // Обробка помилок від бекенду
       if (error.response.status === 404) { // NotFound
           errorMessage = 'Якщо акаунт з таким email існує, лист підтвердження надіслано.';
           toast.info(errorMessage); 
       } else if (error.response.status === 400 && typeof error.response.data === 'string') { // BadRequest
           errorMessage = error.response.data; 
           toast.error(`Помилка: ${errorMessage}`);
       } else { // Інші помилки сервера
           errorMessage = error.response.data?.message || 'Помилка сервера.';
           toast.error(`Помилка: ${errorMessage}`);
       }
    } else if (error.request) { // Помилка мережі
      errorMessage = 'Немає відповіді від сервера.';
      toast.error(errorMessage);
    } else { // Інша помилка
      errorMessage = error.message;
      toast.error(errorMessage);
    }
  } finally {
    isLoading.value = false; // Ховаємо індикатор завантаження
  }
}
</script>

<style scoped>
/* === Використовуємо стилі, схожі на Login/Verify === */
.forgot-password-container {
  background-image: url('@/assets/car-header1.jpg'); /* Або інший фон */
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
  margin-top: 30px; /* Збільшив відступ */
  transition: 0.3s;
  font-family: 'Open Sans', sans-serif;
  background-color: #cc0000; /* Червона кнопка */
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