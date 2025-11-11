<template>
  <div class="create-listing-view">
    <div class="form-container">
      <h1>Створити нове оголошення</h1>
      
        <form @submit.prevent="handleSubmit" novalidate>

        <section class="form-card">
          <h2>Основна інформація</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="brand">Бренд</label>
              <input type="text" id="brand" v-model="listing.brand" required>
            </div>
            <div class="form-group">
              <label for="model">Модель</label>
              <input type="text" id="model" v-model="listing.model" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="year">Рік</label>
              <select id="year" v-model="listing.year" required>
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="mileage">Пробіг (тис. км)</label>
              <input type="number" id="mileage" v-model.number="listing.mileage" required>
            </div>
          </div>
          <div class="form-group">
            <label for="fuel">Тип палива</label>
            <select id="fuel" v-model="listing.fuel" required>
              <option value="" disabled>Оберіть тип</option>
              <option v-for="fuelType in fuelTypes" :key="fuelType" :value="fuelType">
                {{ fuelType }}
              </option>
          </select>
        </div>

        <div class="form-group">
          <label for="transmission">Коробка передач</label>
          <select id="transmission" v-model="listing.transmission" required>
            <option value="" disabled>Оберіть тип</option>
            <option v-for="t in transmissionTypes" :key="t" :value="t">
              {{ t }}
            </option>
          </select>
        </div>
        </section>
        
        <section class="form-card">
          <h2>Ціна та Розташування</h2>
          <div class="form-row">
            
            <div class="form-group price-group">
              <label for="price">Ціна</label>
              <div class="input-group">
                <input type="number" id="price" v-model.number="listing.price" required>
                <select id="currency" v-model="listing.currency">
                  <option value="USD">USD</option>
                  <option value="UAH">UAH</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="location">Місто</label>
              <input type="text" id="location" v-model="listing.location" required>
            </div>
          </div>
        </section>

        <section class="form-card">
          <h2>Опис</h2>
          <div class="form-group">
            <label for="description">Розкажіть про авто детальніше</label>
            <textarea id="description" v-model="listing.description" rows="6"></textarea>
          </div>
        </section>

        <section class="form-card">
          <h2>Фотографії</h2>
          <PhotoUploader 
            :maxFiles="5" 
            @files-updated="updateFiles" 
          />
        </section>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Публікуємо...' : 'Опублікувати оголошення' }}
          </button>
        </div>
      </form>
    </div>
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="spinner"></div>
      <h2>Публікація...</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
// Імпортуємо наш новий компонент
import PhotoUploader from '@/components/PhotoUploader.vue'; 

const fieldNames = {
  brand: 'Бренд',
  model: 'Модель',
  fuel: 'Тип палива',
  transmission: 'Коробка передач',
  location: 'Місто',
  mileage: 'Пробіг',
  price: 'Ціна'
};

// --- Ініціалізація ---
const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);

// --- Дані форми ---
const listing = ref({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  mileage: '',
  fuel: '',
  transmission: '',
  price: '',
  currency: 'USD', 
  location: '',
  description: ''
});

const listingPhotos = ref([]); // Тут ми зберігаємо файли, які прийшли з PhotoUploader

// --- Опції для Select'ів ---
const fuelTypes = ref(['Бензин', 'Дизель', 'Електро', 'Гібрид', 'Газ/Бензин']);
const transmissionTypes = ref(['Механіка', 'Автомат', 'Робот']);
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1970;
  let yearList = [];
  for (let i = currentYear; i >= startYear; i--) {
    yearList.push(i);
  }
  return yearList;
});

// ---
// ЛОГІКА ДЛЯ КОМПОНЕНТА
// ---
function updateFiles(files) {

  listingPhotos.value = files;
}

/**
 * (MOCK) Тимчасова функція відправки форми
 */
function handleSubmit() {
  // 1. Перевіряємо, чи вже йде відправка
  if (isSubmitting.value) return;
  
  // ---
  // 2. БЛОК ВАЛІДАЦІЇ (ДО ВІДПРАВКИ)
  // ---
  
// Перевіряємо текстові поля
  const requiredText = ['brand', 'model', 'fuel', 'location', 'transmission']; 
  for (const field of requiredText) {
    if (!listing.value[field]) {
      // Використовуємо словник для гарного повідомлення (виправлення №3)
      toast.warning(`Будь ласка, заповніть поле "${fieldNames[field]}"`);
      return; // Зупиняємо відправку (isSubmitting = false)
    }
  }
  
  // Перевіряємо числові поля
  if (!listing.value.mileage || listing.value.mileage <= 0) {
    toast.warning(`Будь ласка, введіть коректний "${fieldNames.mileage}"`);
    return;
  }
  if (!listing.value.price || listing.value.price <= 0) {
    toast.warning(`Будь ласка, введіть коректну "${fieldNames.price}"`);
    return;
  }

  // Перевіряємо фото (виправлення №1: тепер ця перевірка в кінці)
  if (listingPhotos.value.length === 0) {
    toast.warning('Будь ласка, додайте хоча б одне фото.');
    return;
  }
  
  // ---
  // 3. ВАЛІДАЦІЯ ПРОЙШЛА УСПІШНО
  // ---
  
  // ТІЛЬКИ ТЕПЕР вмикаємо стан "Публікуємо..." (виправлення №2)
  isSubmitting.value = true;

  // 4. Симуляція завантаження
  // toast.info('Публікуємо оголошення (симуляція)...');
  
  console.log('--- ДАНІ ДЛЯ ВІДПРАВКИ ---');
  console.log('Дані:', listing.value);
  console.log('Файли:', listingPhotos.value);
  
  // 5. Симулюємо відповідь сервера через 2 секунди
  setTimeout(() => {
    isSubmitting.value = false;
    toast.success('Оголошення успішно опубліковано!');
    
    // 6. Редірект
    router.push('/my-listings'); 
    
  }, 2000);
}
</script>

<style scoped>
/* --- 1. Фон (як у ProfileView) --- */
.create-listing-view {
  background-image: url('@/assets/car-header1.jpg'); 
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  position: relative;
  padding: 100px 20px 40px 20px;
  font-family: 'Open Sans', sans-serif;
  color: #fff;
}
.create-listing-view::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 0;
}

.price-group .input-group {
  display: flex;
  gap: 10px; 
}

/* Поле ціни займає весь доступний простір */
.price-group .input-group input {
  width: 100%;
}

/* Селект валюти має фіксовану ширину */
.price-group .input-group select {
  width: 100px;
  flex-shrink: 0; /* Не стискатися */
}

/* --- 2. Контейнер форми --- */
.form-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.form-container h1 {
  margin-bottom: 30px;
  text-align: center;
}

/* --- 3. Скляна картка (як у ProfileView) --- */
.form-card {
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 30px;
  margin-bottom: 25px;
}
.form-card h2 {
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
  font-weight: 500;
}

/* --- 4. Поля форми (як у RegisterView) --- */
.form-group {
  margin-bottom: 20px;
  position: relative;
  flex: 1;
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
  font-size: 14px;
  font-weight: 300;
  color: #fff;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  box-sizing: border-box;
}
.form-group textarea {
  height: auto;
  padding: 12px;
  min-height: 120px;
  resize: none;
}
.form-group select {
  appearance: none;
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
.form-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 768px) {
  .form-row {
    flex-direction: row;
  }
}

/* --- 5. Кнопка відправки (як у LoginView) --- */
.form-actions {
  display: flex;
  justify-content: flex-end;
}
.btn-submit {
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  max-width: 360px;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  background-color: #cc0000;
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
}
.btn-submit:hover {
  background-color: #aa0000;
}
.btn-submit:disabled {
  background-color: #555;
  cursor: not-allowed;
}

/* СТИЛІ ДЛЯ ФОТО ТЕПЕР ВІДСУТНІ
  (Вони живуть у src/components/PhotoUploader.vue)
*/

.loading-overlay {
  position: fixed; /* Перекриває весь екран */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85); /* Сильніше затемнення */
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
  font-family: 'Open Sans', sans-serif;
}

.loading-overlay h2 {
  margin-top: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Простий CSS-спіннер */
.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #555; /* Сірий фон */
  border-top-color: #ffd700; /* Ваш акцентний жовтий */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>