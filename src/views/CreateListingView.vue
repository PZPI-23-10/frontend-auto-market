<template>
  <div class="create-listing-view">
    <div class="form-container">
      <h1>{{ t('createListing.title') }}</h1>
      
      <form @submit.prevent="handleSubmit" novalidate>

        <section class="form-card">
          <h2>{{ t('createListing.sectionBasic') }}</h2>
          <div class="form-row">
            <div class="form-group">
              <label for="brand">{{ t('fields.brand') }}</label>
              <input type="text" id="brand" v-model="listing.brand" required>
            </div>
            <div class="form-group">
              <label for="model">{{ t('fields.model') }}</label>
              <input type="text" id="model" v-model="listing.model" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="year">{{ t('fields.year') }}</label>
              <select id="year" v-model="listing.year" required>
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="mileage">{{ t('fields.mileageLabel') }}</label>
              <input type="number" id="mileage" v-model.number="listing.mileage" required>
            </div>
          </div>
          <div class="form-group">
            <label for="fuel">{{ t('fields.fuel') }}</label>
            <select id="fuel" v-model="listing.fuel" required>
              <option value="" disabled>{{ t('createListing.selectDefault') }}</option>
                            <option v-for="fuelType in fuelTypes" :key="fuelType" :value="fuelType">
                {{ t('fuelTypes.' + fuelType) }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="transmission">{{ t('fields.transmission') }}</label>
            <select id="transmission" v-model="listing.transmission" required>
              <option value="" disabled>{{ t('createListing.selectDefault') }}</option>
                            <option v-for="tType in transmissionTypes" :key="tType" :value="tType">
                {{ t('transmissionTypes.' + tType) }}
              </option>
            </select>
          </div>
        </section>
        
        <section class="form-card">
          <h2>{{ t('createListing.sectionPrice') }}</h2>
          <div class="form-row">
            <div class="form-group price-group">
              <label for="price">{{ t('fields.price') }}</label>
              <div class="input-group">
                <input type="number" id="price" v-model.number="listing.price" required>
                <select id="currency" v-model="listing.currency">
                  <option value="USD">USD</option>
                  <option value="UAH">UAH</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="location">{{ t('fields.location') }}</label>
              <input type="text" id="location" v-model="listing.location" required>
            </div>
          </div>
        </section>

        <section class="form-card">
          <h2>{{ t('createListing.sectionDesc') }}</h2>
          <div class="form-group">
            <label for="description">{{ t('createListing.descLabel') }}</label>
            <textarea id="description" v-model="listing.description" rows="6"></textarea>
          </div>
        </section>

        <section class="form-card">
          <h2>{{ t('createListing.sectionPhotos') }}</h2>
          <PhotoUploader 
            :maxFiles="10" 
            @files-updated="updateFiles" 
          />
        </section>

        <div class="form-actions">
          
          <button 
            type="button" 
            class="btn-secondary" 
            @click="goBack" 
            :disabled="isSubmitting"
          >
            {{ t('common.back') }}
          </button>
          
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? t('createListing.submitting') : t('createListing.submit') }}
          </button>
        </div>
      </form>
    </div>
    
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="spinner"></div>
      <h2>{{ t('createListing.submitting') }}</h2>
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
const { t } = useI18n(); // 2. ОТРИМАННЯ ФУНКЦІЇ t
const isSubmitting = ref(false);

const DRAFT_STORAGE_KEY = 'newListingDraft';

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
const listingPhotos = ref([]);

// --- Опції для Select'ів (ОНОВЛЕНО) ---
// 3. Тепер масиви зберігають КЛЮЧІ, а не перекладені рядки
const fuelTypes = ref(['petrol', 'diesel', 'electric', 'hybrid', 'gas_petrol']);
const transmissionTypes = ref(['manual', 'automatic', 'robot']);

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1970;
  let yearList = [];
  for (let i = currentYear; i >= startYear; i--) {
    yearList.push(i);
  }
  return yearList;
});

// --- Автозбереження/Автозавантаження ---
watch(listing, (newData) => {
  console.log('Зберігаємо чернетку...');
  localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(newData));
}, {
  deep: true
});

onMounted(() => {
  const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (savedDraft) {
    try {
      listing.value = JSON.parse(savedDraft);
      // 4. Локалізація Toast
      toast.info(t('createListing.draftRestored'));
    } catch (e) {
      console.error('Не вдалося відновити чернетку:', e);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }
});

// --- ЛОГІКА ДЛЯ КОМПОНЕНТА ---
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
  
  // --- Валідація (ОНОВЛЕНО) ---
  const requiredText = ['brand', 'model', 'fuel', 'location', 'transmission'];
  for (const field of requiredText) {
    if (!listing.value[field]) {
      // 5. Використання t() замість fieldNames
      toast.warning(t('createListing.validation.required', { field: t('fields.' + field) }));
      return; 
    }
  }
  if (!listing.value.mileage || listing.value.mileage <= 0) {
    toast.warning(t('createListing.validation.invalid', { field: t('fields.mileage') }));
    return;
  }
  if (!listing.value.price || listing.value.price <= 0) {
    toast.warning(t('createListing.validation.invalid', { field: t('fields.price') }));
    return;
  }
  if (listingPhotos.value.length === 0) {
    toast.warning(t('createListing.validation.noPhotos'));
    return;
  }
  
  isSubmitting.value = true;
  
  console.log('--- ДАНІ ДЛЯ ВІДПРАВКИ ---');
  console.log('Дані:', listing.value);
  console.log('Файли:', listingPhotos.value);
  
  setTimeout(() => {
    isSubmitting.value = false;
    // 6. Локалізація Toast
    toast.success(t('createListing.publishSuccess'));
    
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    
    router.push('/my-listings'); 
    
  }, 2000);
}
</script>

<style scoped>
/* СТИЛІ НЕ ЗМІНЕНО */
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
.price-group .input-group input {
  width: 100%;
}
.price-group .input-group select {
  width: 100px;
  flex-shrink: 0;
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