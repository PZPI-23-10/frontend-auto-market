<template>
  <div class="login-container">
    <div class="progressbar-wrapper">
      <ul id="progressbar">
        <li :class="{ active: currentStep >= 1 }"><span>{{ t('register.progressbar.account') }}</span></li>
        <li :class="{ active: currentStep >= 2 }"><span>{{ t('register.progressbar.personal') }}</span></li>
        <li :class="{ active: currentStep >= 3 }"><span>{{ t('register.progressbar.address') }}</span></li>
      </ul>
    </div>

    <form @submit.prevent="">
      <h3>{{ t('register.title') }}</h3>

      <transition name="fade-slide" mode="out-in">
        <div v-if="currentStep === 1" class="step">
          <label>{{ t('register.step1.email') }}</label>
          <input v-model="email" type="email" :placeholder="t('register.step1.email')" />

          <label>{{ t('register.step1.password') }}</label>
          <input v-model="password" type="password" :placeholder="t('register.step1.password')" />

          <label>{{ t('register.step1.confirmPassword') }}</label>
          <input v-model="confirmPassword" type="password" :placeholder="t('register.step1.confirmPassword')" />
        </div>
      </transition>

      <transition name="fade-slide" mode="out-in">
        <div v-if="currentStep === 2" class="step">
          <label>{{ t('register.step2.firstName') }}</label>
          <input v-model="firstName" type="text" :placeholder="t('register.step2.firstName')" />

          <label>{{ t('register.step2.lastName') }}</label>
          <input v-model="lastName" type="text" :placeholder="t('register.step2.lastName')" />

          <label>{{ t('register.step2.dob') }}</label>
          <input v-model="dateOfBirth" type="date" :placeholder="t('register.step2.dob')" />

          <label>{{ t('register.step2.country') }}</label>
          <select v-model="personalCountry" class="country-select">
                        <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ t(country.nameKey) }}
            </option>
          </select>

          <label>{{ t('register.step2.phone') }}</label>
          <div class="phone-input-container">
            <select v-model="phoneCountry" class="phone-country-select">
              <option v-for="country in countries" :key="country.code" :value="country.phoneCode">
                +{{ country.phoneCode }}
              </option>
            </select>
            <input v-model="phone" type="tel" :placeholder="t('register.step2.phonePlaceholder')" class="phone-input" @keydown="filterPhoneInput" maxlength="10"/>
          </div>
        </div>
      </transition>

      <transition name="fade-slide" mode="out-in">
        <div v-if="currentStep === 3" class="step">
          <label>{{ t('register.step3.address') }}</label>
          <input v-model="address" type="text" :placeholder="t('register.step3.addressPlaceholder')" />

          <div class="buttons">
            <button type="button" class="register-btn" @click="prevStep">
              {{ t('register.buttons.previous') }}
            </button>
            <button type="button" class="login-btn" @click="completeRegistration">
              {{ t('register.buttons.complete') }}
            </button>
          </div>
        </div>
      </transition>

      <div class="buttons" v-if="currentStep < 3" :class="{ single: currentStep === 1 }">
        <button v-if="currentStep > 1" type="button" class="register-btn" @click="prevStep">
          {{ t('register.buttons.previous') }}
        </button>
        <button type="button" class="login-btn" @click="nextStep">
          {{ t('register.buttons.next') }}
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'; 
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'; 
import { useAuth } from '@/store/auth'; 
import { useI18n } from 'vue-i18n'; // 1. ІМПОРТ I18N
import axios from 'axios';

const { setAuthData } = useAuth();
const API_BASE_URL = 'https://backend-auto-market-wih5h.ondigitalocean.app/api/Auth';
const API_URL_REGISTER = `${API_BASE_URL}/register`;
const API_URL_CHECK_EMAIL = `${API_BASE_URL}/email-exists`;
const toast = useToast(); 
const router = useRouter();
const { t } = useI18n(); // 2. ОТРИМАННЯ t

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

// 3. ОНОВЛЕНО: Використання ключів для локалізації
const countries = ref([
  { code: 'UA', nameKey: 'countries.ua', phoneCode: '380' },
  { code: 'US', nameKey: 'countries.us', phoneCode: '1' },
  { code: 'PL', nameKey: 'countries.pl', phoneCode: '48' },
  { code: 'DE', nameKey: 'countries.de', phoneCode: '49' }
]);

// --- Функція валідації Email ---
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// --- Навігація між кроками з валідацією ---
async function nextStep() {
  // 4. ЛОКАЛІЗАЦІЯ ВАЛІДАЦІЇ
  if (currentStep.value === 1) {
    if (!email.value || !password.value || !confirmPassword.value) {
        toast.warning(t('register.validation.allFields')); 
        return;
    }
    if (!isValidEmail(email.value)) {
        toast.warning(t('register.validation.invalidEmail'));
        return;
    }

    // --- НОВА ВАЛІДАЦІЯ ПАРОЛЯ ---
    const pass = password.value;
    
    // 1. Довжина (мінімум 6)
    if (pass.length < 6) {
        toast.warning(t('register.validation.passMinLength', { min: 6 }));
        return;
    }
    // 2. Хоча б одна цифра
    if (!/\d/.test(pass)) {
        toast.warning(t('register.validation.passDigit'));
        return;
    }
    // 3. Хоча б одна маленька літера
    if (!/[a-z]/.test(pass)) {
        toast.warning(t('register.validation.passLowercase'));
        return;
    }
    // 4. Хоча б одна велика літера
    if (!/[A-Z]/.test(pass)) {
        toast.warning(t('register.validation.passUppercase'));
        return;
    }
    // 5. Хоча б один спецсимвол (все, що не буква і не цифра)
    if (!/[^a-zA-Z0-9]/.test(pass)) {
        toast.warning(t('register.validation.passSpecial'));
        return;
    }

    if (password.value !== confirmPassword.value) {
        toast.warning(t('register.validation.passwordMismatch'));
        return;
    }
    // -----------------------------

    // 5. ЛОКАЛІЗАЦІЯ ПОМИЛОК API (Перевірка Email)
    try {
      console.log(`Перевіряємо email: ${email.value}`);
      const response = await axios.get(API_URL_CHECK_EMAIL, {
        params: { email: email.value }
      });
      
      if (response.data === true) {
        toast.error(t('register.errors.emailExists'));
        return;
      }
    } catch (error) {
      console.error('Помилка перевірки email:', error);
      let errorMessage = t('register.errors.emailCheckFailed');
      if (error.response) errorMessage = error.response.data?.message || t('register.errors.serverError');
      else if (error.request) errorMessage = t('register.errors.noConnection');
      toast.error(errorMessage);
      return; 
    }
  }

  // Перехід на наступний крок (якщо це не останній)
  if (currentStep.value === 2) {
    if (!firstName.value || !lastName.value || !dateOfBirth.value || !phone.value) {
        toast.warning(t('register.validation.step2Required'));
        return;
    }
  }

  if (currentStep.value < 3) currentStep.value++;
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
}

// --- Відправка форми реєстрації ---
async function completeRegistration() {
  // 6. ЛОКАЛІЗАЦІЯ ВАЛІДАЦІЇ
  let formattedDateOfBirth = '';
  if (dateOfBirth.value) {
    try {
      formattedDateOfBirth = new Date(dateOfBirth.value).toISOString();
    } catch (e) {
      toast.error(t('register.errors.invalidDate'));
      return;
    }
  } else {
    toast.warning(t('register.validation.dateRequired'));
    return;
  }

  if (!firstName.value || !lastName.value || !phone.value) {
      toast.warning(t('register.validation.step2Required'));
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

  // 7. ЛОКАЛІЗАЦІЯ ВІДПОВІДІ API
  try {
    const response = await axios.post(API_URL_REGISTER, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('Відповідь від сервера (Axios):', response.data);
     const data = response.data; 
   if (!data.accessToken || !data.userId) {
      throw new Error(t('register.errors.noToken'));
    }
    setAuthData(data.userId, data.accessToken); 
    
    toast.info(t('register.success')); 
    router.push('/');

  } catch (error) {
    console.error('Помилка реєстрації (Axios):', error);
    
    let errorMessage = t('register.errors.generic'); 

    if (error.response) {
      console.error('Дані помилки від сервера:', error.response.data);
      const responseData = error.response.data;
      const status = error.response.status;

      if (status === 400) { 
        if (typeof responseData === 'string') {
           errorMessage = responseData; // (Припускаємо, що бекенд вже надсилає локалізований рядок)
        } else if (responseData && responseData.errors) {
           errorMessage = Object.values(responseData.errors).flat().join(' ');
           if (!errorMessage) {
              errorMessage = responseData.title || t('register.errors.validationFailed');
           }
        } else if (responseData?.title) {
            errorMessage = responseData.title; 
        } else {
            errorMessage = t('register.errors.badData');
        }
      } else if (status === 500) { 
          errorMessage = t('register.errors.serverError');
      } else {
          errorMessage = responseData?.message || JSON.stringify(responseData) || error.response.statusText || t('register.errors.serverError');
      }
    } else if (error.request) {
      errorMessage = t('register.errors.noConnection');
    } else {
      errorMessage = t('register.errors.requestFailed', { error: error.message });
    }
    toast.error(errorMessage);
  }
}
function filterPhoneInput(event) {
  // (Логіка без змін, не потребує локалізації)
  const allowedKeys = [
    'Backspace', 'Delete', 'Tab', 'Enter', 
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End'
  ];
  if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x', 'z'].includes(event.key.toLowerCase())) {
    return; 
  }
  if (
    (event.key >= '0' && event.key <= '9') || 
    allowedKeys.includes(event.key) ||
    (event.key.startsWith('Numpad') && !isNaN(event.key.substring(6)))
  ) {
    return; 
  }
  event.preventDefault();
}
</script>

<style scoped>
/* (СТИЛІ НЕ ЗМІНЕНО) */
/* === 1. АДАПТАЦИЯ ФОНА === */
.login-container {
  background-image: url('@/assets/car-header1.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column; 
  justify-content: flex-start; 
  align-items: center;   
  position: relative;
  overflow-y: auto;
  padding-top: 90px;

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
  width: 100%; /* Змінено з 340px на 100% для гнучкості */
  padding: 10px; 
  border-radius: 3px;
  background-color: rgba(255,255,255,0.1);
  border: 1px solid #555;
  font-size: 14px;
  font-weight: 300;
  color: #fff;
  margin-bottom: 5px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  box-sizing: border-box; /* Додано для коректного width 100% */
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
  /* max-width: 340px; (Видалено, .buttons керує шириною) */
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
  width: 100%; /* Змінено з 360px на 100% */
}
.country-select, .phone-country-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); /* Змінено на білу стрілку */
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
  align-items: flex-start; /* Вирівнюємо label зліва */
  gap: 0px; /* Зменшено gap, відступи керуються label */
}
.buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 10px; /* Додано gap для кнопок */
  margin-top: 20px; /* Додано відступ зверху */
}
.buttons button {
  flex: 1;   
  /* max-width: 160px; (Видалено, flex: 1 краще) */
  padding: 12px 0;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0; /* Скидаємо margin-top, керуємо через .buttons */
}
/* (Блок button + button видалено, використовуємо gap) */
.buttons.single {
  justify-content: flex-end; /* Кнопка "Next" завжди справа */
}
.buttons.single .login-btn {
  flex: 0 1 160px; /* Кнопка "Next" має фіксовану ширину */
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