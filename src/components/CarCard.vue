<template>
  <div class="car-card" @mouseenter="pauseAutoplay" @mouseleave="startAutoplay">
    
    <div class="card-image-wrapper">
      
      <img 
        :src="currentImageUrl" 
        :alt="t('carCard.imageAlt')"
        @click="goToDetails"
        @error="$event.target.src = placeholderImage" 
      >
      
      <div class="price-tag">
        {{ formattedPrice }}
      </div>
      
      <template v-if="listing.images && listing.images.length > 1">
        <button class="carousel-btn prev" @click.stop="prevImage">
          &#10094;
        </button>
        <button class="carousel-btn next" @click.stop="nextImage">
          &#10095;
        </button>
      </template>

    </div>
    
    <div class="card-content">
      <h3 class="card-title" @click="goToDetails">
        {{ listing.brand }} {{ listing.model }}
      </h3>
      
      <p class="card-location">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>{{ listing.location }}</span>
      </p>
      
      <div class="specs-horizontal">
        <div class="spec-item">
          <svg :title="t('fields.year')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>{{ listing.year }}</span>
        </div>
        <div class="spec-item">
          <svg :title="t('carCard.specMileage')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0"/><path d="m14 14-2-2-2 2"/><path d="M12 12v-6"/></svg>
          <span>{{ t('carCard.mileage', { km: listing.mileage }) }}</span>
        </div>
        <div class="spec-item">
          <svg :title="t('carCard.specFuel')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 11h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1Z"/><path d="M18 11V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="M6 11h4"/><path d="M6 15h2"/></svg>
          <span>{{ t('fuelTypes.' + listing.fuel) }}</span>
        </div>
        <div class="spec-item">
          <svg :title="t('carCard.specTransmission')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM15 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM5 16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM15 16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM9 11v-1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M12 9v6m-3 2v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1"/></svg>
          <span>{{ t('transmissionTypes.' + listing.transmission) }}</span>
        </div>
        <div class="spec-item">
          <svg :title="t('carCard.specBodyType')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 18.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-4.37c0-.3-.1-.59-.28-.84l-1.44-2A.5.5 0 0 1 4.5 10.5h15a.5.5 0 0 1 .22.49l-1.44 2c-.18.25-.28.54-.28.84Z"/><path d="M4 14.13V10.5a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 10.5v3.63"/><circle cx="6.5" cy="18.5" r="0.5"/><circle cx="17.5" cy="18.5" r="0.5"/></svg>
          <span>{{ t('bodyTypes.' + listing.bodyType) }}</span>
        </div>
        <div class="spec-item">
          <svg :title="t('carCard.specColor')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 6-6"/><path d="M12 14c-1.88 1.88-5.12 1.88-7 0 1.88-1.88 1.88-5.12 0-7 1.88 1.88 5.12 1.88 7 0 1.88 1.88 1.88 5.12 0 7Z"/><path d="m14 12-6 6"/><path d="M14 12c1.88-1.88 5.12-1.88 7 0-1.88 1.88-1.88 5.12 0 7-1.88-1.88-5.12-1.88-7 0-1.88-1.88-1.88-5.12 0-7Z"/></svg>
          <span>{{ t('colors.' + listing.color) }}</span>
        </div>
        <div class="spec-item">
          <svg :title="t('carCard.specDriveTrain')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="M5 15v-4.32a2 2 0 0 1 1.18-1.83l6-3.46a2 2 0 0 1 1.64 0l6 3.46A2 2 0 0 1 21 10.68V15"/><path d="M5 18v-5h14v5"/></svg>
          <span>{{ t('driveTrainTypes.' + listing.driveTrain) }}</span>
        </div>
        <div class="spec-item">
          <svg :title="t('carCard.specEngineSize')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/><path d="M18 22V10"/><path d="M14 22V10"/><path d="M6 14H4"/><path d="M6 10H4"/><path d="M10 6H8"/><path d="M16 6h-2"/></svg>
          <span>{{ t('carCard.engineSize', { size: listing.engineSize }) }}</span>
        </div>
        
      </div>
      
      <button 
        class="favorite-btn" 
        @click.stop="toggleFavorite"
        :title="t('carCard.toggleFavorite')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
// (Ваш <script setup> залишається без змін)
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import placeholderImage from '@/assets/no-photo.png';

const props = defineProps({
  listing: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const toast = useToast();
const { t, locale } = useI18n();

const currentImageIndex = ref(0);
const autoplayInterval = ref(null);
const autoplayTime = 3000;

const hasImages = computed(() => 
  props.listing.images && props.listing.images.length > 0
);

const currentImageUrl = computed(() => {
  if (hasImages.value) {
    return props.listing.images[currentImageIndex.value];
  }
  return placeholderImage;
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

function startAutoplay() {
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
  pauseAutoplay();
});

const formattedPrice = computed(() => {
  if (!props.listing || typeof props.listing.price !== 'number') return t('carCard.priceNA');
  return `${props.listing.price.toLocaleString(locale.value)} ${props.listing.currency}`;
});

function goToDetails() {
  router.push(`/listing/${props.listing.id}`);
}

function toggleFavorite() {
  toast.info(t('carCard.favoriteToast'));
}
</script>

<style scoped>
/* (Стилі .car-card, .card-image-wrapper, .price-tag, .carousel-btn - без змін) */
.car-card {
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}
@media (min-width: 768px) {
  .car-card {
    flex-direction: row;
    height: 220px;
  }
}
.car-card:hover {
  border-color: rgba(255, 215, 0, 0.5);
}
.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
}
@media (min-width: 768px) {
  .card-image-wrapper {
    width: 300px;
    height: 100%;
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
  opacity: 0;
  transition: opacity 0.3s ease, background 0.2s;
}
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

/* (Стилі .card-content, .card-title - без змін) */
.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
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

/* * ОНОВЛЕННЯ 3: Стилі для Розташування 
 */
.card-year-location {
  /* Це правило більше не використовується для розташування */
  font-size: 14px;
  color: #ccc;
  margin: 0 0 20px 0;
}
/* НОВИЙ СТИЛЬ для розташування (під заголовком) */
.card-location {
  font-size: 14px;
  color: #ccc;
  margin: 0 0 15px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}
.card-location svg {
  width: 14px;
  height: 14px;
  stroke: #ccc;
  flex-shrink: 0;
}
.specs-horizontal {
  display: flex;
  flex-direction: column; 
  gap: 10px;
  margin-top: auto; 
}
@media (min-width: 768px) {
  .specs-horizontal {
    flex-direction: row; 
    gap: 15px;
    flex-wrap: wrap; 
  }
}
.spec-item {
  display: flex;
  align-items: center; 
  font-size: 13px; 
  color: #ccc;
  gap: 8px;
}
.spec-item strong {
  color: #fff;
  font-weight: 500;
}
.spec-item svg {
  width: 16px;
  height: 16px;
  stroke: #ffd700; 
  flex-shrink: 0;
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