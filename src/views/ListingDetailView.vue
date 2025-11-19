<template>
  <div class="detail-view">
    <div class="container">
      
      <div v-if="isLoading || !listing" class="loading-card">
        <div v-if="isLoading">
          <div class="spinner"></div>
          <h2>{{ t('listingDetail.loading') }}</h2>
        </div>
        <h2 v-if="!isLoading && !listing">{{ t('listingDetail.notFound') }}</h2>
      </div>

      <div v-if="!isLoading && listing" class="page-layout">
        
        <main class="main-content">
          
          <section class="form-card">
            <h2>{{ listing.brand }} {{ listing.model }} ({{ listing.year }})</h2>
            
            <div class="photo-gallery">
              <div class="main-image">
                <div 
                  class="blur-background"
                  :style="{ backgroundImage: `url(${selectedImageUrl || placeholderImage})` }"
                ></div>

                <img 
                  :src="selectedImageUrl" 
                  :alt="t('listingDetail.mainPhotoAlt')"
                  @error="$event.target.src = placeholderImage"
                  @click="openModal(selectedImageUrl)"
                >
              </div>

              <div class="thumbnails" v-if="galleryImages.length > 1">
                <div 
                  v-for="(img, index) in galleryImages" 
                  :key="index"
                  class="thumb-item"
                  :class="{ active: index === selectedImageIndex }"
                  @click="selectImage(index)"
                >
                  <img 
                    :src="img" 
                    :alt="t('listingDetail.thumbAlt')"
                    @error="$event.target.src = placeholderImage"
                  >
                </div>
              </div>
            </div>
          </section>

          <div class="specs-desc-layout">
            
            <div class="specs-column">
              
              <div class="filter-card specs-card">
                <h2>{{ t('listingDetail.specsTitle') }}</h2>
                <ul class="specs-list">
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                      {{ t('fields.brand') }}
                    </span>
                    <strong>{{ listing.brand }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16.94V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.06Z"/><path d="M20 17h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v.06"/><path d="M19 12V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                      {{ t('fields.model') }}
                    </span>
                    <strong>{{ listing.model }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {{ t('fields.year') }}
                    </span>
                    <strong>{{ listing.year }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0"/><path d="m14 14-2-2-2 2"/><path d="M12 12v-6"/></svg>
                      {{ t('fields.mileage') }}
                    </span>
                    <strong>{{ t('carCard.mileage', { km: listing.mileage }) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 11h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1Z"/><path d="M18 11V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="M6 11h4"/><path d="M6 15h2"/></svg>
                      {{ t('fields.fuel') }}
                    </span>
                    <strong>{{ t('options.fuel.' + listing.fuel) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM15 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM5 16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM15 16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM9 11v-1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M12 9v6m-3 2v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1"/></svg>
                      {{ t('fields.transmission') }}
                    </span>
                    <strong>{{ t('options.transmission.' + listing.transmission) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 18.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-4.37c0-.3-.1-.59-.28-.84l-1.44-2A.5.5 0 0 1 4.5 10.5h15a.5.5 0 0 1 .22.49l-1.44 2c-.18.25-.28.54-.28.84Z"/><path d="M4 14.13V10.5a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 10.5v3.63"/><circle cx="6.5" cy="18.5" r="0.5"/><circle cx="17.5" cy="18.5" r="0.5"/></svg>
                      {{ t('fields.bodyType') }}
                    </span>
                    <strong>{{ t('options.bodyType.' + listing.bodyType) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="M5 15v-4.32a2 2 0 0 1 1.18-1.83l6-3.46a2 2 0 0 1 1.64 0l6 3.46A2 2 0 0 1 21 10.68V15"/><path d="M5 18v-5h14v5"/></svg>
                      {{ t('fields.driveTrain') }}
                    </span>
                    <strong>{{ t('options.driveTrain.' + listing.driveTrain) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 18H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/><path d="M18 22V10"/><path d="M14 22V10"/><path d="M6 14H4"/><path d="M6 10H4"/><path d="M10 6H8"/><path d="M16 6h-2"/></svg>
                      {{ t('fields.engineSize') }}
                    </span>
                    <strong>{{ t('carCard.engineSize', { size: listing.engineSize }) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 6-6"/><path d="M12 14c-1.88 1.88-5.12 1.88-7 0 1.88-1.88 1.88-5.12 0-7 1.88 1.88 5.12 1.88 7 0 1.88 1.88 1.88 5.12 0 7Z"/><path d="m14 12-6 6"/><path d="M14 12c1.88-1.88 5.12-1.88 7 0-1.88 1.88-1.88 5.12 0 7-1.88-1.88-5.12-1.88-7 0-1.88-1.88-1.88-5.12 0-7Z"/></svg>
                      {{ t('fields.color') }}
                    </span>
                    <strong>{{ t('options.color.' + listing.color) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 3 8 21"/><path d="M16 3l-2.2 1.8"/><path d="m14 21 2-18"/><path d="M3 10h18"/><path d="M3 14h18"/></svg>
                      {{ t('fields.metallic') }}
                    </span>
                    <strong>{{ listing.metallic ? t('common.yes') : t('common.no') }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.2 0 .5 0 .7 0 1.4-1.2 2.1-2.8 2.1-4.4 0-3-2.5-5.4-5.5-5.4-1.6 0-3.1.7-4.1 1.9"/><path d="M22 12c0-1.6-.7-3.1-1.9-4.1-1.1-1-2.6-1.6-4.1-1.6-3 0-5.4 2.4-5.4 5.4 0 1.6.7 3.1 1.9 4.1.1 0 .3.1.5.1 5.5 0 10-4.5 10-10Z"/></svg>
                      {{ t('fields.paintwork') }}
                    </span>
                    <strong>{{ t('options.paint.' + listing.paintwork) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      {{ t('fields.technicalCondition') }}
                    </span>
                    <strong>{{ t('options.techState.' + listing.technicalCondition) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 2.2 14 10.9c.4 1 .1 2.2-.7 3l-2.4 2.4c-.8.8-2 1.2-3.2 1.2H3"/><path d="m3 11 8 8"/><path d="M5 19h1"/><path d="M14 11h-4"/><path d="m18 15-4-4"/><path d="M18 11 14 7"/><path d="M18 19h-1.3c-1.2 0-2.4-.4-3.2-1.2L11 15.3c-.7-.8-1-1.9-.7-3l3.7-8.7"/><path d="M17 3 14 7"/><path d="M21 3l-1.6 1.6"/></svg>
                      {{ t('fields.inAccident') }}
                    </span>
                    <strong>{{ listing.inAccident ? t('common.yes') : t('common.no') }}</strong>
                  </li>
                </ul>
              </div>

              <div class="filter-card comfort-card">
                <h2>{{ t('createListing.steps.comfort') }}</h2>
                <ul class="specs-list comfort-list">
                  <li :class="{ 'is-missing': !listing.comfort.airConditioning }">
                    <span>
                      <svg v-if="listing.comfort.airConditioning" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('createListing.step3.ac') }}
                    </span>
                  </li>
                  <li :class="{ 'is-missing': !listing.comfort.climateControl }">
                    <span>
                      <svg v-if="listing.comfort.climateControl" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('createListing.step3.climate') }}
                    </span>
                  </li>
                  <li :class="{ 'is-missing': !listing.comfort.heatedSeats }">
                    <span>
                      <svg v-if="listing.comfort.heatedSeats" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('createListing.step3.heatedSeats') }}
                    </span>
                  </li>
                  <li :class="{ 'is-missing': !listing.comfort.rearCamera }">
                    <span>
                      <svg v-if="listing.comfort.rearCamera" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('createListing.step3.rearCamera') }}
                    </span>
                  </li>
                  <li :class="{ 'is-missing': !listing.comfort.parkingSensors }">
                    <span>
                      <svg v-if="listing.comfort.parkingSensors" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('createListing.step3.parkingSensors') }}
                    </span>
                  </li>
                  <li :class="{ 'is-missing': !listing.comfort.sunroof }">
                    <span>
                      <svg v-if="listing.comfort.sunroof" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('createListing.step3.sunroof') }}
                    </span>
                  </li>
                </ul>
                <p v-if="!hasComfortOptions" class="no-comfort">
                   -- Опції не вказані --
                </p>
              </div>
            </div>

            <div class="desc-column">
              <section class="form-card">
                <h2>{{ t('listingDetail.descriptionTitle') }}</h2>
                <p class="description-text">
                  {{ listing.description || t('listingDetail.noDescription') }}
                </p>
              </section>
            </div>
            
          </div>

        </main>
        
        <aside class="sidebar">
          
          <div class="filter-card">
            <h2 class="price">{{ formattedPrice }}</h2>
            <p class="location">{{ listing.location }}</p>
          </div>
          
          <div class="filter-card seller-card">
            <h4>{{ t('listingDetail.sellerTitle') }}</h4>
            <div class="seller-info">
              <img class="seller-avatar" :src="seller.avatarUrl || defaultAvatar" :alt="t('listingDetail.sellerAvatarAlt')">
              <div class="seller-details">
                <strong>{{ seller.name }}</strong>
              </div>
            </div>
            <div class="seller-contacts">
              <div class="contact-item">
                <span>{{ t('listingDetail.email') }}:</span>
                <a :href="`mailto:${seller.email}`">{{ seller.email }}</a>
              </div>
              <div class="contact-item">
                <span>{{ t('listingDetail.phone') }}:</span>
                <a :href="`tel:${seller.phone}`">{{ seller.phone }}</a>
              </div>
            </div>
            <button class="btn-secondary message-btn">
              {{ t('listingDetail.sendMessage') }}
            </button>
          </div>
          
        </aside>
      </div>
    </div>
    
    <div v-if="isModalOpen" class="image-modal-overlay" @click="closeModal">
      <div class="image-modal-content" @click.stop> 
        <button class="modal-close-btn" @click="closeModal">&times;</button>
        <img :src="currentImageInModal" :alt="t('listingDetail.modalAlt')" class="modal-image" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router'; 
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import defaultAvatar from '@/assets/default-avatar.png'; 
import placeholderImage from '@/assets/no-photo.png'; 

const route = useRoute();
const toast = useToast();
const { t, locale } = useI18n();

const API_BASE = 'https://backend-auto-market.onrender.com/api';

const isLoading = ref(true);
const listing = ref(null); 

const seller = ref({
  name: 'Завантаження...',
  email: '',
  phone: '',
  avatarUrl: null
});

function toCamelCase(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}
function mapApiToDetail(apiItem) {
  // Логіка кольорів: якщо прийшов HEX, шукаємо його, якщо текст - lowercase
  let colorKey = apiItem.colorHex || 'other';
  if (!colorKey.startsWith('#')) {
      colorKey = colorKey.toLowerCase();
  }

  // Логіка приводу
  const driveTrainKey = apiItem.driveType?.name 
    ? apiItem.driveType.name.toLowerCase() 
    : 'unknown'; 

  // Логіка стану фарби
  let paintKey = apiItem.paintwork || 'used';
  paintKey = paintKey.charAt(0).toLowerCase() + paintKey.slice(1);

  // === ВИПРАВЛЕННЯ ФОТО (Початок) ===
  let processedImages = [placeholderImage]; // Дефолтне фото

  // Перевіряємо і 'photos' (новий стандарт), і 'photoUrls' (старий)
  const rawPhotos = apiItem.photos || apiItem.photoUrls;

  if (Array.isArray(rawPhotos) && rawPhotos.length > 0) {
    processedImages = rawPhotos.map(item => {
        // Якщо це об'єкт { id, url }, беремо url. Якщо рядок - залишаємо як є.
        return (typeof item === 'object' && item !== null) ? item.url : item;
    });
  }
  // === ВИПРАВЛЕННЯ ФОТО (Кінець) ===

  return {
    id: apiItem.id,
    userId: apiItem.userId, 
    brand: apiItem.brand?.name || 'Unknown',
    model: apiItem.model?.name || 'Unknown',
    year: apiItem.year,
    mileage: apiItem.mileage,
    price: apiItem.price,
    currency: apiItem.currency || 'USD',
    location: apiItem.city?.name || apiItem.region?.name || 'Україна',
    
    // Технічні характеристики
    fuel: (apiItem.fuelType?.name || '').toLowerCase(),
    transmission: (apiItem.gearType?.name || '').toLowerCase(),
    bodyType: (apiItem.bodyType?.name || '').toLowerCase(),
    driveTrain: driveTrainKey,
    engineSize: apiItem.engineSize || 0,
    color: colorKey,
    
    // Стан
    metallic: apiItem.isMetallic || false,
    inAccident: apiItem.hasAccident || false, 
    paintwork: paintKey, 
    technicalCondition: (apiItem.condition?.name || 'undamaged').toLowerCase().replace(/\s+/g, '_'),

    // Медіа (Використовуємо оброблений масив)
    images: processedImages, 
    description: apiItem.description || '',

    // Комфорт
    comfort: {
      airConditioning: apiItem.comfort?.airConditioning || false,
      climateControl: apiItem.comfort?.climateControl || false,
      heatedSeats: apiItem.comfort?.heatedSeats || false,
      rearCamera: apiItem.comfort?.rearCamera || false,
      parkingSensors: apiItem.comfort?.parkingSensors || false,
      sunroof: apiItem.comfort?.sunroof || false
    }
  };
}

onMounted(async () => {
  isLoading.value = true;
  const carId = route.params.id;

  try {
    // 1. Отримуємо ОГОЛОШЕННЯ
    const response = await axios.get(`${API_BASE}/Listing/${carId}`);
    
    if (response.data) {
      listing.value = mapApiToDetail(response.data);
      
      // Заповнюємо телефон з оголошення як резервний варіант
      if (response.data.number) {
          seller.value.phone = response.data.number;
      }

      // 2. Отримуємо ПРОДАВЦЯ
      // Якщо в оголошенні є userId, робимо запит на профіль
      if (listing.value.userId) {
        try {
          // ВИПРАВЛЕННЯ ТУТ:
          // Замість .../Profile/3 робимо .../Profile?userId=3
          const profileRes = await axios.get(`${API_BASE}/Profile`, { 
            params: { 
              userId: listing.value.userId // Переконайтеся, що параметр називається саме userId (або id)
            } 
          });
          
          if (profileRes.data) {
             const p = profileRes.data;
             
             // Формуємо гарне ім'я
             seller.value.name = p.firstName 
                 ? `${p.firstName} ${p.lastName || ''}` 
                 : (p.userName || 'Продавець');
                 
             seller.value.email = p.email || 'Приховано';
             
             // Якщо у профілі є телефон - він пріоритетний
             if (p.phoneNumber) {
                 seller.value.phone = p.phoneNumber;
             }
             
             seller.value.avatarUrl = p.avatarUrl || null;
          }
        } catch (profileError) {
          console.warn("Не вдалося отримати профіль продавця (використовуємо дефолт):", profileError);
        }
      }

      toast.success(t('listingDetail.loadSuccess'));
    } 
  } catch (error) {
    console.error("API Error:", error);
    toast.error(t('listingDetail.loadError'));
    listing.value = null;
  } finally {
    isLoading.value = false;
  }
});

const formattedPrice = computed(() => {
  if (!listing.value) return '';
  return `${listing.value.price.toLocaleString(locale.value)} ${listing.value.currency}`;
});
const hasComfortOptions = computed(() => {
  if (!listing.value || !listing.value.comfort) return false;
  return Object.values(listing.value.comfort).some(value => value === true);
});
const selectedImageIndex = ref(0);
const galleryImages = computed(() => {
  if (listing.value && listing.value.images && listing.value.images.length > 0) {
    return listing.value.images;
  }
  return [placeholderImage];
});
const selectedImageUrl = computed(() => galleryImages.value[selectedImageIndex.value]);
function selectImage(index) { selectedImageIndex.value = index; }
const isModalOpen = ref(false);
const currentImageInModal = ref(''); 
function openModal(imageSrc) {
  currentImageInModal.value = imageSrc;
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden'; 
}
function closeModal() {
  isModalOpen.value = false;
  currentImageInModal.value = '';
  document.body.style.overflow = '';
}
</script>
<style scoped>
/* --- ГЛОБАЛЬНИЙ КОНТЕЙНЕР СТОРІНКИ --- */
.detail-view {
  background-image: url('@/assets/car-header1.jpg'); 
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Паралакс ефект */
  min-height: 100vh;
  position: relative;
  padding: 100px 20px 40px 20px;
  font-family: 'Open Sans', sans-serif;
  color: #fff;
}

/* Темне затемнення фону */
.detail-view::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75); /* Трохи темніше для кращого контрасту */
  z-index: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

/* --- ЗАГАЛЬНІ СТИЛІ КАРТОК --- */
.form-card, 
.filter-card, 
.loading-card {
  background-color: rgba(30, 30, 30, 0.7); /* Напівпрозорий фон */
  border-radius: 12px;
  backdrop-filter: blur(12px); /* Ефект матового скла */
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 30px;
  margin-bottom: 20px;
}

.form-card h2, 
.filter-card h2,
.comfort-card h2 {
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 10px;
  font-weight: 600;
  font-size: 22px;
  letter-spacing: 0.5px;
}

/* --- МАКЕТ СТОРІНКИ (GRID) --- */
.page-layout {
  display: grid;
  grid-template-columns: 1fr; /* Мобільна версія: 1 колонка */
  gap: 25px;
}

@media (min-width: 992px) {
  .page-layout {
    grid-template-columns: 3fr 1fr; /* Десктоп: Контент (широко) | Сайдбар (вузько) */
    align-items: start;
  }
}

/* --- ГАЛЕРЕЯ (MAIN IMAGE + BLUR) --- */
.main-image {
  position: relative;
  width: 100%;
  height: 500px; /* Фіксована висота на десктопі */
  border-radius: 12px;
  overflow: hidden; /* Обрізаємо розмиття, що виходить за межі */
  background: #0e0e0e;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #333;
}

.blur-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: blur(30px) brightness(0.7); /* Сильне розмиття + затемнення */
  transform: scale(1.2); /* Збільшуємо, щоб прибрати білі краї блюру */
  z-index: 0;
}

.main-image img {
  position: relative;
  z-index: 1; /* Фото поверх розмиття */
  width: 100%;
  height: 100%;
  object-fit: contain; /* Вписуємо фото повністю */
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.main-image:hover img {
  transform: scale(1.02); /* Легкий зум при наведенні */
}

/* Мініатюри */
.thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.thumb-item {
  width: 100px;
  height: 70px;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.thumb-item:hover {
  opacity: 1;
  border-color: #ffd700;
}

.thumb-item.active {
  opacity: 1;
  border-color: #cc0000; /* Активний колір */
  box-shadow: 0 0 10px rgba(204, 0, 0, 0.5);
}

.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .main-image {
    height: 300px; /* Менша висота для мобільних */
  }
  .thumb-item {
    width: 80px;
    height: 60px;
  }
}

/* --- ХАРАКТЕРИСТИКИ + ОПИС (GRID) --- */
.specs-desc-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  align-items: start;
  margin-top: 25px;
}

@media (min-width: 768px) {
  .specs-desc-layout {
    grid-template-columns: 1fr 1fr; /* Дві колонки: Характеристики | Комфорт+Опис */
  }
}

/* Список характеристик */
.specs-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.specs-list li {
  display: grid;
  grid-template-columns: auto 1fr; /* Іконка+Назва | Значення */
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 14px;
}

.specs-list li:last-child {
  border-bottom: none;
}

.specs-list li span {
  color: #aaa;
  display: flex;
  align-items: center;
  gap: 10px; /* Відступ іконки від тексту */
}

.specs-list li strong {
  color: #fff;
  font-weight: 600;
  text-align: right; /* Значення праворуч */
}

.specs-list li svg {
  width: 18px;
  height: 18px;
  stroke: #ffd700; /* Золоті іконки */
  stroke-width: 2;
}

/* --- СПИСОК КОМФОРТУ --- */
.comfort-list li {
  display: flex; /* Тут краще Flex */
  justify-content: flex-start;
  padding: 8px 0;
  border-bottom: none;
}

.comfort-list li .comfort-icon {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  flex-shrink: 0;
}

.comfort-list li .comfort-icon.check { stroke: #4cd137; } /* Зелений */
.comfort-list li .comfort-icon.cross { stroke: #e84118; } /* Червоний */

.comfort-list li.is-missing {
  opacity: 0.4; /* Тьмяний для відсутніх опцій */
  text-decoration: line-through; /* Закреслення (опціонально) */
}

.no-comfort {
  text-align: center;
  color: #777;
  font-style: italic;
  padding: 20px;
}

/* --- ОПИС --- */
.description-text {
  font-size: 15px;
  line-height: 1.8;
  color: #e0e0e0;
  white-space: pre-wrap; /* Зберігає абзаци */
}

/* --- САЙДБАР (ЦІНА ТА ПРОДАВЕЦЬ) --- */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 20px; /* Прилипання при скролі */
}

.price {
  font-size: 32px;
  font-weight: 800;
  color: #ffd700;
  margin: 0;
  text-shadow: 0 2px 10px rgba(255, 215, 0, 0.2);
}

.location {
  font-size: 15px;
  color: #ccc;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Картка продавця */
.seller-card h4 {
  font-size: 14px;
  text-transform: uppercase;
  color: #888;
  letter-spacing: 1px;
  border-bottom: 1px solid #444;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.seller-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffd700;
}

.seller-details strong {
  display: block;
  font-size: 18px;
  color: #fff;
  margin-bottom: 4px;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px dashed rgba(255,255,255,0.1);
  font-size: 14px;
}

.contact-item span { color: #aaa; }
.contact-item a {
  color: #ffd700;
  text-decoration: none;
  font-weight: 600;
}

.message-btn {
  width: 100%;
  padding: 14px 0;
  border-radius: 6px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
  background-color: #cc0000;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background 0.3s;
}

.message-btn:hover {
  background-color: #ff0000;
  box-shadow: 0 4px 15px rgba(204, 0, 0, 0.4);
}

/* --- ЗАВАНТАЖЕННЯ --- */
.loading-card {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #ffd700;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* --- МОДАЛЬНЕ ВІКНО --- */
.image-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s;
}

.image-modal-content {
  position: relative;
  max-width: 95%;
  max-height: 95vh;
}

.modal-image {
  max-width: 100%;
  max-height: 90vh;
  border-radius: 4px;
  box-shadow: 0 0 50px rgba(0,0,0,0.8);
}

.modal-close-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: transparent;
  color: #fff;
  border: none;
  font-size: 40px;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>