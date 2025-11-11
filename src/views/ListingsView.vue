<template>
  <div class="listings-view">
    <div class="container">
      <h1>Каталог автомобілів</h1>
      
      <div class="page-layout">
        
        <!-- КОЛОНКА 1: ФІЛЬТР (без змін) -->
        <aside class="filter-sidebar">
          <div class="filter-card">
            <h2>Фільтри</h2>
            
            <form @submit.prevent="handleFilter">
              <div class="form-group">
                <label for="brand">Бренд</label>
                <input type="text" id="brand" v-model="filters.brand" placeholder="Наприклад, BMW">
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

              <!-- НОВІ ФІЛЬТРИ -->
              <div class="form-group">
                <label for="fuel">Паливо</label>
                <select id="fuel" v-model="filters.fuel">
                  <option value="">Будь-яке</option>
                  <option v-for="fuel in fuelTypes" :key="fuel" :value="fuel">{{ fuel }}</option>
                </select>
              </div>

              <!-- ВИДАЛЯЄМО БЛОК "КОРОБКА ПЕРЕДАЧ" -->
              <!-- 
              <div class="form-group">
                <label for="transmission">Коробка передач</label>
                <select id="transmission" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              -->
              <!-- КІНЕЦЬ НОВИх ФІЛЬТРІВ -->
              
              <button type="submit" class="btn-submit">
                Застосувати
              </button>
            </form>
            
          </div>
        </aside>
        
        <!-- 
          КОЛОНКА 2: РЕЗУЛЬТАТИ 
          (Тепер це не .results-grid, а .results-list)
        -->
        <main class="results-list">
          
          <div v-if="mockCars.length === 0" class="no-results">
            <h3>Нічого не знайдено</h3>
            <p>Спробуйте змінити параметри фільтру</p>
          </div>
          
          <!-- Ми використовуємо ваш оновлений CarCard.vue -->
          <CarCard 
            v-for="car in mockCars" 
            :key="car.id" 
            :listing="car"
          />
          
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';
import CarCard from '@/components/CarCard.vue'; // Імпортуємо вашу нову картку

const toast = useToast();

const filters = ref({
  brand: '',
  priceMin: null,
  priceMax: null,
  yearMin: null,
  yearMax: null,
  fuel: '', // <--- ДОДАНО
  // transmission: '' // <--- ВИДАЛЕНО
});

// --- ДОДАНО НОВІ ОПЦІЇ ДЛЯ ФІЛЬТРІВ ---
const fuelTypes = ref(['Бензин', 'Дизель', 'Електро', 'Гібрид', 'Газ/Бензин']);
// const transmissionTypes = ref(['Автомат', 'Механіка', 'Робот']); // <--- ВИДАЛЕНО
// ---

// ---
// (МОК) ОНОВЛЕНІ ДАНІ
// Тепер ми маємо 'images' (масив), а не 'mainImage'
// ---
const mockCars = ref([
  { 
    id: 1, 
    brand: 'Audi', 
    model: 'A6', 
    year: 2020, 
    mileage: 50, 
    fuel: 'Дизель', 
    price: 35000, 
    currency: 'USD',
    location: 'Київ',
    // Масив фото для каруселі
    images: [
      'https://images.unsplash.com/photo-1541348263662-e56892d63df6?q=80&w=800',
      'https://images.unsplash.com/photo-1612999332206-819194885c3b?q=80&w=800',
      'https://images.unsplash.com/photo-1612999331804-6a1573c7b2f5?q=80&w=800'
    ]
  },
  { 
    id: 2, 
    brand: 'Tesla', 
    model: 'Model 3', 
    year: 2022, 
    mileage: 15, 
    fuel: 'Електро', 
    price: 40000, 
    currency: 'USD',
    location: 'Львів',
    images: [
      'https://images.unsplash.com/photo-1554844078-f24c7694d509?q=80&w=800',
      'https://images.unsplash.com/photo-1604134774138-1e4fac66b36b?q=80&w=800'
    ]
  },
  { 
    id: 3, 
    brand: 'BMW', 
    model: 'X5', 
    year: 2019, 
    mileage: 80, 
    fuel: 'Бензин', 
    price: 45000, 
    currency: 'USD',
    location: 'Одеса',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800'
    ]
  },
]);

function handleFilter() {
  toast.info('(Симуляція) Застосовуємо фільтри...');
  console.log('Фільтри:', filters.value);
}
</script>

<style scoped>
/* --- 1. Фон та Контейнер --- */
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

/* --- 2. Макет сторінки --- */
.page-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
}
@media (min-width: 992px) {
  .page-layout {
    /* 1 колонка для фільтра, 3 для контенту */
    grid-template-columns: 1fr 3fr; 
  }
}

/* --- 3. Фільтр (Стилі з вашого проекту) --- */
.filter-card {
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 30px;
  position: sticky;
  top: 100px; /* Прилипає під хедером */
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

/* --- ДОДАНО СТИЛІ ДЛЯ SELECT (з вашого CreateListingView) --- */
.form-group select {
  display: block; width: 100%; height: 45px;
  padding: 0 12px; border-radius: 3px;
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555;
  font-size: 14px; font-weight: 300;
  color: #fff; box-sizing: border-box;
  
  /* Стрілка */
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
/* --- КІНЕЦЬ ДОДАНИХ СТИЛІВ --- */

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

/* --- 
 * 4. ОНОВЛЕНИЙ СПИСОК РЕЗУЛЬТАТІВ 
 * Тепер це '.results-list'
 --- */
.results-list {
  display: flex; /* Використовуємо flex */
  flex-direction: column; /* Складаємо картки вертикально */
  gap: 25px; /* Відступ між картками */
}

.no-results {
  text-align: center;
  padding: 40px;
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}
</style>