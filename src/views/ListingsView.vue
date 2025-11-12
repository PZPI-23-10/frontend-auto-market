<template>
  <div class="listings-view">
    <div class="container">
      <h1>Каталог автомобілів</h1>
      
      <div class="page-layout">
        
        <!-- КОЛОНКА 1: ФІЛЬТР -->
        <aside class="filter-sidebar">
          <div class="filter-card">
            <h2>Фільтри</h2>
            
            <form @submit.prevent="handleFilter">
              <div class="form-group">
                <label for="brand">Бренд</label>
                <input type="text" id="brand" v-model="filters.brand" placeholder="Наприклад, BMW">
              </div>

              <div class="form-group">
                <label for="model">Модель</label>
                <input type="text" id="model" v-model="filters.model" placeholder="Наприклад, A6">
              </div>
              
              <div class="form-group">
                <label>Ціна (USD)</label>
                <div class="form-row">
                  <input type="number" v-model.number="filters.priceMin" placeholder="Від">
                  <input type="number" v-model.number="filters.priceMax" placeholder="До">
                </div>
              </div>

              <div class="form-group">
                <label>Рік</label>
                <div class="form-row">
                  <input type="number" v-model.number="filters.yearMin" placeholder="Від">
                  <input type="number" v-model.number="filters.yearMax" placeholder="До">
                </div>
              </div>

              <div class="form-group">
                <label for="fuel">Паливо</label>
                <select id="fuel" v-model="filters.fuel">
                  <option value="">Будь-яке</option>
                  <option v-for="fuel in fuelTypes" :key="fuel" :value="fuel">{{ fuel }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="transmission">Коробка передач</label>
                <select id="transmission" v-model="filters.transmission">
                  <option value="">Будь-яка</option>
                  <option v-for="t in transmissionTypes" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              
              <button type="submit" class="btn-submit">
                Застосувати
              </button>
            </form>
            
          </div>
        </aside>
        
        <!-- КОЛОНКА 2: РЕЗУЛЬТАТИ -->
        <main class="results-list">
          
          <!-- 
            ОНОВЛЕННЯ: Тепер ми ітеруємо 'paginatedListings', 
            а не 'mockCars'
          -->
          <template v-if="paginatedListings.length > 0">
            <CarCard 
              v-for="car in paginatedListings" 
              :key="car.id" 
              :listing="car"
            />
          </template>
          
          <div v-else class="no-results">
            <h3>Нічого не знайдено</h3>
            <p>Спробуйте змінити параметри фільтру</p>
          </div>
          
          <!-- 
            НОВИЙ БЛОК: КНОПКИ ПАГІНАЦІЇ
            (З'являється, тільки якщо сторінок більше однієї)
          -->
          <div v-if="totalPages > 1" class="pagination-controls">
            <button 
              class="page-btn" 
              @click="goToPage(currentPage - 1)" 
              :disabled="currentPage === 1"
            >
              &#10094; <!-- < -->
            </button>
            
            <button 
              v-for="page in totalPages" 
              :key="page"
              class="page-btn"
              :class="{ active: currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            
            <button 
              class="page-btn" 
              @click="goToPage(currentPage + 1)" 
              :disabled="currentPage === totalPages"
            >
              &#10095; <!-- > -->
            </button>
          </div>
          
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRoute } from 'vue-router'; // <--- 1. ІМПОРТУЄМО РОУТ
import CarCard from '@/components/CarCard.vue';

const toast = useToast();
const route = useRoute(); // <--- 2. ІНІЦІАЛІЗУЄМО

// Фільтри
const filters = ref({
  brand: '',
  model: '',
  priceMin: null,
  priceMax: null,
  yearMin: null,
  yearMax: null,
  fuel: '',
  transmission: ''
});

// Опції для <select>
const fuelTypes = ref(['Бензин', 'Дизель', 'Електро', 'Гібрид', 'Газ/Бензин']);
const transmissionTypes = ref(['Автомат', 'Механіка', 'Робот']);

// "База даних"
const allMockCars = ref([]); 
// Те, що ми показуємо
const filteredListings = ref([]);

// Логіка пагінації (без змін)
const currentPage = ref(1);
const itemsPerPage = 5;
const totalPages = computed(() => {
  return Math.ceil(filteredListings.value.length / itemsPerPage);
});
const paginatedListings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredListings.value.slice(start, end);
});
function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * (МОК) Функція фільтрації (тепер вона головна)
 */
function applyFilters() {
  toast.info('(Симуляція) Застосовуємо фільтри...');
  
  let result = [...allMockCars.value]; 

  if (filters.value.brand) {
    result = result.filter(car => 
      car.brand.toLowerCase().includes(filters.value.brand.toLowerCase())
    );
  }
  if (filters.value.model) {
    result = result.filter(car => 
      car.model.toLowerCase().includes(filters.value.model.toLowerCase())
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
  if (filters.value.fuel) {
    result = result.filter(car => car.fuel === filters.value.fuel);
  }
  if (filters.value.transmission) {
    result = result.filter(car => car.transmission === filters.value.transmission);
  }
  
  filteredListings.value = result;
  currentPage.value = 1;
}

// Функція, яку викликає кнопка
function handleFilter() {
  // (Коли буде API, ми оновимо URL тут)
  applyFilters();
}

// ---
// 3. НОВА ЛОГІКА: "Читаємо" URL при завантаженні
// ---
onMounted(() => {
  // (Створюємо "мок" дані)
  const generatedCars = [
    { id: 1, brand: 'Audi', model: 'A6', year: 2020, mileage: 50, fuel: 'Дизель', price: 35000, currency: 'USD', location: 'Київ', transmission: 'Автомат', images: ['https://images.unsplash.com/photo-1541348263662-e56892d63df6?q=80&w=800', 'https://images.unsplash.com/photo-1612999332206-819194885c3b?q=80&w=800'] },
    { id: 2, brand: 'Tesla', model: 'Model 3', year: 2022, mileage: 15, fuel: 'Електро', price: 40000, currency: 'USD', location: 'Львів', transmission: 'Автомат', images: ['https://images.unsplash.com/photo-1554844078-f24c7694d509?q=80&w=800'] },
    { id: 3, brand: 'BMW', model: 'X5', year: 2019, mileage: 80, fuel: 'Бензин', price: 45000, currency: 'USD', location: 'Одеса', transmission: 'Автомат', images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800'] },
    { id: 4, brand: 'Volkswagen', model: 'Passat', year: 2018, mileage: 120, fuel: 'Дизель', price: 22000, currency: 'USD', location: 'Харків', transmission: 'Механіка', images: ['https://images.unsplash.com/photo-1551830820-330a14b901a8?q=80&w=800'] },
    { id: 5, brand: 'Toyota', model: 'Camry', year: 2021, mileage: 30, fuel: 'Гібрид', price: 33000, currency: 'USD', location: 'Київ', transmission: 'Автомат', images: ['https://images.unsplash.com/photo-1604132223204-b81b53f180f1?q=80&w=800'] },
    { id: 6, brand: 'Audi', model: 'Q8', year: 2021, mileage: 25, fuel: 'Бензин', price: 65000, currency: 'USD', location: 'Дніпро', transmission: 'Автомат', images: ['https://images.unsplash.com/photo-1593361685162-d96f0183b3f2?q=80&w=800'] },
    { id: 7, brand: 'BMW', model: '3 Series', year: 2017, mileage: 150, fuel: 'Бензин', price: 20000, currency: 'USD', location: 'Львів', transmission: 'Механіка', images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800'] },
    { id: 8, brand: 'Audi', model: 'A6', year: 2019, mileage: 60, fuel: 'Дизель', price: 32000, currency: 'USD', location: 'Одеса', transmission: 'Автомат', images: ['https://images.unsplash.com/photo-1541348263662-e56892d63df6?q=80&w=800'] },
    { id: 9, brand: 'Tesla', model: 'Model X', year: 2021, mileage: 40, fuel: 'Електро', price: 55000, currency: 'USD', location: 'Київ', transmission: 'Автомат', images: ['https://images.unsplash.com/photo-1617997869485-6013a6c18843?q=80&w=800'] },
    { id: 10, brand: 'BMW', model: 'X5', year: 2020, mileage: 50, fuel: 'Гібрид', price: 48000, currency: 'USD', location: 'Харків', transmission: 'Автомат', images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800'] },
    { id: 11, brand: 'Volkswagen', model: 'Golf', year: 2016, mileage: 180, fuel: 'Газ/Бензин', price: 14000, currency: 'USD', location: 'Львів', transmission: 'Механіка', images: ['https://images.unsplash.com/photo-1541899121764-4c4f9a009e9e?q=80&w=800'] },
    { id: 12, brand: 'Toyota', model: 'RAV4', year: 2019, mileage: 70, fuel: 'Гібрид', price: 29000, currency: 'USD', location: 'Київ', transmission: 'Автомат', images: ['https://images.unsplash.com/photo-1587546224372-4dcfb6f93d6d?q=80&w=800'] },
    { id: 13, brand: 'Audi', model: 'A4', year: 2018, mileage: 90, fuel: 'Дизель', price: 26000, currency: 'USD', location: 'Дніпро', transmission: 'Робот', images: ['https://images.unsplash.com/photo-1616422285863-18703e720e17?q=80&w=800'] },
    { id: 14, brand: 'BMW', model: '5 Series', year: 2021, mileage: 30, fuel: 'Бензин', price: 52000, currency: 'USD', location: 'Одеса', transmission: 'Автомат', images: ['https://images.unsplash.com/photo-1617178613169-d17c9c0f999c?q=80&w=800'] },
  ];
  allMockCars.value = generatedCars;
  
  // (МОК) "Читаємо" URL
  const urlQuery = route.query;
  let filtersApplied = false;
  
  if (urlQuery.brand) {
    filters.value.brand = urlQuery.brand;
    filtersApplied = true;
  }
  if (urlQuery.model) {
    filters.value.model = urlQuery.model;
    filtersApplied = true;
  }
  if (urlQuery.fuel) {
    filters.value.fuel = urlQuery.fuel;
    filtersApplied = true;
  }
  
  // Якщо ми прийшли з URL, де були фільтри...
  if (filtersApplied) {
    applyFilters(); // ...одразу фільтруємо список
  } else {
    // ...інакше просто показуємо всі авто
    filteredListings.value = generatedCars;
  }
});

</script>

<style scoped>
/* --- 1. Фон та Контейнер (без змін) --- */
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

/* --- 2. Макет сторінки (без змін) --- */
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

/* --- 3. Фільтр (Стилі полів - без змін) --- */
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

/* --- 4. Список результатів (без змін) --- */
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

/* --- 
 * 5. НОВІ СТИЛІ ДЛЯ ПАГІНАЦІЇ 
 --- */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  /* (Фон, як у "скляних карток") */
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 15px;
}

.page-btn {
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  min-width: 40px;
  height: 40px;
  padding: 0 10px;
  cursor: pointer;
  
  /* Стиль кнопок, як у RegisterView */
  background-color: rgba(255,255,255,0.27);
  color: #fff;
  transition: 0.3s;
}
.page-btn:hover {
  background-color: rgba(255,255,255,0.4);
}
.page-btn:disabled {
  background-color: rgba(255,255,255,0.1);
  color: #777;
  cursor: not-allowed;
}

/* Активна сторінка - жовта (акцент) */
.page-btn.active {
  background-color: #ffd700;
  color: #000;
}

</style>