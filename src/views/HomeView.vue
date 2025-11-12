<template>
  <div class="home-page">
    <section 
      class="hero-section" 
      :style="{ backgroundImage: 'url(' + currentCarImage + ')' }"
    >
      <div class="container hero-container">
        
        <div class="hero-content">
          <span class="hero-subtitle">NEW IN STOCK</span>
          <h1 class="hero-title">Upgrade Your Driving Experience</h1>
          <div class="hero-buttons">
            <a href="#" class="btn btn-primary">Discover More</a>
            <a href="#" class="btn btn-secondary">Meet Horizon GT</a>
          </div>
        </div>

        <div class="hero-form">
          <h2>Find Your Ride</h2>
          <form @submit.prevent="handleSearch">
            <div class="form-group">
              <label for="brand">BRAND</label>
              <select id="brand" v-model="searchFilters.brand">
                <option value="">Brand*</option>
                <option value="Audi">Audi</option>
                <option value="BMW">BMW</option>
                <option value="Tesla">Tesla</option>
              </select>
            </div>
            <div class="form-group">
              <label for="model">MODEL</label>
              <select id="model" v-model="searchFilters.model">
                <option value="">Model*</option>
                </select>
            </div>
            <div class="form-group">
              <label for="type">TYPE</label>
              <select id="type" v-model="searchFilters.type">
                <option value="">Type*</option>
                <option value="Дизель">Дизель</option>
                <option value="Бензин">Бензин</option>
                <option value="Електро">Електро</option>
              </select>
            </div>
            <button type="submit" class="btn-submit">Get Started</button>
          </form>
        </div>

      </div>
    </section>
    
    <section >
        
    </section>

    <button class="fab-sell-car" @click="handleSellClick">
      Продати авто +
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/store/auth';
import { useToast } from 'vue-toastification';

import carImage1 from '@/assets/car-header1.jpg';
import carImage2 from '@/assets/car-header2.jpg';

// --- Ініціалізація ---
const router = useRouter();
const toast = useToast();
const { isAuthenticated } = useAuth();

// --- Логіка фону (без змін) ---
const carImages = [ carImage1, carImage2 ];
const currentCarImage = ref(carImages[0]); 

 setInterval(() => {
  const currentIndex = carImages.indexOf(currentCarImage.value);
  const nextIndex = (currentIndex + 1) % carImages.length;
   currentCarImage.value = carImages[nextIndex];
   }, 5000);

// --- ЛОГІКА ДЛЯ ФОРМИ ПОШУКУ ---
const searchFilters = ref({
  brand: '',
  model: '',
  type: ''
});

function handleSearch() {
  const query = {};
  if (searchFilters.value.brand) {
    query.brand = searchFilters.value.brand;
  }
  if (searchFilters.value.model) {
    query.model = searchFilters.value.model;
  }
  if (searchFilters.value.type) {
    query.fuel = searchFilters.value.type; 
  }
  router.push({ path: '/listings', query: query });
}

// --- ЛОГІКА ДЛЯ КНОПКИ "ПРОДАТИ" ---
function handleSellClick() {
  if (isAuthenticated.value) {
      router.push('/create-listing');
  } else {
    toast.warning('Будь ласка, увійдіть, щоб продати авто.');
    router.push('/login');
  }
}

</script>

<style scoped>
/* (Всі стилі .home-page, .hero-section і т.д. - без змін) */
.home-page {
  width: 100%;
  margin: 0;
}
.hero-section {
  min-height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: white;
  position: relative;
  padding-top: 5px;
  padding-bottom: 5px;
  transition: background-image 0.7s ease-in-out;
}
.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0px;
  position: relative;
  z-index: 1;
}
.hero-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}
.hero-content {
  position: relative;
  z-index: 1;
  text-align: left;
  flex-basis: 55%;
}
.hero-subtitle {
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
}
.hero-content h1, .hero-title {
  font-size: 56px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 30px;
  line-height: 1.2;
}
.hero-content p {
  font-size: 20px;
}
.hero-buttons {
  display: flex;
  gap: 15px;
}
.hero-buttons .btn {
  padding: 15px 30px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
}
.btn-primary {
  background: #fff;
  color: #000;
}
.btn-primary:hover {
  background: #eee;
}
.btn-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
}
.btn-secondary:hover {
  background: #fff;
  color: #000;
}
.hero-form {
  flex-basis: 27%;
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(5px);
  padding: 30px;
  border-radius: 8px;
  color: #fff;
  position: relative;
  z-index: 1;
}
.hero-form h2 {
  font-size: 32px;
  margin-bottom: 20px;
  text-align: center;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

/*
 * 🎨 ОНОВЛЕННЯ СТИЛІВ: Додано 'background-image' (стрілка)
 */
.form-group select {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #555;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  
  /* --- ДОДАНО СТРІЛКУ (з інших ваших компонентів) --- */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
}

.form-group select option {
  background: #333;
  color: #fff;
}
.btn-submit {
  width: 100%;
  padding: 15px;
  background: #cc0000;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  text-transform: uppercase;
}
.btn-submit:hover {
  background: #aa0000;
}

/* === МОБИЛЬНАЯ ВЕРСИЯ (без змін) === */
@media screen and (max-width: 768px) {
  .hero-section {
    padding-top: 100px;
    padding-bottom: 50px;
  }
.container {
    padding: 0 20px;
  }
 .hero-container {
    flex-direction: column;
    gap: 40px;
  }
  .hero-content {
    flex-basis: auto;
    text-align: center;
  }
  .hero-content h1, .hero-title {
    font-size: 36px;
  }
  .hero-buttons {
    justify-content: center;
  }
  .hero-form {
    flex-basis: auto;
    width: 100%; 
  }
} 
/* === КІНЕЦЬ @media === */


/* * 🎨 ОНОВЛЕННЯ 3: СТИЛІ КНОПКИ "ПРОДАТИ"
 * (Тепер вони знаходяться ЗЗОВНІ @media-запиту)
 */
.fab-sell-car {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000; 
  
  background: #cc0000;
  color: #fff;
  border: none;
  border-radius: 50px; 
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  padding: 15px 30px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}
.fab-sell-car:hover {
  background: #aa0000;
  transform: translateY(-2px); 
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}
</style>