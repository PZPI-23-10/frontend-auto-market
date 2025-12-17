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
            <div class="listing-header">
              <h2>{{ listing.brand }} {{ listing.model }} ({{ listing.year }})</h2>
              
              <div class="header-actions">
                <button 
                  class="favorite-btn-detail" 
                  @click.stop="toggleFavorite" 
                  :title="isFav ? t('listingDetail.removeFromFav') : t('listingDetail.addToFav')"
                >
                  <svg v-if="isFav" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>

                <div v-if="listing.isVerified" class="verified-badge" :title="t('listingDetail.vinVerifiedTitle')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>{{ t('listingDetail.verifiedLabel') || 'VERIFIED' }}</span>
                </div>
              </div>
            </div>
            
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
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                      {{ t('fields.brand') }}
                    </span>
                    <strong>{{ listing.brand }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 16.94V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.06Z"/><path d="M20 17h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v.06"/><path d="M19 12V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                      {{ t('fields.model') }}
                    </span>
                    <strong>{{ listing.model }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {{ t('fields.year') }}
                    </span>
                    <strong>{{ listing.year }}</strong>
                  </li>
                  <li>
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0"/><path d="m14 14-2-2-2 2"/><path d="M12 12v-6"/></svg>
                      {{ t('fields.mileage') }}
                    </span>
                    <strong>{{ t('carCard.mileage', { km: listing.mileage }) }}</strong>
                  </li>

                  <li v-if="listing.fuel">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 11h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1Z"/><path d="M18 11V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="M6 11h4"/><path d="M6 15h2"/></svg>
                      {{ t('fields.fuel') }}
                    </span>
                    <strong>{{ t('options.fuel.' + listing.fuel) }}</strong>
                  </li>

                  <li v-if="listing.transmission">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM15 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM5 16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM15 16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM9 11v-1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M12 9v6m-3 2v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1"/></svg>
                      {{ t('fields.transmission') }}
                    </span>
                    <strong>{{ t('options.transmission.' + listing.transmission) }}</strong>
                  </li>

                  <li v-if="listing.bodyType">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 18.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-4.37c0-.3-.1-.59-.28-.84l-1.44-2A.5.5 0 0 1 4.5 10.5h15a.5.5 0 0 1 .22.49l-1.44 2c-.18.25-.28.54-.28.84Z"/><path d="M4 14.13V10.5a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 10.5v3.63"/><circle cx="6.5" cy="18.5" r="0.5"/><circle cx="17.5" cy="18.5" r="0.5"/></svg>
                      {{ t('fields.bodyType') }}
                    </span>
                    <strong>{{ t('options.bodyType.' + listing.bodyType) }}</strong>
                  </li>

                  <li v-if="listing.color">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 14 6-6"/><path d="M12 14c-1.88 1.88-5.12 1.88-7 0 1.88-1.88 1.88-5.12 0-7 1.88 1.88 5.12 1.88 7 0 1.88 1.88 1.88 5.12 0 7Z"/><path d="m14 12-6 6"/><path d="M14 12c1.88-1.88 5.12-1.88 7 0-1.88 1.88-1.88 5.12 0 7-1.88-1.88-5.12-1.88-7 0-1.88-1.88-1.88-5.12-1.88-7 0-1.88-1.88-1.88-5.12 0-7Z"/></svg>
                      {{ t('fields.color') }}
                    </span>
                    <strong>{{ t('options.color.' + listing.color) }}</strong>
                  </li>

                  <li v-if="listing.technicalCondition">
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      {{ t('fields.technicalCondition') }}
                    </span>
                    <strong>{{ t('options.techState.' + listing.technicalCondition) }}</strong>
                  </li>

                  <li v-if="isValidLicensePlate(listing.licensePlate)">
                    <span style="display: flex; align-items: center; gap: 5px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: #aaa;">
                        <rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="6" cy="12" r="1"/><circle cx="18" cy="12" r="1"/><path d="M10 12h4"/>
                      </svg>
                      {{ t('fields.licensePlate') }}
                    </span>
                    <strong class="license-plate-style">{{ listing.licensePlate }}</strong>
                  </li>

                  <li v-if="listing.vin && listing.vin.length === 17">
                    <span style="display: flex; align-items: center; gap: 5px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      VIN
                    </span>
                    <strong style="font-family: monospace; letter-spacing: 1px;">
                      {{ listing.vin.substring(0, 4) }}****{{ listing.vin.substring(13) }} 
                      <span v-if="listing.isVerified" style="color: #2ecc71; font-size: 14px; margin-left: 5px;" title="Перевірено">✓</span>
                    </strong>
                  </li>

                </ul>
              </div>

              <VehicleCheck 
                v-if="listing.vin || isValidLicensePlate(listing.licensePlate)"
                :licensePlate="listing.licensePlate" 
                :vin="listing.vin"
              />
      
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
            
            <p class="location">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 5px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              
              <span v-if="listing.regionName">
                {{ t('options.region.' + getLabel('options.region', listing.regionName), listing.regionName) }}
              </span>
              
              <span v-if="listing.regionName && listing.cityName"> - </span>
              
              <span v-if="listing.cityName">
                {{ t('options.city.' + getLabel('options.city', listing.cityName), listing.cityName) }}
              </span>

              <span v-if="!listing.regionName && !listing.cityName">Не вказано</span>
            </p>
            
            <div v-if="hasCoordinates" id="map-container" class="map-view"></div>
            <p v-else class="no-map-text">{{ t('listingDetail.mapNotAvailable') }}</p>
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
              <div class="contact-item" v-if="seller.phone">
                <span>{{ t('listingDetail.phone') }}:</span>
                <a :href="`tel:${seller.phone}`">{{ seller.phone }}</a>
              </div>
            </div>
            
            <button class="btn-secondary message-btn"
            @click="contactSeller"
            :disabled="isContacting">
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
import { ref, onMounted, computed, onBeforeUnmount, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'; 
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

// --- LEAFLET IMPORTS ---
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { useAuth } from '@/store/auth'; 
import { chatStore } from '@/store/chatStore';

import VehicleCheck from '@/components/VehicleCheck.vue';
import defaultAvatar from '@/assets/default-avatar.png'; 
import placeholderImage from '@/assets/no-photo.png'; 

const route = useRoute();
const router = useRouter(); 
const toast = useToast();
const { t, locale } = useI18n();

const listingId = route.params.id;
const API_BASE = 'https://backend-auto-market-wih5h.ondigitalocean.app/api';
const API_FAV_URL = 'https://backend-auto-market-wih5h.ondigitalocean.app/api/Favourite';

const { token, favoriteIds, addFavoriteId, removeFavoriteId, isAuthenticated, userId } = useAuth();

const isFav = computed(() => {
  if (!favoriteIds || !favoriteIds.value) return false;
  return favoriteIds.value.has(Number(listingId));
});

const isLoading = ref(true);
const isContacting = ref(false);
const listing = ref(null); 
const mapInstance = ref(null);

const seller = ref({
  name: 'Завантаження...',
  email: '',
  phone: '',
  avatarUrl: null
});

// --- FAVORITE LOGIC ---
async function toggleFavorite() {
  if (!token.value) {
    toast.error(t('profile.favoritesTab.toast.loginRequired'));
    router.push('/login');
    return;
  }

  const cleanToken = String(token.value).replace(/^"|"$/g, '');
  const payload = { vehicleListingId: Number(listingId) };

  try {
    if (isFav.value) {
      // DELETE
      if (removeFavoriteId) removeFavoriteId(Number(listingId));
      else favoriteIds.value.delete(Number(listingId));

      await axios.delete(`${API_FAV_URL}/remove`, {
        headers: { 'Authorization': `Bearer ${cleanToken}`, 'Content-Type': 'application/json' },
        data: payload
      });
      toast.info(t('profile.favoritesTab.toast.removed'));
    } else {
      // ADD
      if (addFavoriteId) addFavoriteId(Number(listingId));
      else favoriteIds.value.add(Number(listingId)); 

      await axios.post(`${API_FAV_URL}/add`, payload, {
        headers: { 'Authorization': `Bearer ${cleanToken}`, 'Content-Type': 'application/json' }
      });
      toast.success(t('profile.favoritesTab.toast.added'));
    }
  } catch (error) {
    console.error("Помилка favorite:", error);
    // Відкат
    if (isFav.value) {
       if (removeFavoriteId) removeFavoriteId(Number(listingId));
       else favoriteIds.value.delete(Number(listingId));
    } else {
       if (addFavoriteId) addFavoriteId(Number(listingId));
       else favoriteIds.value.add(Number(listingId));
    }
    
    if (error.response?.status === 401) {
        toast.error(t('profile.favoritesTab.toast.authError'));
    } else {
        toast.error(t('profile.favoritesTab.toast.serverError'));
    }
  }
}

// --- HELPERS ---
function getLabel(category, serverName) {
  if (!serverName) return '';
  if (category === 'color' && serverName.startsWith('#')) {
      return serverName.toLowerCase(); 
  }
  const keyRaw = serverName.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '_').replace(/,/g, '').replace(/\./g, '');       
  return keyRaw;
}

function mapApiToDetail(apiItem) {
  let processedImages = [placeholderImage]; 
  const rawPhotos = apiItem.photos || apiItem.photoUrls;

  if (Array.isArray(rawPhotos) && rawPhotos.length > 0) {
    const sortedPhotos = [...rawPhotos].sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));
    const urls = sortedPhotos.map(item => (typeof item === 'object' && item !== null) ? item.url : item).filter(u => u);
    if (urls.length > 0) processedImages = urls;
  }

  let licensePlate = apiItem.licensePlate || apiItem.number || '';
  if (licensePlate === '0000000000') licensePlate = '';

  const regionName = apiItem.region?.name || '';
  const cityName = apiItem.city?.name || '';
  const locationFull = [regionName, cityName].filter(Boolean).join(', ') || 'Україна';

  return {
    id: apiItem.id,
    userId: apiItem.userId,
    brand: apiItem.brand?.name || 'Unknown',
    model: apiItem.model?.name || 'Unknown',
    year: apiItem.year,
    mileage: apiItem.mileage,
    price: apiItem.price,
    currency: apiItem.currency || 'USD',
    regionName: regionName, 
    cityName: cityName,     
    locationRaw: locationFull,    
    licensePlate: licensePlate,
    vin: apiItem.vin, 
    isVerified: apiItem.isVerified,
    fuel: apiItem.fuelType?.name ? getLabel('fuel', apiItem.fuelType.name) : null,
    transmission: apiItem.gearType?.name ? getLabel('transmission', apiItem.gearType.name) : null,
    bodyType: apiItem.bodyType?.name ? getLabel('bodyType', apiItem.bodyType.name) : null,
    color: apiItem.colorHex ? getLabel('color', apiItem.colorHex) : null,
    colorHex: apiItem.colorHex, 
    technicalCondition: apiItem.condition?.name ? getLabel('techState', apiItem.condition.name) : null,
    engineSize: apiItem.engineSize || 0,
    inAccident: apiItem.hasAccident ?? null, 
    images: processedImages, 
    description: apiItem.description || '',
    latitude: apiItem.latitude,
    longitude: apiItem.longitude
  };
}

function isValidLicensePlate(plate) {
  if (!plate) return false;
  const forbiddenWords = ['Приховано', 'Hidden', 'null', ''];
  if (forbiddenWords.includes(plate)) return false;
  return plate.length > 2;
}

// --- MAP LOGIC (LEAFLET) ---
const hasCoordinates = computed(() => {
  return listing.value && 
         listing.value.latitude && 
         listing.value.longitude && 
         listing.value.latitude !== 0 && 
         listing.value.longitude !== 0;
});

const initMap = () => {
  const mapContainer = document.getElementById('map-container');
  if (!hasCoordinates.value || !mapContainer) return;

  // Icon fix
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
    iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
    shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
  });

  const lat = listing.value.latitude;
  const lng = listing.value.longitude;

  if (mapInstance.value) {
    mapInstance.value.remove();
  }

  mapInstance.value = L.map('map-container').setView([lat, lng], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(mapInstance.value);

  L.marker([lat, lng])
    .addTo(mapInstance.value)
    .bindPopup(`${listing.value.brand} ${listing.value.model}`)
    .openPopup();
    
  // Важный фикс: обновить размер карты после инициализации
  setTimeout(() => {
      mapInstance.value.invalidateSize();
  }, 200);
};

onBeforeUnmount(() => {
  if (mapInstance.value) {
    mapInstance.value.remove();
  }
});

// Запуск карты после того, как исчезнет Loading
watch(isLoading, async (newValue) => {
  if (newValue === false && hasCoordinates.value) {
    await nextTick();
    initMap();
  }
});

// --- CHAT LOGIC (FIXED) ---
const contactSeller = async () => {
  if (!isAuthenticated.value) {
    toast.info(t('auth.loginRequired') || 'Увійдіть, щоб написати продавцю');
    router.push('/login'); 
    return;
  }

  if (Number(userId.value) === listing.value.userId) {
    toast.warning('Ви не можете писати самі собі');
    return;
  }

  isContacting.value = true;

  try {
    const res = await axios.post(
      `${API_BASE}/Chat/with/${listing.value.userId}`, 
      {}, 
      { headers: { Authorization: `Bearer ${token.value}` } }
    );
    
    const chatData = res.data; 

    // === ИСПРАВЛЕНИЕ ===
    // Создаем объект с информацией о собеседнике для шапки
    const headerInfo = {
        name: seller.value.name,
        photo: seller.value.avatarUrl
    };

    const listingContext = {
      id: listing.value.id,
      title: `${listing.value.brand} ${listing.value.model} ${listing.value.year}`,
      price: formattedPrice.value,
      image: selectedImageUrl.value 
    };

    // Передаем ТРИ аргумента: ID, HeaderInfo, Context
    chatStore.openChat(chatData.id, headerInfo, listingContext);

  } catch (e) {
    console.error('Ошибка создания чата:', e);
    toast.error('Не вдалося відкрити чат');
  } finally {
    isContacting.value = false;
  }
};

// --- LIFECYCLE ---
onMounted(async () => {
  isLoading.value = true;
  const carId = route.params.id;

  try {
    const response = await axios.get(`${API_BASE}/Listing/${carId}`);
    
    if (response.data) {
      listing.value = mapApiToDetail(response.data);
      
      // Load Seller
      if (listing.value.userId) {
        try {
          const profileRes = await axios.get(`${API_BASE}/Profile`, { params: { userId: listing.value.userId } });
          if (profileRes.data) {
             const p = profileRes.data;
             seller.value.name = p.firstName ? `${p.firstName} ${p.lastName || ''}` : (p.userName || 'Продавець');
             seller.value.email = p.email || 'Приховано';
             if (p.phoneNumber) seller.value.phone = p.phoneNumber;
             seller.value.avatarUrl = p.avatarUrl || null;
          }
        } catch (profileError) {
          console.warn("Помилка профілю продавця:", profileError);
        }
      }
    } 
  } catch (error) {
    console.error("API Error:", error);
    toast.error(t('listingDetail.loadError'));
    listing.value = null;
  } finally {
    isLoading.value = false;
  }
});

// --- COMPUTED / MODAL ---
const formattedPrice = computed(() => {
  if (!listing.value) return '';
  return `${listing.value.price.toLocaleString(locale.value)} ${listing.value.currency}`;
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
  background: rgba(0, 0, 0, 0.75); 
  z-index: 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.listing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.listing-header h2 {
  margin: 0;
  border: none;
  padding: 0;
  flex-grow: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.favorite-btn-detail {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  transition: transform 0.2s, background-color 0.2s;
}

.favorite-btn-detail:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(46, 204, 113, 0.15); 
  color: #2ecc71; 
  border: 1px solid rgba(46, 204, 113, 0.3);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  user-select: none;
  box-shadow: 0 0 10px rgba(46, 204, 113, 0.1);
}

.form-card, .filter-card, .loading-card {
  background-color: rgba(30, 30, 30, 0.7); 
  border-radius: 12px;
  backdrop-filter: blur(12px); 
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 30px;
  margin-bottom: 20px;
}

.form-card h2, .filter-card h2 {
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 10px;
  font-weight: 600;
  font-size: 22px;
  letter-spacing: 0.5px;
}

.page-layout {
  display: grid;
  grid-template-columns: 1fr; 
  gap: 25px;
}
@media (min-width: 992px) {
  .page-layout {
    grid-template-columns: 3fr 1fr; 
    align-items: start;
  }
}

.main-image {
  position: relative;
  width: 100%;
  height: 500px; 
  border-radius: 12px;
  overflow: hidden; 
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
  filter: blur(30px) brightness(0.7); 
  transform: scale(1.2); 
  z-index: 0;
}

.main-image img {
  position: relative;
  z-index: 1; 
  width: 100%;
  height: 100%;
  object-fit: contain; 
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.main-image:hover img { transform: scale(1.02); }

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
.thumb-item:hover { opacity: 1; border-color: #ffd700; }
.thumb-item.active { opacity: 1; border-color: #cc0000; box-shadow: 0 0 10px rgba(204, 0, 0, 0.5); }
.thumb-item img { width: 100%; height: 100%; object-fit: cover; }

@media (max-width: 768px) {
  .main-image { height: 300px; }
  .thumb-item { width: 80px; height: 60px; }
}

.specs-desc-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  align-items: start;
  margin-top: 25px;
}
@media (min-width: 768px) {
  .specs-desc-layout { grid-template-columns: 1fr 1fr; }
}

.specs-list { list-style: none; padding: 0; margin: 0; }
.specs-list li {
  display: grid;
  grid-template-columns: auto 1fr; 
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 14px;
}
.specs-list li:last-child { border-bottom: none; }
.specs-list li span { color: #aaa; display: flex; align-items: center; gap: 10px; }
.specs-list li strong { color: #fff; font-weight: 600; text-align: right; }
.specs-list li svg { width: 18px; height: 18px; stroke: #ffd700; stroke-width: 2; }

.description-text { font-size: 15px; line-height: 1.8; color: #e0e0e0; white-space: pre-wrap; }

.sidebar { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 20px; }
.price { font-size: 32px; font-weight: 800; color: #ffd700; margin: 0; text-shadow: 0 2px 10px rgba(255, 215, 0, 0.2); }
.location { font-size: 15px; color: #ccc; margin-top: 5px; display: flex; align-items: center; gap: 5px; }

/* MAP CONTAINER */
.map-view {
  width: 100%;
  height: 200px;
  background-color: #333;
  border-radius: 8px;
  margin-top: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1; /* Чтобы карта не перекрывала модалку */
}
.no-map-text { font-size: 12px; color: #777; margin-top: 10px; font-style: italic; }

.seller-card h4 { font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px; border-bottom: 1px solid #444; }
.seller-info { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.seller-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #ffd700; }
.seller-details strong { display: block; font-size: 18px; color: #fff; margin-bottom: 4px; }

.license-plate-style {
  font-family: 'Consolas', 'Monaco', monospace; 
  font-weight: 700;
  font-size: 16px;
  color: #ffd700; 
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3); 
  letter-spacing: 2px;
  text-transform: uppercase;
  background: transparent; 
  border: none;           
  padding: 0;               
}

.message-btn {
  width: 100%; padding: 14px 0; border-radius: 6px; border: none; font-weight: 700;
  cursor: pointer; margin-top: 20px; background-color: #cc0000; color: #fff;
  text-transform: uppercase; letter-spacing: 1px; transition: background 0.3s;
}
.message-btn:hover { background-color: #ff0000; box-shadow: 0 4px 15px rgba(204, 0, 0, 0.4); }

.loading-card { min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.spinner { width: 50px; height: 50px; border: 4px solid rgba(255, 255, 255, 0.1); border-top-color: #ffd700; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
@keyframes spin { to { transform: rotate(360deg); } }

.image-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s;
}
.image-modal-content { position: relative; max-width: 95%; max-height: 95vh; }
.modal-image { max-width: 100%; max-height: 90vh; border-radius: 4px; box-shadow: 0 0 50px rgba(0,0,0,0.8); }
.modal-close-btn { position: absolute; top: -40px; right: 0; background: transparent; color: #fff; border: none; font-size: 40px; cursor: pointer; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
<style scoped>
/* Ваші стилі */
.title-wrapper {
  display: flex;
  align-items: center;
  gap: 15px; 
}

.favorite-btn-detail {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  transition: transform 0.2s, background-color 0.2s;
}

.favorite-btn-detail:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

.favorite-btn-detail svg {
  transition: all 0.2s;
}

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
  background: rgba(0, 0, 0, 0.75); 
  z-index: 0;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}


.listing-header {
  display: flex;
  justify-content: space-between; /* Текст зліва, кнопки справа */
  align-items: center;            /* Центруємо все по вертикалі (це "підніме" кнопки) */
  flex-wrap: wrap;
  
  /* Ось ця лінія буде одна на всіх */
  border-bottom: 1px solid rgba(255, 255, 255, 0.15); 
  
  padding-bottom: 15px; /* Відступ від тексту/кнопок до лінії */
  margin-bottom: 20px;
  gap: 15px;
}

/* Заголовок: ПРИБИРАЄМО особисту лінію і відступи */
.listing-header h2 {
  margin: 0 !important; 
  padding: 0 !important; 
  border: none !important;
  font-size: 24px;
  line-height: 1;
}

/* Блок справа (Серце + Verified) */
.header-actions {
  display: flex;
  align-items: center; /* Рівняємо серце і бейдж між собою */
  gap: 15px;           /* Відстань між серцем і бейджем */
  margin-left: auto;
}

/* Стиль кнопки серця (щоб стояла рівно) */
.favorite-btn-detail {
  display: flex;       /* Щоб SVG всередині не стрибав */
  align-items: center;
  justify-content: center;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}
.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(46, 204, 113, 0.15); 
  color: #2ecc71; 
  border: 1px solid rgba(46, 204, 113, 0.3);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  height: fit-content; 
}

.form-card, .filter-card, .loading-card {
  background-color: rgba(30, 30, 30, 0.7); 
  border-radius: 12px;
  backdrop-filter: blur(12px); 
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 30px;
  margin-bottom: 20px;
}

.form-card h2, .filter-card h2 {
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 10px;
  font-weight: 600;
  font-size: 22px;
  letter-spacing: 0.5px;
}

.page-layout {
  display: grid;
  grid-template-columns: 1fr; 
  gap: 25px;
}
@media (min-width: 992px) {
  .page-layout {
    grid-template-columns: 3fr 1fr; 
    align-items: start;
  }
}

.main-image {
  position: relative;
  width: 100%;
  height: 500px; 
  border-radius: 12px;
  overflow: hidden; 
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
  filter: blur(30px) brightness(0.7); 
  transform: scale(1.2); 
  z-index: 0;
}

.main-image img {
  position: relative;
  z-index: 1; 
  width: 100%;
  height: 100%;
  object-fit: contain; 
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.main-image:hover img { transform: scale(1.02); }

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
.thumb-item:hover { opacity: 1; border-color: #ffd700; }
.thumb-item.active { opacity: 1; border-color: #cc0000; box-shadow: 0 0 10px rgba(204, 0, 0, 0.5); }
.thumb-item img { width: 100%; height: 100%; object-fit: cover; }

@media (max-width: 768px) {
  .main-image { height: 300px; }
  .thumb-item { width: 80px; height: 60px; }
}

.specs-desc-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 25px;
  align-items: start;
  margin-top: 25px;
}
@media (min-width: 768px) {
  .specs-desc-layout { grid-template-columns: 1fr 1fr; }
}

.specs-list { list-style: none; padding: 0; margin: 0; }
.specs-list li {
  display: grid;
  grid-template-columns: auto 1fr; 
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 14px;
}
.specs-list li:last-child { border-bottom: none; }
.specs-list li span { color: #aaa; display: flex; align-items: center; gap: 10px; }
.specs-list li strong { color: #fff; font-weight: 600; text-align: right; }
.specs-list li svg { width: 18px; height: 18px; stroke: #ffd700; stroke-width: 2; }

.description-text { font-size: 15px; line-height: 1.8; color: #e0e0e0; white-space: pre-wrap; }

.sidebar { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 20px; }
.price { font-size: 32px; font-weight: 800; color: #ffd700; margin: 0; text-shadow: 0 2px 10px rgba(255, 215, 0, 0.2); }
.location { font-size: 15px; color: #ccc; margin-top: 5px; display: flex; align-items: center; gap: 5px; }

.seller-card h4 { font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px; border-bottom: 1px solid #444; }
.seller-info { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
.seller-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #ffd700; }
.seller-details strong { display: block; font-size: 18px; color: #fff; margin-bottom: 4px; }

.license-plate-style {
  font-family: 'Consolas', 'Monaco', monospace; 
  font-weight: 700;
  font-size: 16px;
  color: #ffd700; 
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3); 
  letter-spacing: 2px;
  text-transform: uppercase;
  background: transparent; 
  border: none;           
  padding: 0;               
}

.message-btn {
  width: 100%; padding: 14px 0; border-radius: 6px; border: none; font-weight: 700;
  cursor: pointer; margin-top: 20px; background-color: #cc0000; color: #fff;
  text-transform: uppercase; letter-spacing: 1px; transition: background 0.3s;
}
.message-btn:hover { background-color: #ff0000; box-shadow: 0 4px 15px rgba(204, 0, 0, 0.4); }

.loading-card { min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.spinner { width: 50px; height: 50px; border: 4px solid rgba(255, 255, 255, 0.1); border-top-color: #ffd700; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
@keyframes spin { to { transform: rotate(360deg); } }

.image-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.95); backdrop-filter: blur(10px);
  display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.3s;
}
.image-modal-content { position: relative; max-width: 95%; max-height: 95vh; }
.modal-image { max-width: 100%; max-height: 90vh; border-radius: 4px; box-shadow: 0 0 50px rgba(0,0,0,0.8); }
.modal-close-btn { position: absolute; top: -40px; right: 0; background: transparent; color: #fff; border: none; font-size: 40px; cursor: pointer; }

/* STYLES FOR MAP */
.map-view {
  width: 100%;
  height: 200px;
  margin-top: 15px;
  border-radius: 8px;
  z-index: 1; 
}

.no-map-text {
  font-size: 13px;
  color: #888;
  margin-top: 10px;
  font-style: italic;
}

/* Custom Leaflet Popup for Dark Theme */
:deep(.leaflet-popup-content-wrapper),
:deep(.leaflet-popup-tip) {
  background: #333;
  color: #fff;
  box-shadow: 0 3px 14px rgba(0,0,0,0.4);
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>