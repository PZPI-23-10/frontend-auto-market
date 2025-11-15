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
                <img 
                  :src="selectedImageUrl" 
                  :alt="t('listingDetail.mainPhotoAlt')"
                  @error="$event.target.src = placeholderImage"
                  @click="openModal(selectedImageUrl)"
                >
              </div>
              <div class="thumbnails">
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
                    <strong>{{ t('fuelTypes.' + listing.fuel) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM15 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM5 16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM15 16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM9 11v-1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M12 9v6m-3 2v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1"/></svg>
                      {{ t('fields.transmission') }}
                    </span>
                    <strong>{{ t('transmissionTypes.' + listing.transmission) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 18.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-4.37c0-.3-.1-.59-.28-.84l-1.44-2A.5.5 0 0 1 4.5 10.5h15a.5.5 0 0 1 .22.49l-1.44 2c-.18.25-.28.54-.28.84Z"/><path d="M4 14.13V10.5a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 10.5v3.63"/><circle cx="6.5" cy="18.5" r="0.5"/><circle cx="17.5" cy="18.5" r="0.5"/></svg>
                      {{ t('fields.bodyType') }}
                    </span>
                    <strong>{{ t('bodyTypes.' + listing.bodyType) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="M5 15v-4.32a2 2 0 0 1 1.18-1.83l6-3.46a2 2 0 0 1 1.64 0l6 3.46A2 2 0 0 1 21 10.68V15"/><path d="M5 18v-5h14v5"/></svg>
                      {{ t('fields.driveTrain') }}
                    </span>
                    <strong>{{ t('driveTrainTypes.' + listing.driveTrain) }}</strong>
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
                    <strong>{{ t('colors.' + listing.color) }}</strong>
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
                    <strong>{{ t('paintworkStates.' + listing.paintwork) }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      {{ t('fields.technicalCondition') }}
                    </span>
                    <strong>{{ t('technicalStates.' + listing.technicalCondition) }}</strong>
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
                <h2>{{ t('comfort.title') }}</h2>
                <ul class="specs-list comfort-list">
                  
                  <li :class="{ 'is-missing': !listing.comfort.airConditioning }">
                    <span>
                      <svg v-if="listing.comfort.airConditioning" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('comfort.airConditioning') }}
                    </span>
                  </li>
                  <li :class="{ 'is-missing': !listing.comfort.climateControl }">
                    <span>
                      <svg v-if="listing.comfort.climateControl" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('comfort.climateControl') }}
                    </span>
                  </li>
                  <li :class="{ 'is-missing': !listing.comfort.heatedSeats }">
                    <span>
                      <svg v-if="listing.comfort.heatedSeats" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('comfort.heatedSeats') }}
                    </span>
                  </li>
                  <li :class="{ 'is-missing': !listing.comfort.rearCamera }">
                    <span>
                      <svg v-if="listing.comfort.rearCamera" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('comfort.rearCamera') }}
                    </span>
                  </li>
                  <li :class="{ 'is-missing': !listing.comfort.parkingSensors }">
                    <span>
                      <svg v-if="listing.comfort.parkingSensors" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('comfort.parkingSensors') }}
                    </span>
                  </li>
                  <li :class="{ 'is-missing': !listing.comfort.sunroof }">
                    <span>
                      <svg v-if="listing.comfort.sunroof" class="comfort-icon check" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      <svg v-else class="comfort-icon cross" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      {{ t('comfort.sunroof') }}
                    </span>
                  </li>
                </ul>
                <p v-if="!hasComfortOptions" class="no-comfort">
                  {{ t('comfort.noOptions') }}
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
import defaultAvatar from '@/assets/default-avatar.png'; 
import placeholderImage from '@/assets/no-photo.png'; 

const route = useRoute();
const toast = useToast();
const { t, locale } = useI18n();

const isLoading = ref(true);
const listing = ref(null); 

const seller = ref({
  name: 'Олександр Іваненко',
  email: 'user@example.com',
  phone: '+380 99 123 4567',
  avatarUrl: null
});

// --- Логіка Галереї (без змін) ---
const selectedImageIndex = ref(0);
const galleryImages = computed(() => {
  if (listing.value && listing.value.images && listing.value.images.length > 0) {
    return listing.value.images;
  }
  return [placeholderImage];
});
const selectedImageUrl = computed(() => {
  return galleryImages.value[selectedImageIndex.value];
});
function selectImage(index) {
  selectedImageIndex.value = index;
}

// --- Логіка Модального вікна (без змін) ---
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

// ---
// (МОК) "База даних" (ОНОВЛЕНО З УСІМА ПОЛЯМИ)
// ---
const mockCars = [
    { 
      id: 1, brand: 'Audi', model: 'A6', year: 2020, mileage: 50, fuel: 'diesel', price: 35000, currency: 'USD', location: 'Київ', 
      transmission: 'automatic', bodyType: 'sedan', color: 'black', driveTrain: 'full', engineSize: 2.0, 
      metallic: true, inAccident: false, paintwork: 'like_new', technicalCondition: 'full',
      images: ['https://images.unsplash.com/photo-1541348263662-e56892d63df6?q=80&w=800', 'https://images.unsplash.com/photo-1612999332206-819194885c3b?q=80&w=800'], 
      description: 'Чудовий стан, повна комплектація, один власник.',
      comfort: { airConditioning: true, climateControl: true, heatedSeats: true, rearCamera: true, parkingSensors: true, sunroof: true }
    },
    { 
      id: 2, brand: 'Tesla', model: 'Model 3', year: 2022, mileage: 15, fuel: 'electric', price: 40000, currency: 'USD', location: 'Львів', 
      transmission: 'automatic', bodyType: 'sedan', color: 'white', driveTrain: 'full', engineSize: 0, 
      metallic: false, inAccident: false, paintwork: 'like_new', technicalCondition: 'full',
      images: ['https://images.unsplash.com/photo-1554844078-f24c7694d509?q=80&w=800'], 
      description: 'Майже нова, батарея 98%. Автопілот.',
      comfort: { airConditioning: true, climateControl: true, heatedSeats: true, rearCamera: true, parkingSensors: true, sunroof: false }
    },
    { 
      id: 3, brand: 'BMW', model: 'X5', year: 2019, mileage: 80, fuel: 'petrol', price: 45000, currency: 'USD', location: 'Одеса', 
      transmission: 'automatic', bodyType: 'suv', color: 'blue', driveTrain: 'full', engineSize: 3.0, 
      metallic: true, inAccident: true, paintwork: 'traces', technicalCondition: 'repair_needed',
      images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800'], 
      description: 'M-пакет, панорама. Після незначного ДТП (було замінено крило).',
      comfort: { airConditioning: true, climateControl: true, heatedSeats: true, rearCamera: false, parkingSensors: true, sunroof: true }
    },
    { 
      id: 4, brand: 'Volkswagen', model: 'Passat', year: 2018, mileage: 120, fuel: 'diesel', price: 22000, currency: 'USD', location: 'Харків', 
      transmission: 'manual', bodyType: 'universal', color: 'grey', driveTrain: 'front', engineSize: 2.0, 
      metallic: false, inAccident: false, paintwork: 'scratches', technicalCondition: 'full',
      images: [], 
      description: 'Робоча машина, є нюанси по кузову.',
      comfort: { airConditioning: true, climateControl: false, heatedSeats: false, rearCamera: false, parkingSensors: false, sunroof: false }
    },
];

// (МОК) Завантаження даних (без змін)
onMounted(() => {
  isLoading.value = true;
  const carId = parseInt(route.params.id); 
  console.log(`(Симуляція) Запит на бекенд: /api/listing/${carId}`);
  setTimeout(() => { 
    const foundCar = mockCars.find(car => car.id === carId); 
    if (foundCar) {
      listing.value = foundCar;
      toast.success(t('listingDetail.loadSuccess'));
    } else {
      toast.error(t('listingDetail.loadError'));
    }
    isLoading.value = false;
  }, 1000); 
});

const formattedPrice = computed(() => {
  if (!listing.value) return '';
  return `${listing.value.price.toLocaleString(locale.value)} ${listing.value.currency}`;
});

// Нова 'computed' для перевірки, чи є хоч одна опція комфорту
const hasComfortOptions = computed(() => {
  if (!listing.value || !listing.value.comfort) return false;
  // Перевіряємо, чи хоча б одне значення в 'comfort' === true
  return Object.values(listing.value.comfort).some(value => value === true);
});

</script>

<style scoped>
/* (Фон, контейнер, картки, спіннер - без змін) */
.detail-view {
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
.detail-view::before {
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
.form-card,
.filter-card,
.loading-card {
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 30px;
}
.loading-card {
  text-align: center;
  padding: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.loading-card h2 {
  margin-top: 20px;
}
.form-card h2 {
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
  font-weight: 500;
}

/* * ОНОВЛЕНИЙ МАКЕТ СТОРІНКИ 
 * (Галерея + (Характеристики | Опис)) + (Сайдбар)
*/
.page-layout {
  display: grid;
  grid-template-columns: 1fr; /* 1 колонка на мобілках */
  gap: 25px;
}
@media (min-width: 992px) {
  .page-layout {
    /* На десктопі: 3 частини для контенту, 1 для сайдбару */
    grid-template-columns: 3fr 1fr;
    align-items: start;
  }
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.description-text {
  font-size: 16px;
  line-height: 1.7;
  color: #eee;
  white-space: pre-wrap; 
}

/* * НОВИЙ МАКЕТ (Характеристики + Опис)
 */
.specs-desc-layout {
  display: grid;
  grid-template-columns: 1fr; /* 1 колонка на мобілках */
  gap: 25px;
  align-items: start;
}
@media (min-width: 768px) { 
  /* На планшетах і десктопах - 2 колонки */
  .specs-desc-layout {
    grid-template-columns: 1fr 1fr;
  }
}

.specs-column {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.desc-column {
  /* "Прилипає" під галереєю */
  position: sticky;
  top: 100px;
  align-self: start;
}

/* (Сайдбар, ціна - без змін) */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
  position: sticky;
  top: 100px;
  align-self: start;
}
.price {
  font-size: 36px;
  font-weight: 700;
  color: #ffd700;
  margin: 0;
}
.location {
  font-size: 16px;
  color: #ccc;
  margin: 5px 0 20px 0;
}

/* (Галерея - без змін) */
.main-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
}
.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  min-height: 300px;
  cursor: zoom-in;
}
.thumbnails {
  display: flex;
  flex-wrap: wrap; 
  gap: 10px;
  margin-top: 15px;
}
.thumb-item {
  width: 100px;
  height: 70px;
  border-radius: 4px;
  overflow: hidden;
  border: 3px solid #555;
  cursor: pointer;
  transition: border-color 0.3s;
}
.thumb-item:hover {
  border-color: #ffd700;
}
.thumb-item.active {
  border-color: #cc0000;
}
.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
 
/* (Картка Продавця - без змін) */
.seller-card {
  padding-top: 20px;
  padding-bottom: 20px;
}
.seller-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: #ccc;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
}
.seller-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.seller-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #555;
}
.seller-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.seller-details strong {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}
.seller-contacts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}
.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}
.contact-item span {
  color: #ccc;
}
.contact-item a {
  color: #ffd700;
  text-decoration: none;
  font-weight: 600;
}
.contact-item a:hover {
  text-decoration: underline;
}
.message-btn {
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: 0.3s;
  background-color: rgba(255,255,255,0.27);
  color: #fff;
}
.message-btn:hover {
  background-color: rgba(255,255,255,0.4);
}

/* ---
 * ОНОВЛЕННЯ 1: СТИЛІ "ХАРАКТЕРИСТИКИ" (для вирівнювання)
 --- */
.specs-card h2 {
  margin-top: 0;
  font-weight: 500;
}
.specs-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.specs-list li {
  /* ВИКОРИСТОВУЄМО GRID ДЛЯ ВИРІВНЮВАННЯ */
  display: grid; 
  grid-template-columns: auto 1fr; /* (Іконка+Назва) | (Значення) */
  justify-content: flex-start; /* Вирівнювання по лівому краю */
  
  align-items: center;
  font-size: 14px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 10px;
}
.specs-list li:last-child {
  border-bottom: none;
}
.specs-list li span {
  color: #ccc;
  display: flex;
  align-items: center;
  gap: 8px;
  word-break: break-word;
}
.specs-list li strong {
  color: #fff;
  font-weight: 600;
  text-align: right;
}
.specs-list li svg {
  width: 18px;
  height: 18px;
  stroke: #ffd700;
  flex-shrink: 0;
}

/* ---
 * ОНОВЛЕННЯ 2: СТИЛІ "КОМФОРТ" (Галки/Хрестики)
 --- */
.comfort-card h2 {
  margin-top: 0;
  font-weight: 500;
}
/* Використовуємо той самий .specs-list, але трохи міняємо */
.comfort-list li {
  display: flex; /* Повертаємо Flex */
  grid-template-columns: 1fr; /* Скидаємо Grid */
  justify-content: flex-start;
  border-bottom: none;
  padding: 6px 0;
  transition: opacity 0.3s;
}
/* Робимо відсутні опції тьмяними */
.comfort-list li.is-missing {
  opacity: 0.5;
  color: #aaa;
}
.comfort-list li.is-missing span {
  color: #aaa;
}
/* Іконки (спільне) */
.comfort-list li .comfort-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
/* Іконка "Галочка" (зелена) */
.comfort-list li .comfort-icon.check {
  stroke: #28a745;
  stroke-width: 3;
}
/* Іконка "Хрестик" (червона) */
.comfort-list li .comfort-icon.cross {
  stroke: #cc0000;
  stroke-width: 3;
}
.no-comfort {
  font-size: 14px;
  color: #ccc;
  text-align: center;
  padding: 10px 0;
}


/* (Модальне вікно - без змін) */
.image-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  overflow-y: auto;
  padding: 40px 0; 
  box-sizing: border-box;
}
.image-modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 20px;
  box-sizing: border-box;
  margin: auto 0; 
}
.modal-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
}
.modal-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #cc0000;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  z-index: 10001;
}
.modal-close-btn:hover {
  background: #aa0000;
}
</style>