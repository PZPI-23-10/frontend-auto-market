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
                <label>{{ t('createListing.step1.vehicleType') }}</label>
                <SearchableSelect 
                  v-model="filters.vehicleTypeId" 
                  :options="lists.vehicleTypes"
                  :placeholder="t('listings.filter.any') || 'Всі типи'" 
                  translation-scope="options.vehicleType"
                />
              </div>

              <div class="form-group">
                <label>{{ t('fields.brand') }}</label>
                <SearchableSelect 
                  v-model="filters.brandId" 
                  :options="lists.brands"
                  :placeholder="t('listings.filter.brandPlaceholder')"
                />
              </div>

              <div class="form-group">
                <label>{{ t('fields.model') }}</label>
                <SearchableSelect 
                  v-model="filters.modelId" 
                  :options="lists.models"
                  :placeholder="t('listings.filter.modelPlaceholder')"
                  :disabled="!filters.brandId"
                />
              </div>

              <div class="form-group">
                <label>{{ t('listings.filter.priceLabel') }}</label>
                <div class="form-row">
                  <input type="number" min="0" v-model.number="filters.priceMin" :placeholder="t('listings.filter.priceFrom')" @keydown="preventInvalidInput">
                  <input type="number" min="0" v-model.number="filters.priceMax" :placeholder="t('listings.filter.priceTo')" @keydown="preventInvalidInput">
                </div>
              </div>

              <div class="form-group">
                <label>{{ t('listings.filter.yearLabel') }}</label>
                <div class="form-row">
                  <input type="number" min="1900" v-model.number="filters.yearMin" :placeholder="t('listings.filter.priceFrom')" @keydown="preventInvalidInput">
                  <input type="number" min="1900" v-model.number="filters.yearMax" :placeholder="t('listings.filter.priceTo')" @keydown="preventInvalidInput">
                </div>
              </div>

              <div class="form-group">
                <label>{{ t('fields.mileageLabel') }}</label>
                <div class="form-row">
                  <input type="number" min="0" v-model.number="filters.mileageMin" :placeholder="t('listings.filter.priceFrom')" @keydown="preventInvalidInput">
                  <input type="number" min="0" v-model.number="filters.mileageMax" :placeholder="t('listings.filter.priceTo')" @keydown="preventInvalidInput">
                </div>
              </div>

              <div class="form-group">
                <label>{{ t('fields.fuel') }}</label>
                <SearchableSelect 
                  v-model="filters.fuelTypeId" 
                  :options="lists.fuelTypes"
                  :placeholder="t('listings.filter.anyFuel')" 
                  translation-scope="options.fuel"
                />
              </div>

              <div class="form-group">
                <label>{{ t('fields.transmission') }}</label>
                <SearchableSelect 
                  v-model="filters.gearTypeId" 
                  :options="lists.gearTypes"
                  :placeholder="t('listings.filter.anyTransmission')" 
                  translation-scope="options.transmission"
                />
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
            <CarCard v-for="car in filteredListings" :key="car.id" :listing="car" />
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
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import CarCard from '@/components/CarCard.vue';
import SearchableSelect from '@/components/SearchableSelect.vue';

const toast = useToast();
const { t } = useI18n();
const route = useRoute();

const API_BASE = 'https://backend-auto-market.onrender.com/api';
const API_LISTING_URL = `${API_BASE}/Listing`;

const isLoading = ref(false);
const allListings = ref([]); 
const filteredListings = ref([]); 

const fullData = ref({
  brands: [] 
});

const lists = ref({
  vehicleTypes: [],
  brands: [],
  models: [],
  fuelTypes: [],
  gearTypes: []
});

const filters = ref({
  vehicleTypeId: null,
  brandId: null,
  modelId: null,
  priceMin: null, priceMax: null,
  yearMin: null, yearMax: null,
  mileageMin: null, mileageMax: null, 
  fuelTypeId: null, 
  gearTypeId: null  
});

onMounted(async () => {
  if (route.query.vehicleTypeId) filters.value.vehicleTypeId = Number(route.query.vehicleTypeId);
  if (route.query.brandId) filters.value.brandId = Number(route.query.brandId);
  if (route.query.modelId) filters.value.modelId = Number(route.query.modelId);
  if (route.query.fuelTypeId) filters.value.fuelTypeId = Number(route.query.fuelTypeId);

  try {
    const [typesRes, fuelsRes, gearsRes, brandsRes] = await Promise.all([
      axios.get(`${API_BASE}/VehicleType`),
      axios.get(`${API_BASE}/FuelType`),
      axios.get(`${API_BASE}/GearType`),
      axios.get(`${API_BASE}/VehicleBrand`)
    ]);
    
    lists.value.vehicleTypes = typesRes.data;
    lists.value.fuelTypes = fuelsRes.data;
    lists.value.gearTypes = gearsRes.data;
    
    fullData.value.brands = brandsRes.data;
    lists.value.brands = brandsRes.data;
    
    if (filters.value.vehicleTypeId) {
       lists.value.brands = fullData.value.brands.filter(b => b.vehicleTypeId === filters.value.vehicleTypeId);
    }

    if (filters.value.brandId) {
       loadModels(filters.value.brandId);
    }

    fetchListings();
  } catch (e) {
    console.error("Error loading initial lists:", e);
  }
});

// --- ЛОГІКА СПИСКІВ ---
watch(() => filters.value.vehicleTypeId, (newTypeId) => {
  const previousBrandId = filters.value.brandId;
  filters.value.brandId = null;
  filters.value.modelId = null;
  lists.value.models = []; 
  
  if (!newTypeId) {
    lists.value.brands = fullData.value.brands;
  } else {
    const filtered = fullData.value.brands.filter(b => b.vehicleTypeId === newTypeId);
    lists.value.brands = filtered.length > 0 ? filtered : fullData.value.brands;
  }
  
  if (previousBrandId && lists.value.brands.find(b => b.id === previousBrandId)) {
     filters.value.brandId = previousBrandId;
     loadModels(previousBrandId);
  }
});

watch(() => filters.value.brandId, (newBrandId) => {
  filters.value.modelId = null;
  lists.value.models = [];
  if (newBrandId) loadModels(newBrandId);
});

async function loadModels(brandId) {
  try {
    const params = { brandId: brandId };
    if (filters.value.vehicleTypeId) {
       params.vehicleTypeId = filters.value.vehicleTypeId;
    }
    const res = await axios.get(`${API_BASE}/VehicleModel`, { params });
    lists.value.models = res.data;
  } catch (e) { console.error(e); }
}

// --- ВИПРАВЛЕНА ФУНКЦІЯ МАППІНГУ ---
function mapApiToCarCard(apiItem) {
  // 1. Правильна обробка фото (як у ProfileView)
  let images = [];
   let rawPhotos = apiItem.photos || apiItem.photoUrls;

  if (Array.isArray(rawPhotos) && rawPhotos.length > 0) {
    if (typeof rawPhotos[0] === 'object' && rawPhotos[0] !== null) {
        
        rawPhotos.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

        images = rawPhotos.map(p => p.url);
        
    } else {
        images = rawPhotos;
    }
  }

  return {
    id: apiItem.id,
    vehicleTypeId: apiItem.vehicleType?.id,
    brandId: apiItem.brand?.id,
    modelId: apiItem.model?.id,
    fuelTypeId: apiItem.fuelType?.id,
    gearTypeId: apiItem.gearType?.id,
    
    brand: apiItem.brand?.name || 'Unknown',
    model: apiItem.model?.name || 'Unknown',
    year: apiItem.year,
    mileage: apiItem.mileage,
    price: apiItem.price,
    currency: apiItem.currency || 'USD',
    fuel: (apiItem.fuelType?.name || '').toLowerCase(), 
    transmission: (apiItem.gearType?.name || '').toLowerCase(),
    bodyType: (apiItem.bodyType?.name || '').toLowerCase(),
    driveTrain: (apiItem.driveType?.name || '').toLowerCase(),
    engineSize: apiItem.engineSize || 0,
    color: (apiItem.colorHex || '').toLowerCase(),
    location: apiItem.city?.name || apiItem.region?.name || 'Україна',
    
    // 2. Присвоюємо оброблені фото
    images: images,
    mainImage: images.length > 0 ? images[0] : null
  };
}

const preventInvalidInput = (event) => {
  if (['-', '+', 'e', 'E'].includes(event.key)) {
    event.preventDefault();
  }
};

async function fetchListings() {
  isLoading.value = true;
  const params = {};
  
  if (filters.value.vehicleTypeId) params.VehicleTypeId = filters.value.vehicleTypeId;
  if (filters.value.brandId) params.BrandId = filters.value.brandId;
  if (filters.value.modelId) params.ModelId = filters.value.modelId;
  if (filters.value.fuelTypeId) params.FuelTypeId = filters.value.fuelTypeId;
  if (filters.value.gearTypeId) params.GearTypeId = filters.value.gearTypeId;
  if (filters.value.priceMin) params.PriceFrom = filters.value.priceMin;
  if (filters.value.priceMax) params.PriceTo = filters.value.priceMax;
  if (filters.value.yearMin) params.YearFrom = filters.value.yearMin;
  if (filters.value.yearMax) params.YearTo = filters.value.yearMax;
  if (filters.value.mileageMin) params.MileageFrom = filters.value.mileageMin;
  if (filters.value.mileageMax) params.MileageTo = filters.value.mileageMax;

  try {
    const response = await axios.get(API_LISTING_URL, { params });
    if (Array.isArray(response.data)) {
      allListings.value = response.data.map(mapApiToCarCard);
      if(response.data.length > 0) {
           // toast.success(t('listingDetail.loadSuccess'));
      }
    } 
  } catch (error) {
    console.warn('API Error', error);
    allListings.value = [];
  } finally {
    applyClientSideFilters();
    isLoading.value = false;
  }
}

function applyClientSideFilters() {
  let result = [...allListings.value];
  
  if (filters.value.vehicleTypeId) result = result.filter(car => car.vehicleTypeId === filters.value.vehicleTypeId);
  if (filters.value.brandId) result = result.filter(car => car.brandId === filters.value.brandId);
  if (filters.value.modelId) result = result.filter(car => car.modelId === filters.value.modelId);
  if (filters.value.fuelTypeId) result = result.filter(car => car.fuelTypeId === filters.value.fuelTypeId);
  if (filters.value.gearTypeId) result = result.filter(car => car.gearTypeId === filters.value.gearTypeId);

  if (filters.value.priceMin) result = result.filter(car => car.price >= filters.value.priceMin);
  if (filters.value.priceMax) result = result.filter(car => car.price <= filters.value.priceMax);
  if (filters.value.yearMin) result = result.filter(car => car.year >= filters.value.yearMin);
  if (filters.value.yearMax) result = result.filter(car => car.year <= filters.value.yearMax);
  if (filters.value.mileageMin) result = result.filter(car => car.mileage >= filters.value.mileageMin);
  if (filters.value.mileageMax) result = result.filter(car => car.mileage <= filters.value.mileageMax);

  filteredListings.value = result;
}

function handleFilter() {
  fetchListings(); 
}
</script>

<style scoped>
/* Основні стилі сторінки */
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

/* Стилі картки фільтрів (як у CreateListing) */
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

/* Стилі інпутів (ідентичні CreateListing) */
.form-group { margin-bottom: 20px; }
.form-group label {
  display: block; 
  font-size: 14px; 
  font-weight: 500; 
  margin-bottom: 8px;
  color: #fff; 
  text-align: left;
  text-transform: none !important; 
  letter-spacing: normal;
}
.form-group input,
.form-group select {
  display: block; width: 100%; height: 45px;
  padding: 0 12px; border-radius: 3px;
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555;
  font-size: 14px; font-weight: 300;
  color: #fff; box-sizing: border-box;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

/* Кастомна стрілка для Select */
.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px 16px;
  padding-right: 40px; 
  cursor: pointer;
  text-transform: capitalize !important;
}
.form-group select option {
  background: #333;
  color: #fff;
  text-transform: capitalize;
}
/* Стан disabled */
.form-group select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: rgba(255,255,255,0.05);
}

.form-group input:focus,
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
  text-transform: uppercase;
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
  width: 60px; height: 60px;
  border: 5px solid #555;
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px auto;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>