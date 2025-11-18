<template>
  <div class="listings-view">
    <div class="container">
      <h1>{{ t('listings.title') }}</h1>
      
      <div class="page-layout">
        
        <aside class="filter-sidebar">
          <div class="filter-card">
            <h2>{{ t('listings.filter.title') }}</h2>
            
            <form @submit.prevent="handleFilter">
              <div class="form-group">
                <label for="brand">{{ t('fields.brand') }}</label>
                <input type="text" id="brand" v-model="filters.brand" :placeholder="t('listings.filter.brandPlaceholder')">
              </div>

              <div class="form-group">
                <label for="model">{{ t('fields.model') }}</label>
                <input type="text" id="model" v-model="filters.model" :placeholder="t('listings.filter.modelPlaceholder')">
              </div>
              
              <div class="form-group">
                <label>{{ t('listings.filter.priceLabel') }}</label>
                <div class="form-row">
                  <input type="number" v-model.number="filters.priceMin" :placeholder="t('listings.filter.priceFrom')">
                  <input type="number" v-model.number="filters.priceMax" :placeholder="t('listings.filter.priceTo')">
                </div>
              </div>

              <div class="form-group">
                <label>{{ t('listings.filter.yearLabel') }}</label>
                <div class="form-row">
                  <input type="number" v-model.number="filters.yearMin" :placeholder="t('listings.filter.priceFrom')">
                  <input type="number" v-model.number="filters.yearMax" :placeholder="t('listings.filter.priceTo')">
                </div>
              </div>

              <div class="form-group">
                <label>{{ t('fields.mileageLabel') }}</label>
                <div class="form-row">
                  <input type="number" v-model.number="filters.mileageMin" :placeholder="t('listings.filter.priceFrom')">
                  <input type="number" v-model.number="filters.mileageMax" :placeholder="t('listings.filter.priceTo')">
                </div>
              </div>

              <div class="form-group">
                <label for="fuel">{{ t('fields.fuel') }}</label>
                <select id="fuel" v-model="filters.fuel">
                  <option value="">{{ t('listings.filter.anyFuel') }}</option>
                  <option v-for="fuel in fuelTypes" :key="fuel" :value="fuel">{{ t('fuelTypes.' + fuel) }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="transmission">{{ t('fields.transmission') }}</label>
                <select id="transmission" v-model="filters.transmission">
                  <option value="">{{ t('listings.filter.anyTransmission') }}</option>
                  <option v-for="transType in transmissionTypes" :key="transType" :value="transType">{{ t('transmissionTypes.' + transType) }}</option>
                </select>
              </div>
              
              <button type="submit" class="btn-submit">
                {{ t('listings.filter.submit') }}
              </button>
            </form>
            
          </div>
        </aside>
        
        <main class="results-list">
          
          <div v-if="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>{{ t('listingDetail.loading') }}</p>
          </div>

          <template v-else-if="filteredListings.length > 0">
            <CarCard 
              v-for="car in filteredListings" 
              :key="car.id" 
              :listing="car"
            />
          </template>
          
          <div v-else class="no-results">
            <h3>{{ t('listings.noResults') }}</h3>
            <p>{{ t('listings.noResultsHint') }}</p>
          </div>
          
          </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import CarCard from '@/components/CarCard.vue';

const toast = useToast();
const { t } = useI18n();

// Базовий URL
const API_LISTING_URL = 'https://backend-auto-market.onrender.com/api/Listing';

const isLoading = ref(false);
const allListings = ref([]); 
const filteredListings = ref([]); 

// Фільтри
const filters = ref({
  brand: '',
  model: '',
  priceMin: null,
  priceMax: null,
  yearMin: null,  
  yearMax: null,  
  mileageMin: null,
  mileageMax: null, 
  fuel: '',
  transmission: ''
});

const fuelTypes = ref(['petrol', 'diesel', 'electric', 'hybrid', 'gas_petrol']);
const transmissionTypes = ref(['automatic', 'manual', 'robot']);

// --- 2. МАПЕР ---
function mapApiToCarCard(apiItem) {
  return {
    id: apiItem.id,
    brand: apiItem.brand?.name || 'Unknown',
    model: apiItem.model?.name || 'Unknown',
    year: apiItem.year,
    mileage: apiItem.mileage,
    price: apiItem.price,
    currency: 'USD',
    fuel: (apiItem.fuelType?.name || '').toLowerCase(), 
    transmission: (apiItem.gearType?.name || '').toLowerCase(),
    bodyType: (apiItem.bodyType?.name || '').toLowerCase(),
    driveTrain: (apiItem.driveType?.name || '').toLowerCase(),
    engineSize: apiItem.engineSize || 0,
    color: (apiItem.colorHex || '').toLowerCase(),
    location: apiItem.city?.name || apiItem.region?.name || 'Україна',
    images: apiItem.photoUrls || [],
    mainImage: (apiItem.photoUrls && apiItem.photoUrls.length > 0) ? apiItem.photoUrls[0] : null
  };
}

// --- 3. ЗАВАНТАЖЕННЯ (API) ---
async function fetchListings() {
  isLoading.value = true;
  
  const params = {};
  if (filters.value.priceMin) params.PriceFrom = filters.value.priceMin;
  if (filters.value.priceMax) params.PriceTo = filters.value.priceMax;
  
  if (filters.value.yearMin) params.YearFrom = filters.value.yearMin;
  if (filters.value.yearMax) params.YearTo = filters.value.yearMax;
  
  if (filters.value.mileageMin) params.MileageFrom = filters.value.mileageMin;
  if (filters.value.mileageMax) params.MileageTo = filters.value.mileageMax;
  

  try {
    const response = await axios.get(API_LISTING_URL, { params });
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      allListings.value = response.data.map(mapApiToCarCard);
      toast.success(t('listingDetail.loadSuccess'));
    } else {
      console.warn('API returned empty list. Using mock data.');
      allListings.value = MOCK_CARS;
    }

  } catch (error) {
    console.warn('API Error. Using mock data.');
    allListings.value = MOCK_CARS;
  } finally {
    // 2. Запускаємо повну клієнтську фільтрацію
    applyClientSideFilters();
    isLoading.value = false;
  }
}

// --- 4. КЛІЄНТСЬКА ФІЛЬТРАЦІЯ (ПОВНА) ---
// Ця функція фільтрує те, що ми отримали (чи з сервера, чи з моків)
function applyClientSideFilters() {
  let result = [...allListings.value];
  
  if (filters.value.brand) {
    result = result.filter(car => 
      car.brand && car.brand.toLowerCase().includes(filters.value.brand.toLowerCase())
    );
  }
  if (filters.value.model) {
    result = result.filter(car => 
      car.model && car.model.toLowerCase().includes(filters.value.model.toLowerCase())
    );
  }

  if (filters.value.priceMin) {
    result = result.filter(car => car.price >= filters.value.priceMin);
  }
  if (filters.value.priceMax) {
    result = result.filter(car => car.price <= filters.value.priceMax);
  }

  if (filters.value.yearMin) {
    result = result.filter(car => car.year >= filters.value.yearMin);
  }
  if (filters.value.yearMax) {
    result = result.filter(car => car.year <= filters.value.yearMax);
  }

  if (filters.value.mileageMin) {
    result = result.filter(car => car.mileage >= filters.value.mileageMin);
  }
  if (filters.value.mileageMax) {
    result = result.filter(car => car.mileage <= filters.value.mileageMax);
  }

  if (filters.value.fuel) {
     result = result.filter(car => car.fuel === filters.value.fuel);
  }

  if (filters.value.transmission) {
     result = result.filter(car => car.transmission === filters.value.transmission);
  }

  filteredListings.value = result;
}

function handleFilter() {
  fetchListings(); 
}

onMounted(() => {
  fetchListings();
});
</script>

<style scoped>
/* (Всі ваші стилі з попередньої версії залишаються без змін) */
.listings-view {
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
.listings-view::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.container h1 {
  margin-bottom: 30px;
  text-align: left;
}
.page-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
}
@media (min-width: 992px) {
  .page-layout {
    grid-template-columns: 1fr 3fr; 
  }
}
.filter-card {
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 30px;
}
.filter-card h2 {
  margin-top: 0; margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px; font-weight: 500;
}
.form-group { margin-bottom: 20px; }
.form-group label {
  display: block; font-size: 14px; 
  font-weight: 500; margin-bottom: 8px;
  color: #fff; text-align: left;
}
.form-group input {
  display: block; width: 100%; height: 45px;
  padding: 0 12px; border-radius: 3px;
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555;
  font-size: 14px; font-weight: 300;
  color: #fff; box-sizing: border-box;
}
.form-group input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  outline: none;
}
.form-group select {
  display: block; width: 100%; height: 45px;
  padding: 0 12px; border-radius: 3px;
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555;
  font-size: 14px; font-weight: 300;
  color: #fff; box-sizing: border-box;
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
.form-group select:focus {
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  outline: none;
}
.form-row { display: flex; gap: 10px; }
.btn-submit {
  font-family: 'Open Sans', sans-serif;
  width: 100%; padding: 12px 0;
  border-radius: 6px; border: none;
  font-weight: 600; cursor: pointer;
  transition: 0.3s; background-color: #cc0000;
  color: #fff; font-size: 16px;
}
.btn-submit:hover { background-color: #aa0000; }
.results-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.no-results {
  text-align: center;
  padding: 40px;
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}
.loading-state {
  text-align: center;
  padding: 40px;
}
.spinner {
  width: 60px;
  height: 60px;
  border: 5px solid #555;
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px auto;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>