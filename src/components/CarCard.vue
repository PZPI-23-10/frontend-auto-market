<template>
  <!-- 
    Картка все ще "скляна", але тепер з горизонтальним макетом.
    Вона адаптивна: на мобільних фото буде зверху, текст знизу.
  -->
  <div class="car-card" @mouseenter="pauseAutoplay" @mouseleave="startAutoplay">
    
    <!-- ЛІВА ЧАСТИНА: КАУСЕЛЬ ЗОБРАЖЕНЬ -->
    <div class="card-image-wrapper">
      
      <!-- 
        Ми показуємо поточне зображення, 
        яке контролюється `currentImageIndex` 
      -->
      <img 
        :src="currentImageUrl || 'https://via.placeholder.com/400x300?text=No+Photo'" 
        alt="Car image"
        @click="goToDetails" 
      >
      
      <div class="price-tag">
        {{ formattedPrice }}
      </div>
      
      <!-- Кнопки каруселі (з'являються, якщо фото > 1) -->
      <template v-if="listing.images && listing.images.length > 1">
        <button class="carousel-btn prev" @click.stop="prevImage">
          &#10094;
        </button>
        <button class="carousel-btn next" @click.stop="nextImage">
          &#10095;
        </button>
      </template>

    </div>
    
    <!-- ПРАВА ЧАСТИНА: ІНФОРМАЦІЯ -->
    <div class="card-content">
      <h3 class="card-title" @click="goToDetails">
        {{ listing.brand }} {{ listing.model }}
      </h3>
      <p class="card-year-location">
        {{ listing.year }} - {{ listing.location }}
      </p>
      
      <!-- Характеристики -->
      <div class="specs-horizontal">
        <div class="spec-item">
          <strong>Пробіг:</strong> {{ listing.mileage }} тис. км
        </div>
        <div class="spec-item">
          <strong>Паливо:</strong> {{ listing.fuel }}
        </div>
        <!-- 
          Тут можна додати більше характеристик, 
          наприклад, "Коробка передач", "Привід" і т.д.
        -->
      </div>
      
      <!-- (МОК) Кнопка "Зберегти" (сердечко) -->
      <button class="favorite-btn" @click.stop="toggleFavorite">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'; // <--- Додано onMounted, onUnmounted
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const props = defineProps({
  listing: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const toast = useToast();

// --- ЛОГІКА КАРУСЕЛІ ---
const currentImageIndex = ref(0);
const autoplayInterval = ref(null); // <--- Для зберігання ID інтервалу
const autoplayTime = 3000; // 3 секунди

// Перевіряємо, чи є масив 'images' і чи він не порожній
const hasImages = computed(() => 
  props.listing.images && props.listing.images.length > 0
);

// 'computed' для поточного URL зображення
const currentImageUrl = computed(() => {
  if (hasImages.value) {
    return props.listing.images[currentImageIndex.value];
  }
  // Заглушка, якщо `mainImage` теж немає
  return props.listing.mainImage || null;
});

function nextImage() {
  if (!hasImages.value) return;
  currentImageIndex.value = (currentImageIndex.value + 1) % props.listing.images.length;
}

function prevImage() {
  if (!hasImages.value) return;
  currentImageIndex.value = 
    (currentImageIndex.value - 1 + props.listing.images.length) % props.listing.images.length;
}

// --- НОВА ЛОГІКА АВТОПРОКРУТКИ ---
function startAutoplay() {
  // Запускаємо, тільки якщо фото > 1 і таймер ще не запущено
  if (hasImages.value && !autoplayInterval.value) { 
    autoplayInterval.value = setInterval(nextImage, autoplayTime);
  }
}

function pauseAutoplay() {
  clearInterval(autoplayInterval.value);
  autoplayInterval.value = null;
}

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  pauseAutoplay(); // Очищуємо таймер при видаленні компонента
});
// ---

const formattedPrice = computed(() => {
  if (!props.listing || typeof props.listing.price !== 'number') return 'N/A';
  return `${props.listing.price.toLocaleString('en-US')} ${props.listing.currency}`;
});

function goToDetails() {
  router.push(`/listing/${props.listing.id}`);
}

function toggleFavorite() {
  // (МОК)
  toast.info('Оголошення додано в "Обране" (симуляція)');
}
</script>

<style scoped>
.car-card {
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  overflow: hidden;
  transition: all 0.3s ease;
  
  /* * ГОЛОВНА ЗМІНА: 
   * По замовчуванню (мобілка) - вертикально
   */
  display: flex;
  flex-direction: column;
}

/* * На екранах > 768px - горизонтально
 */
@media (min-width: 768px) {
  .car-card {
    flex-direction: row;
    height: 220px; /* Фіксована висота для горизонтальної картки */
  }
}

.car-card:hover {
  border-color: rgba(255, 215, 0, 0.5);
}

/* --- 1. ЛІВА ЧАСТИНА (КАРУСЕЛЬ) --- */
.card-image-wrapper {
  position: relative;
  width: 100%; /* На мобілці - вся ширина */
  height: 200px;
}
@media (min-width: 768px) {
  .card-image-wrapper {
    width: 300px; /* На десктопі - фіксована ширина */
    height: 100%; /* На всю висоту картки */
    flex-shrink: 0;
  }
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.price-tag {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: #cc0000;
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  z-index: 2;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 20px;
  cursor: pointer;
  z-index: 2;
  
  /* --- ОНОВЛЕНІ СТИЛІ СТРІЛОК --- */
  opacity: 0; /* 1. Приховані за замовчуванням */
  transition: opacity 0.3s ease, background 0.2s; /* 2. Анімація появи */
}

/* 3. Показуємо при наведенні на фото */
.card-image-wrapper:hover .carousel-btn {
  opacity: 1;
}

.carousel-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}
.carousel-btn.prev {
  left: 10px;
}
.carousel-btn.next {
  right: 10px;
}

/* --- 2. ПРАВА ЧАСТИНА (КОНТЕНТ) --- */
.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1; /* Займає весь доступний простір */
  position: relative;
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 5px 0;
  cursor: pointer;
}
.card-title:hover {
  color: #ffd700;
}
.card-year-location {
  font-size: 14px;
  color: #ccc;
  margin: 0 0 20px 0;
}

.specs-horizontal {
  display: flex;
  flex-direction: column; /* На мобілці - одне під одним */
  gap: 10px;
  margin-top: auto; /* * Притискає цей блок до низу картки */
}
@media (min-width: 768px) {
  .specs-horizontal {
    flex-direction: row; /* На десктопі - в ряд */
    gap: 20px;
  }
}

.spec-item {
  font-size: 14px;
  color: #ccc;
}
.spec-item strong {
  color: #fff;
  font-weight: 500;
}

.favorite-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
}
.favorite-btn svg {
  stroke: #fff;
  fill: none;
  transition: all 0.3s;
}
.favorite-btn:hover svg {
  stroke: #cc0000;
  fill: #cc0000;
}
</style>