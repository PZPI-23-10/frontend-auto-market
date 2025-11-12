<template>
  <div class="profile-view">
    <h1>Налаштування</h1> 
    <div class="profile-container">
      
      <aside class="profile-sidebar">
        <nav class="profile-nav">
          <ul>
            <li>
              <a 
                href="#"
                :class="{ active: activeTab === 'profile' }"
                @click.prevent="activeTab = 'profile'"
              >
                Основний профіль
              </a>
            </li>
            <li>
              <a 
                href="#" 
                :class="{ active: activeTab === 'password' }"
                @click.prevent="activeTab = 'password'"
              >
                Зміна пароля
              </a>
            </li>
            <li>
              <a 
                href="#" 
                :class="{ active: activeTab === 'orders' }"
                @click.prevent="activeTab = 'orders'"
              >
                Виставлені замовлення
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <main class="profile-content">

        <div v-if="activeTab === 'profile'" class="tab-pane">
          <h2>Основний профіль</h2>
          <div v-if="!user.isVerified" class="email-verification-section">
            <p class="verification-status warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              Ваш email ще не підтверджено.
            </p>
            <p class="info-text">
              Ми надіслали 6-значний код на вашу пошту (<b>{{ user.email }}</b>) під час реєстрації. Будь ласка, введіть його нижче.
            </p>
            <div class="verification-code-input">
              <label for="verifyCode">Введіть код з листа:</label>
              <div class="input-group">
                <input 
                  id="verifyCode" 
                  type="text" 
                  v-model="verificationCode" 
                  maxlength="6" 
                  placeholder="6 цифр"
                />
                <button @click="verifyCode" class="btn-primary" :disabled="isLoadingVerify">
                  {{ isLoadingVerify ? 'Перевірка...' : 'Підтвердити' }}
                </button>
              </div>
              <button @click="sendVerificationEmail" class="btn-link resend-link" :disabled="isLoadingEmail">
                {{ isLoadingEmail ? 'Надсилаємо...' : 'Не отримали код? Надіслати повторно' }}
              </button>
            </div>
          </div>
          <p v-else class="verification-status success">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Email підтверджено.
          </p>
          <div class="avatar-upload-section">
            <div class="avatar-preview" @click="triggerFileUpload">
              <img :src="user.avatarUrl || defaultAvatar" alt="Аватар профілю">
              <div class="avatar-edit-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
            </div>
            <div class="avatar-info">
              <h3>{{ fullName }}</h3>
              <p>{{ user.email }}</p>
              <p v-if="user.address" class="avatar-address">
                {{ user.address }}
              </p>
            </div>
          </div>
          <input 
            type="file" 
            @change="onFileSelected" 
            accept="image/*" 
            style="display: none;" 
            ref="fileInput"
          >
          
          <form @submit.prevent="saveProfile">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Ім'я</label>
                <input type="text" id="firstName" v-model="user.firstName">
              </div>
              <div class="form-group">
                <label for="lastName">Прізвище</label>
                <input type="text" id="lastName" v-model="user.lastName">
              </div>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" v-model="user.email" disabled>
            </div>
            <div class="form-group phone-group">
              <label for="phoneCode">Номер телефону</label>
              <div class="input-group">
                <select id="phoneCode" v-model="user.phoneCode">
                  <option v-for="country in countries" :key="country.code" :value="country.phoneCode">
                    +{{ country.phoneCode }} ({{ country.code }})
                  </option>
                </select>
                <input 
                  type="tel" 
                  id="phoneNumber" 
                  v-model="user.phoneNumber" 
                  placeholder="99 123 4567"
                  @keydown="filterPhoneInput" 
                  maxlength="10"
                >
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="country">Країна</label>
                <select id="country" v-model="user.country">
                  <option value="" disabled>Оберіть країну</option>
                  <option v-for="country in countries" :key="country.code" :value="country.code">
                    {{ country.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="birthday">День народження</label>
                <input type="date" id="birthday" v-model="user.birthday"> 
              </div>
            </div>
            <div class="form-group">
              <label for="address">Адреса</label>
              <input type="text" id="address" v-model="user.address">
            </div>
            <div class="form-group">
              <label for="bio">Про себе</label>
              <textarea id="bio" v-model="user.bio" rows="4"></textarea>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-primary">Зберегти зміни</button>
            </div>
          </form>
        </div>

        <div v-if="activeTab === 'password'" class="tab-pane">
          <section class="password-section">
            <h2>Зміна пароля</h2>
            <form @submit.prevent="changePassword">
              <div class="form-group">
                <label for="currentPassword">Поточний пароль</label>
                <input type="password" id="currentPassword" v-model="passwordForm.currentPassword">
                <a href="#" @click.prevent="forgotPassword" class="forgot-password-link">
                  Забули пароль?
                </a>
              </div>
              <div class="form-group">
                <label for="newPassword">Новий пароль</label>
                <input type="password" id="newPassword" v-model="passwordForm.newPassword">
              </div>
              <div class="form-group">
                <label for="confirmPassword">Підтвердити новий пароль</label>
                <input type="password" id="confirmPassword" v-model="passwordForm.confirmPassword">
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-primary">Оновити пароль</button>
              </div>
            </form>
          </section>
        </div>

        <div v-if="activeTab === 'orders'" class="tab-pane">
          
          <div class="tab-header">
            <h2>Виставлені замовлення</h2>
            <button @click="goToCreateListing" class="btn-primary add-listing-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Створити оголошення
            </button>
          </div>
          
          <p>Тут буде список ваших виставлених на продаж автомобілів або замовлень.</p>
          </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/store/auth';
import { useToast } from 'vue-toastification';
import defaultAvatar from '@/assets/default-avatar.png'; 
import axios from 'axios';

const toast = useToast();
const API_BASE_URL = 'https://backend-auto-market.onrender.com/api/Account';
const VERIFY_EMAIL_URL = `${API_BASE_URL}/verify-email`;
const SEND_VERIFICATION_URL = `${API_BASE_URL}/send-verification-email`;
const router = useRouter(); // <--- Вже ініціалізовано

// 2. Дістаємо 'clearAuthData' з 'useAuth'
const { userId, token, clearAuthData } = useAuth();

const countries = ref([
  { code: 'UA', name: 'Україна', phoneCode: '380' },
  { code: 'PL', name: 'Польща', phoneCode: '48' },
  { code: 'DE', name: 'Німеччина', phoneCode: '49' },
  { code: 'US', name: 'США', phoneCode: '1' },
  { code: 'GB', name: 'Велика Британія', phoneCode: '44' },
]);

const activeTab = ref('profile');
const user = ref({
  firstName: '',
  lastName: '',
  email: '',
  phoneCode: '380',
  phoneNumber: '',
  country: 'UA',
  address: '',
  birthday: '', 
  bio: '',     
  avatarUrl: null,
  isVerified: false 
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const fileInput = ref(null); 
const selectedFile = ref(null); 
const initialAvatarUrl = ref(null); 

const verificationCodeSent = ref(false); 
const verificationCode = ref('');      
const isLoadingEmail = ref(false);     
const isLoadingVerify = ref(false);    

const fullName = computed(() => {
  if (!user.value.firstName && !user.value.lastName) {
    return 'Ім\'я Прізвище'; 
  }
  return `${user.value.firstName} ${user.value.lastName}`.trim(); 
});

onMounted(async () => {
  if (!userId.value || !token.value) {
    toast.error('Ви не увійшли в систему. Перенаправляємо на сторінку логіну.');
    router.push('/login');
    return;
  } 

  try {
    const response = await axios.get(`${API_BASE_URL}?userId=${userId.value}`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    });   
    
    const data = response.data;
    console.log("Profile data received:", data); 

    user.value.firstName = data.firstName || '';
    user.value.lastName = data.lastName || '';
    user.value.email = data.email || '';
    user.value.address = data.address || '';
    user.value.bio = data.aboutYourself || ''; 
    user.value.avatarUrl = data.urlPhoto || null; 
    user.value.country = data.country || 'UA';
    user.value.isVerified = data.isVerified || false; 
    initialAvatarUrl.value = data.urlPhoto || null; 

    if (data.dateOfBirth) {
      try {
        user.value.birthday = new Date(data.dateOfBirth).toISOString().split('T')[0];
      } catch (e) {
        console.error("Invalid date format received for dateOfBirth:", data.dateOfBirth);
        user.value.birthday = ''; 
      }
    }
    
    const fullPhone = data.phoneNumber || '';
    let foundCode = false;
    const sortedCountries = [...countries.value].sort((a, b) => b.phoneCode.length - a.phoneCode.length);
    for (const country of sortedCountries) {
      const codeWithPlus = `+${country.phoneCode}`;
      if (fullPhone.startsWith(codeWithPlus)) {
        user.value.phoneCode = country.phoneCode;
        user.value.phoneNumber = fullPhone.substring(codeWithPlus.length);
        foundCode = true;
        break;
      }
    }
    if (!foundCode && fullPhone) {
        user.value.phoneNumber = fullPhone.replace(/^\+/, ''); 
        const defaultCountry = countries.value.find(c => c.code === user.value.country);
        user.value.phoneCode = defaultCountry ? defaultCountry.phoneCode : '380'; 
    }

  } catch (error) {
     console.error('Помилка завантаження профілю (Axios):', error);
     let errorMessage = 'Не вдалося завантажити профіль.';
     if (error.response) {
       errorMessage = error.response.data?.message || error.response.data || 'Помилка сервера.';
       if (error.response.status === 401) {
           clearAuthData(); 
           router.push('/login');
           errorMessage = 'Сесія застаріла.';
       }
     } else if (error.request) {
       errorMessage = 'Немає відповіді від сервера.';
     } else {
       errorMessage = error.message;
     }
     toast.error(errorMessage);
  }
});

async function sendVerificationEmail() {
   if (!token.value) {
       toast.error('Помилка авторизації.');
       return;
   }
   isLoadingEmail.value = true;
   console.log(`Відправляємо запит на ${SEND_VERIFICATION_URL}`);
   try {
       await axios.post(SEND_VERIFICATION_URL, {}, { 
           headers: { 'Authorization': `Bearer ${token.value}` }
       });
       toast.success('Лист з кодом підтвердження надіслано.');
       verificationCodeSent.value = true; 
   } catch (error) {
       console.error('Помилка відправки коду:', error);
       let errMsg = error.response?.data || 'Не вдалося надіслати код.';
       toast.error(`Помилка: ${errMsg}`);
   } finally {
       isLoadingEmail.value = false;
   }
}

async function verifyCode() {
    if (!verificationCode.value || verificationCode.value.length !== 6) {
        toast.warning('Будь ласка, введіть 6-значний код.');
        return;
    }
    if (!token.value) {
        toast.error('Помилка авторизації.');
        return;
    }
    isLoadingVerify.value = true;
    console.log(`Відправляємо код ${verificationCode.value} на ${VERIFY_EMAIL_URL}`);
    try {
        await axios.post(VERIFY_EMAIL_URL, 
          { code: verificationCode.value }, 
          { headers: { 'Authorization': `Bearer ${token.value}`, 'Content-Type': 'application/json' } }
        );
        toast.success('Email успішно підтверджено!');
        user.value.isVerified = true; 
        verificationCodeSent.value = false; 
        verificationCode.value = ''; 
    } catch (error) {
        console.error('Помилка перевірки коду:', error);
        let errMsg = 'Не вдалося підтвердити email.';
        if (error.response?.status === 400) {
            errMsg = error.response.data || 'Невірний або застарілий код.';
        } else if (error.response?.status === 401) {
            errMsg = 'Помилка авторизації.';
        } else {
           errMsg = error.response?.data || 'Помилка сервера.';
        }
        toast.error(`Помилка: ${errMsg}`);
    } finally {
        isLoadingVerify.value = false;
    }
}

async function saveProfile() {
  if (!user.value.firstName || !user.value.lastName) {
    toast.warning("Ім'я та прізвище обов'язкові.");
    return;
  }
  if (!user.value.phoneNumber) {
      toast.warning('Номер телефону обов\'язковий.');
      return;
  }
  
  const formData = new FormData();
  formData.append('firstName', user.value.firstName);
  formData.append('lastName', user.value.lastName);
  formData.append('phoneNumber', `+${user.value.phoneCode}${user.value.phoneNumber}`);
  if (user.value.birthday) {
      try {
          formData.append('dateOfBirth', new Date(user.value.birthday).toISOString()); 
      } catch (e) {
          toast.error("Невірний формат дати.");
          return; 
      }
  }
  formData.append('address', user.value.address || ""); 
  formData.append('country', user.value.country);
  formData.append('aboutYourself', user.value.bio || ""); 
  
  if (selectedFile.value) {
    formData.append('Photo', selectedFile.value); 
  } 

  console.log("Sending profile update (FormData):", Object.fromEntries(formData.entries())); 
  
  try {
    await axios.put(`${API_BASE_URL}/edit`, formData, { 
      headers: { 
        'Authorization': `Bearer ${token.value}`
      }
    });
    toast.success('Профіль оновлено!'); 
    selectedFile.value = null; 

    if (selectedFile.value) {
      toast.info('Оновіть сторінку, щоб побачити новий аватар.');
    }

  } catch (error) {
     console.error('Помилка збереження (Axios):', error);
     let errorMessage = 'Помилка збереження.';
     if (error.response) {
       if (error.response.data?.errors) {
           errorMessage = Object.values(error.response.data.errors).flat().join(' ');
       } else {
           errorMessage = error.response.data?.message || error.response.data?.title || 'Помилка сервера';
       }
     } 
     else if (error.request) { errorMessage = 'Немає відповіді від сервера.'; } 
     else { errorMessage = error.message; }
     toast.error(`Не вдалося зберегти: ${errorMessage}`);
  }
}

function filterPhoneInput(event) {
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

function onFileSelected(event) {
  const file = event.target.files[0];
  const currentInput = event.target; 
  if (!file) {
      selectedFile.value = null; 
      currentInput.value = ''; 
      return;
  }
  if (!file.type.startsWith('image/')) {
      toast.error('Оберіть файл зображення.');
      selectedFile.value = null; 
      user.value.avatarUrl = initialAvatarUrl.value || null; 
      currentInput.value = ''; 
      return;
  }
  selectedFile.value = file; 
  const reader = new FileReader();
  reader.onload = (e) => { user.value.avatarUrl = e.target.result; };
  reader.onerror = (error) => { /* ... обробка помилок читання ... */ };
  reader.readAsDataURL(file);
  console.log('Обрано файл:', file.name);
}

function triggerFileUpload() {
  fileInput.value.click(); 
}

async function changePassword() {
   if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword || passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
       toast.warning('Перевірте введені паролі.');
       return;
   }
   if (passwordForm.value.newPassword.length < 5 || passwordForm.value.newPassword.length > 27) {
     toast.warning('Пароль має містити від 5 до 27 символів.');
     return;
   }

 const CHANGE_PASSWORD_URL = `${API_BASE_URL}/ChangePassword`; 
 const payload = {
   Password: passwordForm.value.currentPassword,        
   NewPassword: passwordForm.value.newPassword,          
   PasswordConfirmation: passwordForm.value.confirmPassword 
 };

 console.log(`Sending password change to ${CHANGE_PASSWORD_URL}`, payload);

 try {
   await axios.post(CHANGE_PASSWORD_URL, payload, {
       headers: { 
         'Content-Type': 'application/json', 
         'Authorization': `Bearer ${token.value}` 
       }
   });
   
   toast.success('Пароль успішно змінено!');
   passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
   
 } catch (error) {
    console.error('Помилка зміни пароля (Axios):', error);
    let errorMessage = 'Помилка зміни пароля.';
     if (error.response) {
       if (error.response.status === 400 && typeof error.response.data === 'string') {
           if (error.response.data.includes("Old password is incorrect")) { errorMessage = 'Невірний поточний пароль.'; } 
           else if (error.response.data.includes("do not match")) { errorMessage = 'Новий пароль не співпадає.'; } 
           else { errorMessage = error.response.data; }
       } else { errorMessage = error.response.data?.message || 'Помилка сервера.'; }
     } else if (error.request) { errorMessage = 'Немає відповіді від сервера.'; } 
     else { errorMessage = error.message; }
     toast.error(`Не вдалося змінити пароль: ${errorMessage}`);
 }
}

function forgotPassword() {
    if (user.value.email) {
      router.push({ name: 'forgot-password', query: { email: user.value.email } }); 
      toast.info('Перенаправляємо на сторінку відновлення пароля...');
    } else {
      toast.warning('Не вдалося визначити ваш email. Введіть його вручну.');
      router.push({ name: 'forgot-password' }); 
    }
}

/**
 * 3. НОВА ФУНКЦІЯ для кнопки
 */
function goToCreateListing() {
  router.push('/create-listing');
}
</script>

<style scoped>
/* (Всі старі стилі: .profile-view, .profile-container, .profile-sidebar, 
   .form-group, .avatar-section, .verification-section, і т.д. - 
   залишаються БЕЗ ЗМІН) 
*/

.profile-view {
  background-image: url('@/assets/car-header1.jpg'); 
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  position: relative;
  padding-top: 100px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 40px;
  font-family: 'Open Sans', sans-serif;
  color: #fff; 
}
.profile-view::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 0;
}
.profile-view h1 { 
  max-width: 1200px;
  margin: 0 auto 30px auto;
  color: #fff;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
}
.profile-view h2 {
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
  color: #fff;
  font-weight: 500;
}
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr; 
  gap: 40px;
  position: relative;
  z-index: 1;
}
@media (min-width: 992px) {
  .profile-container {
    grid-template-columns: 1fr 3fr;
  }
  .profile-view h1 {
    padding-left: calc( ( (100% - 40px) / 4 ) + 40px );
  }
}
.profile-sidebar,
.profile-content {
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 30px;
  align-self: start;
}
.profile-sidebar {
  padding: 15px; 
}
.profile-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.profile-nav a {
  display: block;
  padding: 12px 15px;
  color: #fff;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}
.profile-nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.profile-nav a.active {
  background-color: rgba(255, 215, 0, 0.2); 
  color: #ffd700;
  font-weight: 600;
}
.avatar-upload-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}
.avatar-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  border: 3px solid #555;
  flex-shrink: 0;
}
.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.avatar-edit-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30px; 
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(100%);
  opacity: 0;
  transition: all 0.3s ease;
}
.avatar-edit-overlay svg {
  width: 16px;
  height: 16px;
}
.avatar-preview:hover .avatar-edit-overlay {
  transform: translateY(0);
  opacity: 1;
}
.avatar-info h3 {
  font-size: 20px;
  margin: 0;
}
.avatar-info p {
  font-size: 14px;
  color: #ccc;
  margin: 5px 0 0 0; 
}
.avatar-info .avatar-address {
  font-size: 13px; 
  color: #bbb;
  margin-top: 8px; 
}
.form-group {
  margin-bottom: 20px;
  position: relative;
}
.form-group label {
  width: 100%;
  display: block;
  font-size: 14px; 
  font-weight: 500;
  margin-bottom: 8px;
  color: #fff;
  text-align: left;
}
.form-group input,
.form-group textarea,
.form-group select {
  display: block;
  width: 100%;
  height: 45px;
  padding: 0 12px;
  border-radius: 3px;
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555;
  box-shadow: none;
  font-size: 14px;
  font-weight: 300;
  color: #fff;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  box-sizing: border-box;
}
.form-group textarea {
  height: auto;
  padding: 12px;
  min-height: 90px;
}
.form-group select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
  padding-right: 40px; 
  cursor: pointer;
}
.form-group select option {
  background: #333;
  color: #fff;
}
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  outline: none;
}
.form-group input:disabled {
  background-color: rgba(255, 255, 255, 0.05);
  color: #aaa;
  cursor: not-allowed;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
@media (min-width: 768px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}
.phone-group .input-group {
  display: flex;
  gap: 10px;
}
.phone-group .input-group select {
  width: 150px;
  flex-shrink: 0;
}
.phone-group .input-group input {
  width: 100%;
}
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
button {
  font-family: 'Open Sans', sans-serif;
  padding: 12px 20px; 
  border-radius: 6px; 
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}
.btn-primary {
  background-color: #cc0000;
  color: #fff;
}
.btn-primary:hover {
  background-color: #aa0000;
}
.btn-secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}
.btn-secondary:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.4);
}
.btn-secondary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.forgot-password-link {
  display: block;
  text-align: right;
  font-size: 13px;
  color: #ffd700;
  text-decoration: none;
  margin-top: 8px;
}
.forgot-password-link:hover {
  text-decoration: underline;
}
.password-section {
  margin-top: 0;
  padding-top: 0;
}
.email-verification-section {
  background-color: rgba(0, 0, 0, 0.2); 
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.verification-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 15px 0; 
}
.verification-status.warning {
  color: #ffd700; 
}
.verification-status.success {
  color: #28a745; 
  margin-bottom: 30px; 
}
.verification-status svg {
  flex-shrink: 0;
}
.info-text {
  font-size: 14px;
  color: #ccc;
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
}
.verification-code-input label {
  font-size: 13px;
  color: #ccc;
  margin-bottom: 8px;
  display: block;
  text-align: left;
}
.verification-code-input .input-group {
  display: flex;
  gap: 10px;
  align-items: center; 
}
.verification-code-input input {
  flex-grow: 1; 
  margin: 0; 
  text-align: center;
  letter-spacing: 0.2em;
  font-size: 16px;
  padding: 0 5px; 
}
.verification-code-input .btn-primary {
  flex-shrink: 0; 
  margin-top: 0; 
  padding: 10px 15px; 
  font-size: 14px;
}
.btn-link {
    background: none;
    border: none;
    color: #ccc;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-size: 13px;
    font-family: 'Open Sans', sans-serif;
}
.btn-link:hover:not(:disabled) {
  color: #fff;
}
.btn-link:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    text-decoration: none;
}
.resend-link {
  margin-top: 10px;
  display: inline-block;
}

/* * 4. НОВІ СТИЛІ ДЛЯ "ВИСТАВЛЕНІ ЗАМОВЛЕННЯ"
 */
.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* Копіюємо стилі з h2 */
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
}

/* Прибираємо подвійні рамки/відступи з h2, 
   оскільки вони тепер на .tab-header */
.tab-header h2 {
  margin-bottom: 0;
  border-bottom: none;
  padding-bottom: 0;
}

.add-listing-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 10px 15px; /* Трохи менша кнопка */
  margin-top: 0; /* Скидаємо відступ */
}
.add-listing-btn svg {
  width: 16px;
  height: 16px;
}
</style>