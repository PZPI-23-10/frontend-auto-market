<template>
  <div class="create-listing-view">
    <div class="form-container">
      <h1>Створити нове оголошення</h1>
      
      <form @submit.prevent="handleSubmit" novalidate>

        <section class="form-card">
          <h2>2. Основна інформація <small>* Поля обов'язкові для заповнення</small></h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="vehicleType">Тип транспорту *</label>
              <select id="vehicleType" v-model="listing.vehicleType" required>
                <option value="" disabled>Оберіть</option>
                <option v-for="vt in vehicleTypes" :key="vt" :value="vt">{{ vt }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="brand">Марка авто *</label>
              <input type="text" id="brand" v-model="listing.brand" required placeholder="Наприклад, Audi">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="model">Модель авто *</label>
              <input type="text" id="model" v-model="listing.model" required placeholder="Наприклад, A6">
            </div>
            <div class="form-group">
              <label for="year">Рік випуску *</label>
              <select id="year" v-model="listing.year" required>
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="mileage">Пробіг (тис. км) *</label>
              <input type="number" id="mileage" v-model.number="listing.mileage" required placeholder="тільки цифри">
            </div>
            <div class="form-group">
              <label for="bodyType">Тип кузова *</label>
              <select id="bodyType" v-model="listing.bodyType" required>
                <option value="" disabled>Оберіть</option>
                <option v-for="bt in bodyTypes" :key="bt" :value="bt">{{ bt }}</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="region">Регіон *</label>
              <select id="region" v-model="listing.region" required>
                <option value="" disabled>Оберіть</option>
                <option v-for="r in regions" :key="r" :value="r">{{ r }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="city">Місто *</label>
              <input type="text" id="city" v-model="listing.city" required placeholder="Наприклад, Київ">
            </div>
          </div>
        </section>

        <section class="form-card">
          <h2>Характеристики авто</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="fuel">Тип палива *</label>
              <select id="fuel" v-model="listing.fuel" required>
                <option value="" disabled>Оберіть тип</option>
                <option v-for="fuelType in fuelTypes" :key="fuelType" :value="fuelType">{{ fuelType }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="transmission">Коробка передач *</label>
              <select id="transmission" v-model="listing.transmission" required>
                <option value="" disabled>Оберіть тип</option>
                <option v-for="t in transmissionTypes" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="driveTrain">Привід *</label>
              <select id="driveTrain" v-model="listing.driveTrain" required>
                <option value="" disabled>Оберіть</option>
                <option v-for="dt in driveTrainTypes" :key="dt" :value="dt">{{ dt }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="engineSize">Об'єм двигуна (л) *</label>
              <input type="number" id="engineSize" v-model.number="listing.engineSize" required placeholder="Напр., 2.0 або 0 (для електро)">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="color">Колір *</label>
              <select id="color" v-model="listing.color" required>
                <option value="" disabled>Оберіть</option>
                <option v-for="c in colors" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="metallic" v-model="listing.metallic">
              <label for="metallic">Металік</label>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="paintwork">Лакофарбове покриття *</label>
              <select id="paintwork" v-model="listing.paintwork" required>
                 <option value="" disabled>Оберіть</option>
                 <option v-for="p in paintworkStates" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="technicalCondition">Технічний стан *</label>
              <select id="technicalCondition" v-model="listing.technicalCondition" required>
                 <option value="" disabled>Оберіть</option>
                 <option v-for="t in technicalStates" :key="t" :value="t">{{ t }}</option>
              </select>
            </div>
          </div>
          
          <div class="form-group checkbox-group single-checkbox">
              <input type="checkbox" id="inAccident" v-model="listing.inAccident">
              <label for="inAccident">Участь в ДТП</label>
          </div>
        </section>

        <section class="form-card">
          <h2>Комфорт та опції</h2>
          <div class="comfort-grid">
            
            <div class="form-group checkbox-group">
              <input type="checkbox" id="comfort_ac" v-model="listing.comfort.airConditioning">
              <label for="comfort_ac">Кондиціонер</label>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="comfort_climate" v-model="listing.comfort.climateControl">
              <label for="comfort_climate">Клімат-контроль</label>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="comfort_seats" v-model="listing.comfort.heatedSeats">
              <label for="comfort_seats">Підігрів сидінь</label>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="comfort_camera" v-model="listing.comfort.rearCamera">
              <label for="comfort_camera">Камера заднього виду</label>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="comfort_sensors" v-model="listing.comfort.parkingSensors">
              <label for="comfort_sensors">Парктроніки</label>
            </div>
            <div class="form-group checkbox-group">
              <input type="checkbox" id="comfort_sunroof" v-model="listing.comfort.sunroof">
              <label for="comfort_sunroof">Люк / Панорама</label>
            </div>
            
          </div>
        </section>

        <section class="form-card">
          <h2>Ціна</h2>
          <div class="form-group price-group">
            <label for="price">Ціна *</label>
            <div class="input-group">
              <input type="number" id="price" v-model.number="listing.price" required placeholder="0">
              <select id="currency" v-model="listing.currency">
                <option value="USD">USD</option>
                <option value="UAH">UAH</option>
              </select>
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
            :maxFiles="10" 
            @files-updated="updateFiles" 
          />
        </section>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="goBack" :disabled="isSubmitting">
            Назад
          </button>
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
import { ref, computed, watch, onMounted } from 'vue'; 
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import PhotoUploader from '@/components/PhotoUploader.vue'; 

// --- СЛОВНИК ДЛЯ ВАЛІДАЦІЇ (ОНОВЛЕНО) ---
const fieldNames = {
  vehicleType: 'Тип транспорту',
  brand: 'Бренд',
  model: 'Модель',
  bodyType: 'Тип кузова',
  region: 'Регіон',
  city: 'Місто',
  fuel: 'Тип палива',
  transmission: 'Коробка передач',
  driveTrain: 'Привід',
  engineSize: "Об'єм двигуна",
  color: 'Колір',
  technicalCondition: 'Технічний стан',
  paintwork: 'Лакофарбове покриття',
  mileage: 'Пробіг',
  price: 'Ціна'
};

// --- Ініціалізація ---
const router = useRouter();
const toast = useToast();
const isSubmitting = ref(false);
const DRAFT_STORAGE_KEY = 'newListingDraft';

// --- ДАНІ ФОРМИ (ОНОВЛЕНО) ---
const listing = ref({
  vehicleType: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  mileage: '',
  bodyType: '',
  region: '',
  city: '',
  
  fuel: '',
  transmission: '',
  driveTrain: '',     // <--- ДОДАНО
  engineSize: '',     // <--- ДОДАНО
  color: '',
  metallic: false,
  inAccident: false,
  paintwork: '',
  technicalCondition: '',

  price: '',
  currency: 'USD', 
  
  description: '',

  // <--- ДОДАНО
  comfort: {
    airConditioning: false,
    climateControl: false,
    heatedSeats: false,
    rearCamera: false,
    parkingSensors: false,
    sunroof: false
  }
});
const listingPhotos = ref([]);

// --- ОПЦІЇ ДЛЯ SELECT'ІВ (ОНОВЛЕНО) ---
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

const vehicleTypes = ref(['Легковий', 'Вантажний', 'Мото']);
const bodyTypes = ref(['Седан', 'Хетчбек', 'Універсал', 'Купе', 'Кабріолет', 'Кросовер', 'Позашляховик', 'Пікап', 'Мінівен']);
const regions = ref(['Київська обл.', 'Львівська обл.', 'Одеська обл.', 'Харківська обл.', 'Дніпропетровська обл.', 'Інший']);
const colors = ref(['Чорний', 'Білий', 'Синій', 'Червоний', 'Сірий', 'Зелений', 'Інший']);
const technicalStates = ref(['Повністю справне', 'На ходу, потребує ремонту', 'Не на ходу', 'Після ДТП']);
const paintworkStates = ref(['Як нове', 'Є незначні подряпини', 'Є сліди використання', 'Потребує ремонту']);
const driveTrainTypes = ref(['Передній', 'Задній', 'Повний']); // <--- ДОДАНО

// --- Автозбереження/Автозавантаження (без змін) ---
watch(listing, (newData) => {
  console.log('Зберігаємо чернетку...');
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(newData));
}, { deep: true });

onMounted(() => {
  const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (savedDraft) {
    try {
      // Обережно завантажуємо, щоб не перезаписати 'comfort'
      const parsedDraft = JSON.parse(savedDraft);
      Object.assign(listing.value, parsedDraft);
    } catch (e) {
      console.error('Не вдалося відновити чернетку:', e);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }
});

// ---
// ЛОГІКА ДЛЯ КОМПОНЕНТА
// ---
function updateFiles(files) {
  listingPhotos.value = files;
}

function goBack() {
  router.back();
}


/**
 * (MOCK) Функція відправки форми (ОНОВЛЕНО ВАЛІДАЦІЮ)
 */
function handleSubmit() {
  if (isSubmitting.value) return;
  
  // 1. ВАЛІДАЦІЯ
  const requiredFields = [
    'vehicleType', 'brand', 'model', 'bodyType', 'region', 'city',
    'fuel', 'transmission', 'driveTrain', 'color', 
    'technicalCondition', 'paintwork'
  ];
  
  for (const field of requiredFields) {
    if (!listing.value[field]) {
      toast.warning(`Будь ласка, заповніть поле "${fieldNames[field]}"`);
      return; 
    }
  }
  
  // Перевіряємо числові поля
  if (listing.value.mileage === '' || listing.value.mileage < 0) {
    toast.warning(`Будь ласка, введіть коректний "${fieldNames.mileage}"`);
    return;
  }
  if (listing.value.engineSize === '' || listing.value.engineSize < 0) {
    toast.warning(`Будь ласка, введіть коректний "${fieldNames.engineSize}"`);
    return;
  }
  if (!listing.value.price || listing.value.price <= 0) {
    toast.warning(`Будь ласка, введіть коректну "${fieldNames.price}"`);
    return;
  }
  if (listingPhotos.value.length === 0) {
    toast.warning('Будь ласка, додайте хоча б одне фото.');
    return;
  }
  
  isSubmitting.value = true;
  
  console.log('--- ДАНІ ДЛЯ ВІДПРАВКИ ---');
  console.log('Дані:', listing.value);
  console.log('Файли:', listingPhotos.value);
  
  setTimeout(() => {
    isSubmitting.value = false;
    toast.success('Оголошення успішно опубліковано!');
    
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    
    router.push('/my-listings'); // TODO: Змінити на /profile
    
  }, 2000);
}
</script>

<style scoped>
/* (Фон, контейнер, картки, поля - без змін) */
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
.form-card h2 small {
  font-size: 13px;
  color: #ccc;
  font-weight: 400;
  margin-left: 10px;
}

/* (Поля, селекти, кнопки - без змін) */
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
.price-group .input-group {
  display: flex;
  gap: 10px; 
}
.price-group .input-group input {
  width: 100%;
}
.price-group .input-group select {
  width: 100px;
  flex-shrink: 0;
}

/* ---
 * ОНОВЛЕНІ СТИЛІ ДЛЯ ЧЕКБОКСІВ
 --- */
.checkbox-group {
  display: flex;
  align-items: center;
  /* (Скидаємо відступ, якщо він не в .form-row) */
  padding-top: 0; 
}
.form-row .checkbox-group {
  padding-top: 30px; /* Вирівнюємо по вертикалі з <select> */
}
.checkbox-group.single-checkbox {
  padding-top: 0; /* Для "Участь в ДТП" */
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  flex-shrink: 0;
  cursor: pointer;
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555;
  border-radius: 3px;
  appearance: none;
  -webkit-appearance: none;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s;
}
.checkbox-group input[type="checkbox"]:checked {
  background-color: #ffd700;
  border-color: #ffd700;
}
.checkbox-group input[type="checkbox"]:checked::after {
  content: '✔';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 12px;
  font-weight: bold;
}
.checkbox-group label {
  margin-bottom: 0;
  font-weight: 300;
  text-align: left;
  cursor: pointer;
}

/* --- НОВА СІТКА ДЛЯ КОМФОРТУ --- */
.comfort-grid {
  display: grid;
  grid-template-columns: 1fr; /* 1 колонка на мобілках */
  gap: 10px;
}
@media (min-width: 576px) {
  .comfort-grid {
    grid-template-columns: 1fr 1fr; /* 2 колонки */
  }
}
@media (min-width: 768px) {
  .comfort-grid {
    grid-template-columns: 1fr 1fr 1fr; /* 3 колонки */
  }
}
/* У сітці 'comfort-grid' нам не потрібні відступи зверху */
.comfort-grid .checkbox-group {
  padding-top: 0;
}

/* (Кнопки та Оверлей - без змін) */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}
.btn-submit {
  font-family: 'Open Sans', sans-serif;
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
  flex: 2;
}
.btn-submit:hover {
  background-color: #aa0000;
}
.btn-submit:disabled {
  background-color: #555;
  cursor: not-allowed;
}
.btn-secondary {
  font-family: 'Open Sans', sans-serif;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  background-color: rgba(255,255,255,0.27); 
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
  flex: 1;
}
.btn-secondary:hover {
  background-color: rgba(255,255,255,0.4);
}
.btn-secondary:disabled {
  background-color: #555;
  color: #999;
  cursor: not-allowed;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
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
.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #555;
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>