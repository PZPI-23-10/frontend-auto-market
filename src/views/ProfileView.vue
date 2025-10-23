<template>
  <div class="profile-view">
    <h1>Налаштування</h1> <div class="profile-container">
      
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
                <input type="tel" id="phoneNumber" v-model="user.phoneNumber" placeholder="99 123 4567">
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
                <input type="date" id="birthday" v-model="user.birthday" disabled>
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
          <h2>Виставлені замовлення</h2>
          <p>Тут буде список ваших виставлених на продаж автомобілів або замовлень.</p>
          </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import defaultAvatar from '@/assets/default-avatar.png';

// --- Дані для Select'ів ---
const countries = ref([
  { code: 'UA', name: 'Україна', phoneCode: '380' },
  { code: 'PL', name: 'Польща', phoneCode: '48' },
  { code: 'DE', name: 'Німеччина', phoneCode: '49' },
  { code: 'US', name: 'США', phoneCode: '1' },
  { code: 'GB', name: 'Велика Британія', phoneCode: '44' },
]);

// --- Стан компонента ---
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
  avatarUrl: null
});
const activeTab = ref('profile');
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const fileInput = ref(null);

// --- Computed (Обчислювані властивості) ---
const fullName = computed(() => {
  if (!user.value.firstName && !user.value.lastName) {
    return 'Ім\'я Прізвище';
  }
  return `${user.value.firstName} ${user.value.lastName}`;
});

// --- Хук життєвого циклу ---
onMounted(() => {
  // Мок-дані для демонстрації
  user.value = {
    firstName: 'Олександр',
    lastName: 'Іваненко',
    email: 'user@example.com',
    phoneCode: '380',
    phoneNumber: '991234567',
    country: 'UA',
    address: 'м. Київ, вул. Хрещатик, 1',
    birthday: '1990-05-15',
    bio: 'Розробник програмного забезпечення з Києва.',
    avatarUrl: null 
  };
});

// --- Методи ---
function saveProfile() {
  console.log('Збереження профілю...', user.value);
  alert('Профіль оновлено!');
}

function changePassword() {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Нові паролі не співпадають!');
    return;
  }
  console.log('Зміна пароля...', passwordForm.value);
  alert('Пароль успішно змінено!');
  passwordForm.value = {
    currentPassword: '', newPassword: '', confirmPassword: ''
  };
}

/**
 * НОВА ФУНКЦІЯ
 * Обробник для "Забули пароль?"
 */
function forgotPassword() {
  // TODO: Тут буде логіка для відновлення пароля
  // (наприклад, перехід на сторінку /forgot-password 
  // або показ модального вікна)
  
  alert('Зараз відбудеться перехід на сторінку відновлення пароля (поки не реалізовано).');
  // router.push('/forgot-password'); // Якщо у вас є такий роут
}

// --- Методи для Аватара ---
function triggerFileUpload() {
  fileInput.value.click();
}

function onFileSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    user.value.avatarUrl = e.target.result;
  };
  reader.readAsDataURL(file);

  console.log('Обрано файл:', file.name);
}
</script>

<style scoped>
/* === ЗАГАЛЬНИЙ ФОН === */
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

/* === ЗАГОЛОВКИ === */
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

/* === ОСНОВНИЙ КОНТЕЙНЕР === */
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

/* === 3. "СКЛЯНІ" КАРТКИ === */
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

/* === 4. НОВА НАВІГАЦІЯ (ЛІВА КОЛОНКА) === */
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

/* === 5. КОНТЕНТ (ПРАВА КОЛОНКА) === */

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
  margin: 5px 0 0 0; /* Прибираємо зайвий нижній відступ */
}

/* Новий стиль для адреси */
.avatar-info .avatar-address {
  font-size: 13px; 
  color: #bbb;
  margin-top: 8px; 
}


/* === 6. ФОРМИ (стилі з минулого разу) === */
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
</style>