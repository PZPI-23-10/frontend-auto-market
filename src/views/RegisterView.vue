<template>
  <div class="login-container">
    <div class="progressbar-wrapper">
      <ul id="progressbar">
        <li :class="{ active: currentStep >= 1 }"><span>Account Setup</span></li>
        <li :class="{ active: currentStep >= 2 }"><span>Personal Data</span></li>
        <li :class="{ active: currentStep >= 3 }"><span>Address</span></li>
      </ul>
    </div>

    <form @submit.prevent="">
      <h3>Створення акаунту</h3>

      <transition name="fade-slide" mode="out-in">
        <div v-if="currentStep === 1" class="step">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="Email" />

          <label>Password</label>
          <input v-model="password" type="password" placeholder="Password" />

          <label>Confirm Password</label>
          <input v-model="confirmPassword" type="password" placeholder="Confirm Password" />
        </div>
      </transition>

      <transition name="fade-slide" mode="out-in">
        <div v-if="currentStep === 2" class="step">
          <label>First Name</label>
          <input v-model="firstName" type="text" placeholder="First Name" />

          <label>Last Name</label>
          <input v-model="lastName" type="text" placeholder="Last Name" />

          <label>Date of Birth</label>
          <input v-model="dateOfBirth" type="date" placeholder="Date of Birth" />

          <label>Country</label>
          <select v-model="personalCountry" class="country-select">
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.name }}
            </option>
          </select>

          <label>Phone Number</label>
          <div class="phone-input-container">
            <select v-model="phoneCountry" class="phone-country-select">
              <option v-for="country in countries" :key="country.code" :value="country.phoneCode">
                +{{ country.phoneCode }}
              </option>
            </select>
            <input v-model="phone" type="tel" placeholder="Phone Number" class="phone-input"/>
          </div>
        </div>
      </transition>

      <transition name="fade-slide" mode="out-in">
        <div v-if="currentStep === 3" class="step">
          <label>Address (optional)</label>
          <input v-model="address" type="text" placeholder="Address" />

          <div class="buttons">
            <button type="button" class="register-btn" @click="prevStep">
              Previous
            </button>
            <button type="button" class="login-btn" @click="completeRegistration">
              Complete Registration
            </button>
          </div>
        </div>
      </transition>

      <div class="buttons" v-if="currentStep < 3" :class="{ single: currentStep === 1 }">
        <button v-if="currentStep > 1" type="button" class="register-btn" @click="prevStep">
          Previous
        </button>
        <button type="button" class="login-btn" @click="nextStep">
          Next
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'; // Убраны ненужные импорты
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'; // Імпорт для сповіщень

import axios from 'axios';
const API_BASE_URL = 'https://backend-auto-market.onrender.com/api/Account';
const API_URL_REGISTER = `${API_BASE_URL}/register`;
const API_URL_CHECK_EMAIL = `${API_BASE_URL}/emailExists`;
const toast = useToast(); // Ініціалізація toast
const router = useRouter();

const currentStep = ref(1);

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const firstName = ref('');
const lastName = ref('');
const dateOfBirth = ref('');
const personalCountry = ref('UA');
const phoneCountry = ref('380');
const phone = ref('');
const address = ref('');

const countries = ref([
  { code: 'UA', name: 'Ukraine', phoneCode: '380' },
  { code: 'US', name: 'United States', phoneCode: '1' },
  { code: 'PL', name: 'Poland', phoneCode: '48' },
  { code: 'DE', name: 'Germany', phoneCode: '49' }
]);

// --- Функція валідації Email ---
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// --- Навігація між кроками з валідацією ---
async function nextStep() {
  // Валідація Кроку 1
  if (currentStep.value === 1) {
    // --- Попередні перевірки (порожні поля, формат, довжина, співпадіння) ---
    if (!email.value || !password.value || !confirmPassword.value) { /* ... помилка ... */ return; }
    if (!isValidEmail(email.value)) { /* ... помилка ... */ return; }
    if (password.value.length < 5 || password.value.length > 27) { /* ... помилка ... */ return; }
    if (password.value !== confirmPassword.value) { /* ... помилка ... */ return; }
    // --- Кінець попередніх перевірок ---

    // === ПЕРЕВІРКА EMAIL НА БЕК-ЕНДІ (ЧЕРЕЗ GET) ===
    try {
      console.log(`Перевіряємо email: ${email.value} на ${API_URL_CHECK_EMAIL}`);
      // ‼️ ВИКОРИСТОВУЄМО GET З ПАРАМЕТРОМ `params` ‼️
      const response = await axios.get(API_URL_CHECK_EMAIL, {
        params: {
          email: email.value // Параметр запиту ?email=...
        }
      });

      // Бек-енд повертає Ok(true) або Ok(false)
      const emailExists = response.data; // Очікуємо true або false

      if (emailExists === true) {
        // Якщо бек-енд повернув true, показуємо помилку
        toast.error('Користувач з таким email вже існує.');
        return; // НЕ переходимо на наступний крок
      }
      // Якщо emailExists === false, email вільний, продовжуємо

    } catch (error) {
      // Обробляємо інші помилки (мережа, сервер 500 тощо)
      console.error('Помилка перевірки email:', error);
      let errorMessage = 'Не вдалося перевірити email. Спробуйте пізніше.';
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data || 'Помилка сервера при перевірці email.';
      } else if (error.request) {
        errorMessage = 'Немає відповіді від сервера.';
      } else {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      return; // НЕ переходимо на наступний крок
    }
  }

  // Валідація Кроку 2 (без змін)
  if (currentStep.value === 2) {
    if (!firstName.value || !lastName.value || !dateOfBirth.value || !phone.value) { /* ... помилка ... */ return; }
  }

  // Перехід на наступний крок (якщо всі перевірки пройшли)
  if (currentStep.value < 3) currentStep.value++;
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
}

// --- Відправка форми реєстрації ---
async function completeRegistration() {
  let formattedDateOfBirth = '';
  if (dateOfBirth.value) {
    try {
      formattedDateOfBirth = new Date(dateOfBirth.value).toISOString();
    } catch (e) {
      toast.error('Невірний формат дати народження.');
      return;
    }
  } else {
    toast.warning('Будь ласка, вкажіть дату народження.');
    return;
  }

  const payload = {
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    country: personalCountry.value,
    dateOfBirth: formattedDateOfBirth,
    password: password.value,
    phoneNumber: `+${phoneCountry.value}${phone.value}`,
    address: address.value,
  }

  console.log("Відправляємо дані:", JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Відповідь від сервера (Axios):', response.data);
    toast.success('Реєстрація успішна! Тепер ви можете увійти.');
    router.push('/login');

  } catch (error) {
    console.error('Помилка реєстрації (Axios):', error);
    
    let errorMessage = 'Помилка реєстрації';
    if (error.response) {
      if (error.response.data && error.response.data.errors) {
        errorMessage = Object.values(error.response.data.errors).flat().join(' ');
      } else {
         errorMessage = error.response.data?.message || error.response.data || error.response.statusText || 'Помилка сервера';
      }
    } else if (error.request) {
      errorMessage = 'Не вдалося підключитися до сервера';
    } else {
      errorMessage = error.message;
    }
    toast.error(`Помилка: ${errorMessage}`);
  }
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
  flex-direction: column; 
  justify-content: center; 
  align-items: center;   
  position: relative;
  overflow: hidden;
  padding: 40px 0;
}
.login-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); 
}

/* === 2. АДАПТАЦИЯ ПРОГРЕССБАРА === */
.progressbar-wrapper {
  font-family: 'Open Sans', sans-serif;
  width: 360px;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  z-index: 2;
}
#progressbar {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: step;
}
#progressbar li {
  text-align: center;
  position: relative;
  flex: 1;
}
#progressbar li:before {
  content: '';
  width: 25px;
  height: 25px;
  display: block;
  margin: 0 auto 6px auto;
  border-radius: 50%;
  background: #555;
  border: 2px solid #555;
  transition: all 0.3s ease;
  z-index: 1;
}
#progressbar li.active:before {
  background: #ffd700;
  border-color: #ffd700;
}
#progressbar li:after {
  content: '';
  position: absolute;
  width: 95px;
  height: 2px;
  background: rgba(255,255,255,0.2);
  top: 12px;
  left: -47.5px;
  z-index: 0;
  transition: all 0.3s ease;
}
#progressbar li:first-child:after {
  content: none;
}
#progressbar li.active:after {
  background: #ffd700;
}
#progressbar li span {
  display: block;
  font-size: 11px;
  color: #fff;
  margin-top: 4px;
  font-family: 'Open Sans', sans-serif;
}

/* === 3. АДАПТАЦИЯ ФОРМЫ === */
form {
  width: 360px;
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255,255,255,0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
  overflow: hidden;
  position: relative;
}

form h3 {
  font-family: 'Open Sans', sans-serif;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin: 20px 0 15px 0;
  color: #fff;
  transition: all 0.5s ease;
}

/* === 4. АДАПТАЦИЯ ПОЛЕЙ ВВОДА === */
label, .step label {
  width: 100%;
  font-family: 'Open Sans', sans-serif;
  color: #fff;
  margin-top: 12px;
  margin-bottom: 4px;
  font-size: 14px;
  text-align: left;
}
input, textarea, .country-select, .phone-country-select {
  display: block;
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  max-width: 340px;
  height: 45px;
  padding: 10px; 
  border-radius: 3px;
  background-color: rgba(255,255,255,0.1);
  border: 1px solid #555;
  font-size: 14px;
  font-weight: 300;
  color: #fff;
  margin-bottom: 5px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
::placeholder {
  color: #e5e5e5;
}
input:focus, textarea:focus, .country-select:focus, .phone-country-select:focus {
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  outline: none;
}
textarea {
  height: 90px;
  resize: none;
  line-height: 1.5;
}

/* === 5. АДАПТАЦИЯ КНОПОК === */
.login-btn, .register-btn {
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  max-width: 340px;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
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

/* === 6. СТИЛИ ВЫПАДАЮЩИХ СПИСКОВ (select) === */
.phone-input-container {
  display: flex;
  width: 100%;
  gap: 10px;
}
.phone-country-select {
  width: 100px;
  flex-shrink: 0;
}
.country-select {
  width: 100%;
}
.country-select, .phone-country-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3e%3cpath d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  cursor: pointer;
}
.phone-input {
  flex: 1;
}
.country-select option, .phone-country-select option {
  background-color: #2a2a2a;
  color: white;
  padding: 10px;
}

/* === 7. ОСТАЛЬНЫЕ СТИЛИ (позиционирование) === */
.step {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}
.buttons button {
  flex: 1;   
  max-width: 160px; 
  padding: 12px 0;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
.buttons button + button {
  margin-left: 10px;   
}
.buttons.single {
  justify-content: center;
}
.buttons.single .login-btn {
  max-width: 160px;
}

/* === 8. АНИМАЦИЯ (без изменений) === */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>