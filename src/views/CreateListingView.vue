<template>
  <div class="create-listing-view">
    <div class="form-container">
      <h1>{{ t('createListing.title') }}</h1>
      
            <div class="progressbar-wrapper">
        <ul class="progressbar">
          <li v-for="(step, index) in steps" :key="index" :class="{ active: currentStep >= (index + 1) }">
            <span>{{ t(step.titleKey) }}</span>
          </li>
        </ul>
      </div>

      <form @submit.prevent="handleSubmit" novalidate>
        
        <div class="step-content">
          <Transition name="fade-slide" mode="out-in">
            
            <section class="form-card" v-if="currentStep === 1">
              <h2>{{ t('createListing.step1.title') }} <small>* {{ t('createListing.required') }}</small></h2>
              
                            <div class="form-row">
                <div class="form-group">
                  <label for="vehicleType">{{ t('createListing.step1.vehicleType') }} *</label>
                  <select id="vehicleType" v-model="listing.vehicleType" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="vt in vehicleTypes" :key="vt" :value="t(vt)">{{ t(vt) }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="brand">{{ t('createListing.step1.brand') }} *</label>
                  <input type="text" id="brand" v-model.trim="listing.brand" required :placeholder="t('createListing.step1.brandPlaceholder')">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="model">{{ t('createListing.step1.model') }} *</label>
                  <input type="text" id="model" v-model.trim="listing.model" required :placeholder="t('createListing.step1.modelPlaceholder')">
                </div>
                <div class="form-group">
                  <label for="year">{{ t('createListing.step1.year') }} *</label>
                  <select id="year" v-model="listing.year" required>
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="mileage">{{ t('createListing.step1.mileage') }} *</label>
                  <input type="number" id="mileage" v-model.number="listing.mileage" required :placeholder="t('createListing.step1.mileagePlaceholder')">
                </div>
                <div class="form-group">
                  <label for="bodyType">{{ t('createListing.step1.bodyType') }} *</label>
                  <select id="bodyType" v-model="listing.bodyType" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="bt in bodyTypes" :key="bt" :value="t(bt)">{{ t(bt) }}</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="region">{{ t('createListing.step1.region') }} *</label>
                  <select id="region" v-model="listing.region" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="r in regions" :key="r" :value="t(r)">{{ t(r) }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="city">{{ t('createListing.step1.city') }} *</label>
                  <input type="text" id="city" v-model.trim="listing.city" required :placeholder="t('createListing.step1.cityPlaceholder')">
                </div>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 2">
              <h2>{{ t('createListing.step2.title') }} <small>* {{ t('createListing.required') }}</small></h2>
              
                            <div class="form-row">
                <div class="form-group">
                  <label for="fuel">{{ t('createListing.step2.fuel') }} *</label>
                  <select id="fuel" v-model="listing.fuel" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="fuelType in fuelTypes" :key="fuelType" :value="t(fuelType)">{{ t(fuelType) }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="transmission">{{ t('createListing.step2.transmission') }} *</label>
                  <select id="transmission" v-model="listing.transmission" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="t in transmissionTypes" :key="t" :value="t(t)">{{ t(t) }}</option>
                  </select>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="driveTrain">{{ t('createListing.step2.driveTrain') }} *</label>
                  <select id="driveTrain" v-model="listing.driveTrain" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="dt in driveTrainTypes" :key="dt" :value="t(dt)">{{ t(dt) }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="engineSize">{{ t('createListing.step2.engineSize') }} *</label>
                  <input type="number" id="engineSize" v-model.number="listing.engineSize" required :placeholder="t('createListing.step2.engineSizePlaceholder')">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="color">{{ t('createListing.step2.color') }} *</label>
                  <select id="color" v-model="listing.color" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="c in colors" :key="c" :value="t(c)">{{ t(c) }}</option>
                  </select>
                </div>
                <div class="form-group checkbox-group">
                  <input type="checkbox" id="metallic" v-model="listing.metallic">
                  <label for="metallic">{{ t('createListing.step2.metallic') }}</label>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label for="paintwork">{{ t('createListing.step2.paintwork') }} *</label>
                  <select id="paintwork" v-model="listing.paintwork" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="p in paintworkStates" :key="p" :value="t(p)">{{ t(p) }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="technicalCondition">{{ t('createListing.step2.technicalCondition') }} *</label>
                  <select id="technicalCondition" v-model="listing.technicalCondition" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="t in technicalStates" :key="t" :value="t(t)">{{ t(t) }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group checkbox-group single-checkbox">
                  <input type="checkbox" id="inAccident" v-model="listing.inAccident">
                  <label for="inAccident">{{ t('createListing.step2.inAccident') }}</label>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 3">
              <h2>{{ t('createListing.step3.title') }}</h2>
              
              <div class="comfort-grid">
                <div class="form-group checkbox-group">
                  <input type="checkbox" id="comfort_ac" v-model="listing.comfort.airConditioning">
                  <label for="comfort_ac">{{ t('createListing.step3.ac') }}</label>
                </div>
                <div class="form-group checkbox-group">
                  <input type="checkbox" id="comfort_climate" v-model="listing.comfort.climateControl">
                  <label for="comfort_climate">{{ t('createListing.step3.climate') }}</label>
                </div>
                <div class="form-group checkbox-group">
                  <input type="checkbox" id="comfort_seats" v-model="listing.comfort.heatedSeats">
                  <label for="comfort_seats">{{ t('createListing.step3.heatedSeats') }}</label>
                </div>
                <div class="form-group checkbox-group">
                  <input type="checkbox" id="comfort_camera" v-model="listing.comfort.rearCamera">
                  <label for="comfort_camera">{{ t('createListing.step3.rearCamera') }}</label>
                </div>
                <div class="form-group checkbox-group">
                  <input type="checkbox" id="comfort_sensors" v-model="listing.comfort.parkingSensors">
                  <label for="comfort_sensors">{{ t('createListing.step3.parkingSensors') }}</label>
                </div>
                <div class="form-group checkbox-group">
                  <input type="checkbox" id="comfort_sunroof" v-model="listing.comfort.sunroof">
                  <label for="comfort_sunroof">{{ t('createListing.step3.sunroof') }}</label>
                </div>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 4">
              <h2>{{ t('createListing.step4.title') }} <small>* {{ t('createListing.required') }}</small></h2>
              
              <div class="form-group price-group">
                <label for="price">{{ t('createListing.step4.price') }} *</label>
                <div class="input-group">
                  <input type="number" id="price" v-model.number="listing.price" required placeholder="0">
                  <select id="currency" v-model="listing.currency">
                    <option value="USD">USD</option>
                    <option value="UAH">UAH</option>
                  </select>
                </div>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 5">
              <h2>{{ t('createListing.step5.title') }}</h2>
              
              <div class="form-group">
                <label for="description">{{ t('createListing.step5.label') }}</label>
                <textarea id="description" v-model="listing.description" rows="6"></textarea>
              </div>
            </section>
            
                        <section class="form-card" v-else-if="currentStep === 6">
              <h2>{{ t('createListing.step6.title') }} <small>* {{ t('createListing.required') }}</small></h2>
              
              <PhotoUploader 
                :maxFiles="10" 
                @files-updated="updateFiles" 
              />
            </section>

          </Transition>
        </div>

                <div class="form-actions">
          <button 
            type="button" 
            class="btn-secondary" 
            @click="prevStep" 
            :disabled="isSubmitting"
            v-if="currentStep > 1"
          >
            {{ t('createListing.buttons.back') }}
          </button>
          
          <button 
            type="button" 
            class="btn-submit" 
            @click="nextStep" 
            :disabled="isSubmitting"
            v-if="currentStep < steps.length"
          >
            {{ t('createListing.buttons.next') }}
          </button>

          <button 
            type="submit" 
            class="btn-submit" 
            :disabled="isSubmitting"
            v-if="currentStep === steps.length"
          >
            {{ isSubmitting ? t('createListing.buttons.submitting') : t('createListing.buttons.submit') }}
          </button>
        </div>

      </form>
    </div>
    
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="spinner"></div>
      <h2>{{ t('createListing.buttons.submitting') }}</h2>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'; 
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n'; // 1. ІМПОРТ I18N
import PhotoUploader from '@/components/PhotoUploader.vue'; 

// --- Ініціалізація ---
const router = useRouter();
const toast = useToast();
const { t } = useI18n(); // 2. ОТРИМАННЯ t
const isSubmitting = ref(false);
const DRAFT_STORAGE_KEY = 'newListingDraft';

// =================================
// 3. НОВИЙ СТАН ДЛЯ КРОКІВ
// =================================
const currentStep = ref(1);
const steps = ref([
  { titleKey: 'createListing.steps.basic' },
  { titleKey: 'createListing.steps.specs' },
  { titleKey: 'createListing.steps.comfort' },
  { titleKey: 'createListing.steps.price' },
  { titleKey: 'createListing.steps.description' },
  { titleKey: 'createListing.steps.photos' }
]);

// --- СЛОВНИК ДЛЯ ВАЛІДАЦІЇ ---
// (Ми будемо використовувати ключі i18n замість жорсткого кодування)
const fieldNameKeys = {
  vehicleType: 'createListing.step1.vehicleType',
  brand: 'createListing.step1.brand',
  model: 'createListing.step1.model',
  bodyType: 'createListing.step1.bodyType',
  region: 'createListing.step1.region',
  city: 'createListing.step1.city',
  mileage: 'createListing.step1.mileage',
  fuel: 'createListing.step2.fuel',
  transmission: 'createListing.step2.transmission',
  driveTrain: 'createListing.step2.driveTrain',
  engineSize: 'createListing.step2.engineSize',
  color: 'createListing.step2.color',
  technicalCondition: 'createListing.step2.technicalCondition',
  paintwork: 'createListing.step2.paintwork',
  price: 'createListing.step4.price',
  photos: 'createListing.step6.title'
};

// --- ДАНІ ФОРМИ (без змін) ---
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
  driveTrain: '',
  engineSize: '',
  color: '',
  metallic: false,
  inAccident: false,
  paintwork: '',
  technicalCondition: '',
  price: '',
  currency: 'USD', 
  description: '',
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

// --- ОПЦІЇ ДЛЯ SELECT'ІВ (Використовуємо ключі i18n) ---
const fuelTypes = ref(['options.fuel.petrol', 'options.fuel.diesel', 'options.fuel.electric', 'options.fuel.hybrid', 'options.fuel.lpg']);
const transmissionTypes = ref(['options.transmission.manual', 'options.transmission.automatic', 'options.transmission.robot']);
const vehicleTypes = ref(['options.vehicleType.car', 'options.vehicleType.truck', 'options.vehicleType.moto']);
const bodyTypes = ref(['options.bodyType.sedan', 'options.bodyType.hatchback', 'options.bodyType.wagon', 'options.bodyType.coupe', 'options.bodyType.cabriolet', 'options.bodyType.suv', 'options.bodyType.offroad', 'options.bodyType.pickup', 'options.bodyType.minivan']);
const regions = ref(['options.region.kyiv', 'options.region.lviv', 'options.region.odesa', 'options.region.kharkiv', 'options.region.dnipro', 'options.region.other']);
const colors = ref(['options.color.black', 'options.color.white', 'options.color.blue', 'options.color.red', 'options.color.gray', 'options.color.green', 'options.color.other']);
const technicalStates = ref(['options.techState.full', 'options.techState.needsRepair', 'options.techState.notMoving', 'options.techState.afterAccident']);
const paintworkStates = ref(['options.paint.asNew', 'options.paint.minorScratches', 'options.paint.used', 'options.paint.needsRepair']);
const driveTrainTypes = ref(['options.driveTrain.fwd', 'options.driveTrain.rwd', 'options.driveTrain.awd']);

// --- РОКИ (без змін) ---
const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1970;
  let yearList = [];
  for (let i = currentYear; i >= startYear; i--) {
    yearList.push(i);
  }
  return yearList;
});

// --- Автозбереження/Автозавантаження (без змін) ---
watch(listing, (newData) => {
  console.log('Зберігаємо чернетку...');
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(newData));
}, { deep: true });

onMounted(() => {
  const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (savedDraft) {
    try {
      const parsedDraft = JSON.parse(savedDraft);
      Object.assign(listing.value, parsedDraft);
    } catch (e) {
      console.error('Не вдалося відновити чернетку:', e);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }
});

// ---
// 4. ОНОВЛЕНА ЛОГІКА НАВІГАЦІЇ ТА ВАЛІДАЦІЇ
// ---

function updateFiles(files) {
  listingPhotos.value = files;
}

function goBack() {
  router.back();
}

/**
 * Функція валідації, що викликається перед переходом
 */
function validateCurrentStep() {
  const step = currentStep.value;
  
  // Функція-хелпер для перевірки полів
  const checkFields = (fields) => {
    for (const field of fields) {
      if (!listing.value[field]) {
        const fieldName = t(fieldNameKeys[field]); // Перекладаємо назву поля
        toast.warning(t('createListing.toast.fillField', { field: fieldName }));
        return false;
      }
    }
    return true;
  };

  // Функція-хелпер для числових полів
  const checkNumberField = (field, min = 0, allowZero = false) => {
    const value = listing.value[field];
    const fieldName = t(fieldNameKeys[field]);
    if (value === '' || value === null || (!allowZero && value <= min)) {
      toast.warning(t('createListing.toast.correctField', { field: fieldName }));
      return false;
    }
    return true;
  };

  switch (step) {
    case 1: // Крок 1: Основна інформація
      const step1Fields = ['vehicleType', 'brand', 'model', 'bodyType', 'region', 'city'];
      if (!checkFields(step1Fields)) return false;
      if (!checkNumberField('mileage', 0, true)) return false; // Дозволяємо 0 пробігу
      return true;

    case 2: // Крок 2: Характеристики
      const step2Fields = ['fuel', 'transmission', 'driveTrain', 'color', 'technicalCondition', 'paintwork'];
      if (!checkFields(step2Fields)) return false;
      if (!checkNumberField('engineSize', 0, true)) return false; // 0 для електро
      return true;

    case 3: // Крок 3: Комфорт (опціонально)
      return true;

    case 4: // Крок 4: Ціна
      if (!checkNumberField('price')) return false;
      return true;

    case 5: // Крок 5: Опис (опціонально)
      return true;
      
    case 6: // Крок 6: Фото (перевіряється при handleSubmit)
      if (listingPhotos.value.length === 0) {
        toast.warning(t('createListing.toast.addPhoto'));
        return false;
      }
      return true;
  }
  return false; // За замовчуванням
}

/**
 * Кнопка "Назад"
 */
function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

/**
 * Кнопка "Далі"
 */
function nextStep() {
  if (validateCurrentStep()) {
    currentStep.value++;
    window.scrollTo(0, 0); // Прокрутка вгору при зміні кроку
  }
}

/**
 * (MOCK) Функція відправки форми
 */
function handleSubmit() {
  if (isSubmitting.value) return;

  // Фінальна валідація (крок 6)
  if (!validateCurrentStep()) {
    return;
  }
  
  isSubmitting.value = true;
  
  console.log('--- ДАНІ ДЛЯ ВІДПРАВКИ ---');
  console.log('Дані:', listing.value);
  console.log('Файли:', listingPhotos.value);
  
  // MOCK API CALL
  setTimeout(() => {
    isSubmitting.value = false;
    toast.success(t('createListing.toast.submitSuccess'));
    
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    
    router.push('/profile'); // Перехід у профіль
    
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
  /* margin-bottom: 25px; (Видалено, відступ тепер у .step-content) */
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

/* (Чекбокси та сітка - без змін) */
.checkbox-group {
  display: flex;
  align-items: center;
  padding-top: 0; 
}
.form-row .checkbox-group {
  padding-top: 30px; 
}
.checkbox-group.single-checkbox {
  padding-top: 0; 
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
.comfort-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
@media (min-width: 576px) {
  .comfort-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 768px) {
  .comfort-grid {
    grid-template-columns: 1fr 1fr 1fr; 
  }
}
.comfort-grid .checkbox-group {
  padding-top: 0;
}

/* ================================= */
/* 5. НОВІ СТИЛІ ДЛЯ ВІЗАРДА */
/* ================================= */
.progressbar-wrapper {
  width: 100%;
  margin-bottom: 30px;
}
.progressbar {
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  list-style: none;
}
.progressbar li {
  flex: 1;
  text-align: center;
  position: relative;
  color: #aaa;
  font-size: 12px;
  font-weight: 500;
  transition: color 0.3s ease;
}
.progressbar li::before {
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  background: #555;
  border: 2px solid #555;
  border-radius: 50%;
  margin: 0 auto 8px auto;
  transition: all 0.3s ease;
}
.progressbar li::after {
  content: '';
  position: absolute;
  top: 10px;
  left: -50%;
  width: 100%;
  height: 2px;
  background: #555;
  z-index: -1;
  transition: all 0.3s ease;
}
.progressbar li:first-child::after {
  content: none;
}
.progressbar li.active {
  color: #fff;
}
.progressbar li.active::before {
  background: #ffd700;
  border-color: #ffd700;
}
.progressbar li.active::after {
  background: #ffd700;
}
.progressbar li span {
  display: none; /* Приховуємо текст на маленьких екранах */
}
@media (min-width: 768px) {
  .progressbar li span {
    display: block; /* Показуємо текст на десктопі */
  }
}

.step-content {
  margin-bottom: 25px; /* Переносимо відступ з .form-card сюди */
}

/* Анімація переходу між кроками */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-out;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* (Кнопки та Оверлей - без змін) */
.form-actions {
  display: flex;
  justify-content: space-between; /* Змінено для кнопок "Назад" і "Далі" */
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
  flex: 2; /* "Далі" та "Опублікувати" будуть ширшими */
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
  flex: 1; /* Кнопка "Назад" буде вужчою */
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