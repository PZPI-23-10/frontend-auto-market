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

          <section class="form-card">
                        <h2>{{ t('listingDetail.descriptionTitle') }}</h2>
            <p class="description-text">
                            {{ listing.description || t('listingDetail.noDescription') }}
            </p>
          </section>

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
          
          <div class="filter-card specs-card">
                        <h2>{{ t('listingDetail.specsTitle') }}</h2>
            <ul class="specs-list">
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                                <span>{{ t('fields.brand') }}</span>
                <strong>{{ listing.brand }}</strong>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16.94V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.06Z"/><path d="M20 17h2a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v.06"/><path d="M19 12V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
                <span>{{ t('fields.model') }}</span>
                <strong>{{ listing.model }}</strong>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>{{ t('fields.year') }}</span>
                <strong>{{ listing.year }}</strong>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0"/><path d="m14 14-2-2-2 2"/><path d="M12 12v-6"/></svg>
                <span>{{ t('fields.mileage') }}</span>
                                <strong>{{ t('carCard.mileage', { km: listing.mileage }) }}</strong>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 11h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1Z"/><path d="M18 11V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="M6 11h4"/><path d="M6 15h2"/></svg>
                <span>{{ t('fields.fuel') }}</span>
                                <strong>{{ t('fuelTypes.' + listing.fuel) }}</strong>
              </li>
              <li>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM15 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM5 16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1zM15 16a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zM9 11v-1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M12 9v6m-3 2v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1"/></svg>
                <span>{{ t('fields.transmission') }}</span>
                                <strong>{{ t('transmissionTypes.' + listing.transmission) }}</strong>
              </li>
            </ul>
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
import { useI18n } from 'vue-i18n'; // 1. ІМПОРТ I18N
import defaultAvatar from '@/assets/default-avatar.png'; 
import placeholderImage from '@/assets/no-photo.png'; 

const route = useRoute();
const toast = useToast();
const { t, locale } = useI18n(); // 2. ОТРИМАННЯ t ТА locale

const isLoading = ref(true);
const listing = ref(null); 

const seller = ref({
  name: 'Олександр Іваненко', // (Mock data, можна залишити)
  email: 'user@example.com',
  phone: '+380 99 123 4567',
  avatarUrl: null
});

// --- Логіка Галереї ---
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

// --- Логіка Модального вікна ---
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

// (МОК) "База даних" (ОНОВЛЕНО: ВИКОРИСТАННЯ КЛЮЧІВ)
const mockCars = [
    { 
      id: 1, 
      brand: 'Audi', 
      model: 'A6', 
      year: 2020, 
      mileage: 50, 
      fuel: 'diesel', // 3. ЗМІНЕНО З 'Дизель'
      price: 35000, 
      currency: 'USD', 
      location: 'Київ', 
      transmission: 'automatic', // 4. ЗМІНЕНО З 'Автомат'
      images: ['https://images.unsplash.com/photo-1541348263662-e56892d63df6?q=80&w=800', 'https://images.unsplash.com/photo-1612999332206-819194885c3b?q=80&w=800'], 
      description: 'Чудовий стан, повна комплектація, один власник. Обслуговувалась тільки на офіційному СТО.' 
    },
    { 
      id: 4, 
      brand: 'Volkswagen', 
      model: 'Passat', 
      year: 2018, 
      mileage: 120, 
      fuel: 'diesel', // 5. ЗМІНЕНО З 'Дизель'
      price: 22000, 
      currency: 'USD', 
      location: 'Харків', 
      transmission: 'manual', // 6. ЗМІНЕНО З 'Механіка'
      images: [], 
      description: 'Робоча машина, є нюанси по кузову.' 
    },
];

// (МОК) Завантаження даних (ОНОВЛЕНО: ЛОКАЛІЗАЦІЯ TOAST)
onMounted(() => {
  isLoading.value = true;
  const carId = parseInt(route.params.id); 
  console.log(`(Симуляція) Запит на бекенд: /api/listing/${carId}`);
  setTimeout(() => { 
    const foundCar = mockCars.find(car => car.id === carId); 
    if (foundCar) {
      listing.value = foundCar;
      toast.success(t('listingDetail.loadSuccess')); // 7. Локалізація
    } else {
      toast.error(t('listingDetail.loadError')); // 8. Локалізація
    }
    isLoading.value = false;
  }, 1000); 
});

const formattedPrice = computed(() => {
  if (!listing.value) return '';
  // 9. Використання locale.value замість 'en-US'
  return `${listing.value.price.toLocaleString(locale.value)} ${listing.value.currency}`;
});

</script>

<style scoped>
/* (Фон, контейнер, макет, картки, спіннер - без змін) */
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

/* --- ОНОВЛЕНИЙ САЙДБАР --- */
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
 
/* Картка Продавця */
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

/* Кнопка "Написати повідомлення" (в картці продавця) */
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

/* Характеристики (з іконками) */
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
  display: flex;
  justify-content: space-between;
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
}
.specs-list li strong {
  color: #fff;
  font-weight: 600;
  text-align: right;
  flex-shrink: 0;
}
.specs-list li svg {
  width: 18px;
  height: 18px;
  stroke: #ffd700;
  flex-shrink: 0;
}

/* Модальне вікно (без змін) */
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