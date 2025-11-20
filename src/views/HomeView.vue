<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="container hero-container">
        
        <div class="hero-content">
          <span class="hero-subtitle">{{ t('home.hero.subtitle') }}</span>
          <h1 class="hero-title">{{ t('home.hero.title') }}</h1>
          <div class="hero-buttons">
            <router-link to="/listings" class="btn btn-primary">{{ t('home.hero.discover') }}</router-link>
            <a href="#" class="btn btn-secondary">{{ t('home.hero.meet') }}</a>
          </div>
        </div>

        <div class="hero-form">
          <h2>{{ t('home.form.title') }}</h2>
          <form @submit.prevent="handleSearch">
            
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
              <label>{{ t('fields.fuel') }}</label>
              <SearchableSelect 
                v-model="filters.fuelTypeId" 
                :options="lists.fuelTypes"
                :placeholder="t('listings.filter.anyFuel')"
                translation-scope="options.fuel"
              />
            </div>

            <button type="submit" class="btn-submit">
              {{ t('home.form.submit') }}
            </button>
          </form>
        </div>

      </div>
    </section>
    
    <section>
      </section>

    <button class="fab-sell-car" @click="handleSellClick">
      {{ t('home.sellButton') }} +
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import SearchableSelect from '@/components/SearchableSelect.vue';

const { t } = useI18n();
const router = useRouter();

const API_BASE = 'https://backend-auto-market.onrender.com/api';
const bgImage = ref('https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1920');

// Зберігаємо "Всі бренди" окремо, щоб можна було до них повернутися
const fullBrands = ref([]);

const lists = ref({
  vehicleTypes: [],
  brands: [], // Те, що відображається зараз
  models: [],
  fuelTypes: []
});

const filters = ref({
  vehicleTypeId: null,
  brandId: null,
  modelId: null,
  fuelTypeId: null
});

// --- 1. ЗАВАНТАЖЕННЯ ---
onMounted(async () => {
  try {
    // Вантажимо ВСЕ: Типи, Паливо І Бренди
    const [typesRes, fuelsRes, brandsRes] = await Promise.all([
      axios.get(`${API_BASE}/VehicleType`),
      axios.get(`${API_BASE}/FuelType`),
      axios.get(`${API_BASE}/VehicleBrand`)
    ]);

    lists.value.vehicleTypes = typesRes.data;
    lists.value.fuelTypes = fuelsRes.data;
    
    // Зберігаємо повний список брендів
    fullBrands.value = brandsRes.data;
    // І показуємо його одразу
    lists.value.brands = brandsRes.data;

  } catch (e) {
    console.error("Помилка завантаження HomeView:", e);
  }
});

// --- 2. ЛОГІКА ---

// A) Зміна ТИПУ -> Фільтруємо БРЕНДИ через API (або повертаємо всі)
watch(() => filters.value.vehicleTypeId, async (newTypeId) => {
  // Скидаємо вибір бренду/моделі при зміні типу, щоб не було конфліктів
  filters.value.brandId = null;
  filters.value.modelId = null;
  lists.value.models = [];

  if (!newTypeId) {
    // Якщо "Всі типи" (скинуто) -> показуємо повний список брендів з пам'яті
    lists.value.brands = fullBrands.value;
    return;
  }

  // Якщо обрано тип -> вантажимо бренди ТІЛЬКИ для цього типу з сервера
  try {
    const res = await axios.get(`${API_BASE}/VehicleBrand/for-type/${newTypeId}`);
    lists.value.brands = res.data;
  } catch (e) { 
    console.error(e); 
    // Якщо помилка, залишаємо пустий список або повертаємо повний
    lists.value.brands = []; 
  }
});

// Б) Зміна БРЕНДУ -> Вантажимо МОДЕЛІ
watch(() => filters.value.brandId, async (newBrandId) => {
  filters.value.modelId = null;
  lists.value.models = [];
  
  if (!newBrandId) return;

  try {
    const params = { brandId: newBrandId };
    // Додаємо тип до запиту, тільки якщо він обраний
    if (filters.value.vehicleTypeId) {
      params.vehicleTypeId = filters.value.vehicleTypeId;
    }
    const res = await axios.get(`${API_BASE}/VehicleModel`, { params });
    lists.value.models = res.data;
  } catch (e) { console.error(e); }
});

// --- 3. ДІЇ ---
function handleSearch() {
  const queryParams = {};
  if (filters.value.vehicleTypeId) queryParams.vehicleTypeId = filters.value.vehicleTypeId;
  if (filters.value.brandId) queryParams.brandId = filters.value.brandId;
  if (filters.value.modelId) queryParams.modelId = filters.value.modelId;
  if (filters.value.fuelTypeId) queryParams.fuelTypeId = filters.value.fuelTypeId;

  router.push({ name: 'listings', query: queryParams });
}

function handleSellClick() {
  router.push('/create-listing');
}
</script>

<style scoped>
.home-page { font-family: 'Open Sans', sans-serif; }

.hero-section {
  height: 100vh;
  background-image: url('@/assets/car-header1.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  position: relative;
  color: #fff;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

@media (max-width: 992px) {
  .hero-container {
    flex-direction: column;
    justify-content: center;
    gap: 40px;
    text-align: center;
  }
}

.hero-content { max-width: 600px; }
.hero-subtitle {
  color: #ffd700; font-weight: 700; letter-spacing: 2px;
  text-transform: uppercase; font-size: 14px; margin-bottom: 10px; display: block;
}
.hero-title {
  font-size: 48px; font-weight: 800; line-height: 1.1;
  margin-bottom: 30px; text-transform: uppercase;
}
.hero-buttons { display: flex; gap: 15px; }
@media (max-width: 992px) { .hero-buttons { justify-content: center; } }

.btn {
  padding: 12px 30px; border-radius: 30px; font-weight: 700;
  text-decoration: none; text-transform: uppercase; font-size: 14px; transition: 0.3s;
}
.btn-primary { background: #cc0000; color: #fff; }
.btn-primary:hover { background: #ff0000; }
.btn-secondary { background: transparent; border: 2px solid #fff; color: #fff; }
.btn-secondary:hover { background: #fff; color: #000; }

/* --- ФОРМА --- */
.hero-form {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 10px;
  width: 350px;
  border: 1px solid rgba(255,255,255,0.2);
}
.hero-form h2 { margin-top: 0; font-size: 24px; margin-bottom: 20px; text-align: center; }

.form-group { margin-bottom: 15px; text-align: left; }
.form-group label {
  display: block; font-size: 12px; color: #ddd; margin-bottom: 5px;
  text-transform: none !important; letter-spacing: 1px;
}

.btn-submit {
  width: 100%; padding: 14px; background: #ffd700; color: #000;
  border: none; border-radius: 5px; font-weight: 800; text-transform: uppercase;
  cursor: pointer; margin-top: 10px; transition: 0.3s;
}
.btn-submit:hover { background: #ffed4a; transform: translateY(-2px); }

.fab-sell-car {
  position: fixed; bottom: 30px; right: 30px;
  background: #cc0000; color: #fff; border: none;
  padding: 15px 25px; border-radius: 50px; font-weight: 700; font-size: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4); cursor: pointer; z-index: 100; transition: 0.3s;
}
.fab-sell-car:hover { background: #ff0000; transform: scale(1.05); }
</style>