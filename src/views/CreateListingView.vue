<template>
  <div class="create-listing-view">
    <div class="form-container">
      <div class="header-row">
        <h1>{{ pageTitle }}</h1>

      </div>
      
      <div class="progressbar-wrapper">
        <ul class="progressbar">
          <li v-for="(step, index) in steps" :key="index" :class="{ active: currentStep >= (index + 1) }">
            <span>{{ t(step.titleKey) }}</span>
          </li>
        </ul>
      </div>

      <form @submit.prevent="handleSubmit" novalidate>
        
        <div class="step-content">
          <Transition name="fade-slide" mode="out-in">
            
            <section class="form-card" v-if="currentStep === 1">
              <h2>{{ t('createListing.step1.title') }} <small>* {{ t('createListing.required') }}</small></h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="vehicleType">{{ t('createListing.step1.vehicleType') }} *</label>
                  <select id="vehicleType" v-model="listing.vehicleTypeId" required>
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="type in lists.vehicleTypes" :key="type.id" :value="type.id">
                      {{ getLabel('vehicleType', type.name) }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="brand">{{ t('createListing.step1.brand') }} *</label>
                  <select id="brand" v-model="listing.brandId" required :disabled="!listing.vehicleTypeId">
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="brand in lists.brands" :key="brand.id" :value="brand.id">
                      {{ brand.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="model">{{ t('createListing.step1.model') }} *</label>
                  <select id="model" v-model="listing.modelId" required :disabled="!listing.brandId">
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="model in lists.models" :key="model.id" :value="model.id">
                      {{ model.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="year">{{ t('createListing.step1.year') }} *</label>
                  <select id="year" v-model="listing.year" required>
                    <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="mileage">{{ t('createListing.step1.mileage') }} *</label>
                  <input type="number" id="mileage" v-model.number="listing.mileage" required :placeholder="t('createListing.step1.mileagePlaceholder')">
                </div>

                <div class="form-group">
                  <label for="bodyType">{{ t('createListing.step1.bodyType') }} *</label>
                  <select id="bodyType" v-model="listing.bodyTypeId" required :disabled="!listing.modelId">
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="bt in lists.bodyTypes" :key="bt.id" :value="bt.id">
                      {{ getLabel('bodyType', bt.name) }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="region">{{ t('createListing.step1.region') }} *</label>
                  <select id="region" v-model="listing.regionId" required>
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="r in lists.regions" :key="r.id" :value="r.id">
                      {{ getLabel('region', r.name) }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="city">{{ t('createListing.step1.city') }} *</label>
                  <select id="city" v-model="listing.cityId" required :disabled="!listing.regionId">
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="c in lists.cities" :key="c.id" :value="c.id">
                      {{ getLabel('city', c.name) }}
                    </option>
                  </select>
                </div>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 2">
              <h2>{{ t('createListing.step2.title') }} <small>* {{ t('createListing.required') }}</small></h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="fuel">{{ t('createListing.step2.fuel') }} *</label>
                  <select id="fuel" v-model="listing.fuelTypeId" required>
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="fuel in lists.fuelTypes" :key="fuel.id" :value="fuel.id">
                      {{ getLabel('fuel', fuel.name) }}
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="transmission">{{ t('createListing.step2.transmission') }} *</label>
                  <select id="transmission" v-model="listing.gearTypeId" required>
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="gear in lists.gearTypes" :key="gear.id" :value="gear.id">
                        {{ getLabel('transmission', gear.name) }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="technicalCondition">{{ t('createListing.step2.technicalCondition') }} *</label>
                  <select id="technicalCondition" v-model="listing.conditionId" required>
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="cond in lists.conditions" :key="cond.id" :value="cond.id">
                      {{ getLabel('techState', cond.name) }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="color">{{ t('createListing.step2.color') }} *</label>
                  <select id="color" v-model="listing.colorHex" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="c in colorOptions" :key="c.hex" :value="c.hex">
                      {{ c.name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group checkbox-group single-checkbox">
                  <input type="checkbox" id="inAccident" v-model="listing.inAccident">
                  <label for="inAccident">{{ t('createListing.step2.inAccident') }}</label>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 3">
              <h2>{{ t('createListing.step4.title') }} <small>* {{ t('createListing.required') }}</small></h2>
              <div class="form-group price-group">
                <label for="price">{{ t('createListing.step4.price') }} *</label>
                <div class="input-group">
                  <input type="number" id="price" v-model.number="listing.price" required placeholder="0">
                  <select id="currency" v-model="listing.currency">
                    <option value="USD">USD</option>
                    <option value="UAH">UAH</option>
                  </select>
                </div>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 4">
              <h2>{{ t('createListing.step5.title') }}</h2>
              <div class="form-group">
                <label for="description">{{ t('createListing.step5.label') }}</label>
                <textarea id="description" v-model="listing.description" rows="6"></textarea>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 5">
              <h2>{{ t('createListing.step6.title') }} <small>* {{ t('createListing.required') }}</small></h2>
              <PhotoUploader 
                :maxFiles="10" 
                @files-updated="updateFiles" 
                @remove-existing="handlePhotoDeletion"
                :initialFiles="listingPhotos"
              />
            </section>
          </Transition>
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            class="btn-secondary" 
            @click="prevStep" 
            :disabled="isSubmitting"
            v-if="currentStep > 1"
          >
            {{ t('createListing.buttons.back') }}
          </button>
          
          <button 
            type="button" 
            class="btn-secondary" 
            @click="handleDraft" 
            :disabled="isSubmitting"
            style="margin-right: auto; margin-left: 10px;"
          >
              💾 {{ t('createListing.buttons.saveDraft') }}
          </button>
          
          <button 
            type="button" 
            class="btn-submit" 
            @click="nextStep" 
            :disabled="isSubmitting"
            v-if="currentStep < steps.length"
          >
            {{ t('createListing.buttons.next') }}
          </button>

          <button 
            type="submit" 
            class="btn-submit" 
            :disabled="isSubmitting"
            v-if="currentStep === steps.length"
          >
            {{ submitButtonText }}
          </button>
        </div>

      </form>
    </div>
    
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="spinner"></div>
      <h2>{{ t('createListing.buttons.submitting') }}</h2>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'; 
import { useRoute, useRouter } from 'vue-router'; 
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import PhotoUploader from '@/components/PhotoUploader.vue'; 
import { useAuth } from '@/store/auth'; 

const route = useRoute(); 
const router = useRouter();
const toast = useToast();
const { t, te } = useI18n();
const { token, user } = useAuth();
const DRAFT_STORAGE_KEY = 'newListingDraft';

const API_HOST = 'https://backend-auto-market.onrender.com/api';

// --- РЕЖИМ РЕДАКТИРОВАНИЯ ---
const listingId = ref(route.params.id); 
const isEditMode = computed(() => !!listingId.value);
const isSubmitting = ref(false);
const isDataLoading = ref(isEditMode.value); 
const pageTitle = computed(() => 
  isEditMode.value ? t('editListing.title') : t('createListing.title')
);
const submitButtonText = computed(() => {
    if (isSubmitting.value) {
        return t('createListing.buttons.submitting');
    }
    return isEditMode.value ? t('editListing.buttons.saveChanges') : t('createListing.buttons.submit');
});

// --- СПИСКИ ДАНИХ ---
const lists = ref({
  vehicleTypes: [],
  brands: [],
  models: [],
  bodyTypes: [],
  regions: [],
  cities: [],
  conditions: [], 
  fuelTypes: [],
  gearTypes: [],
});

// --- ДАНІ ОГОЛОШЕННЯ (ОЧИЩЕНО) ---
const listing = ref({
  vehicleTypeId: null,
  brandId: null,
  modelId: null,
  bodyTypeId: null,
  year: new Date().getFullYear(),
  mileage: '',
  regionId: null,
  cityId: null,
  fuelTypeId: null,
  gearTypeId: null,
  isPublished: false,
  colorHex: '', 
  inAccident: false,
  conditionId: null, 
  price: '',
  currency: 'USD', 
  description: '',
  photosToDelete: [] 
});
const listingPhotos = ref([]); 
const currentStep = ref(1);
const steps = ref([
  { titleKey: 'createListing.steps.basic' },
  { titleKey: 'createListing.steps.specs' },
  { titleKey: 'createListing.steps.price' },      
  { titleKey: 'createListing.steps.description' }, 
  { titleKey: 'createListing.steps.photos' }       
]);

const colorOptions = [
  { name: 'Чорний', hex: '#000000' },
  { name: 'Білий', hex: '#FFFFFF' },
  { name: 'Сірий', hex: '#808080' },
  { name: 'Червоний', hex: '#FF0000' },
  { name: 'Синій', hex: '#0000FF' },
  { name: 'Зелений', hex: '#008000' },
  { name: 'Інший', hex: '#CCCCCC' },
];

const years = computed(() => {
  const currentYear = new Date().getFullYear();
  const startYear = 1970;
  let yearList = [];
  for (let i = currentYear; i >= startYear; i--) {
    yearList.push(i);
  }
  return yearList;
});

function getLabel(category, serverName) {
  if (!serverName) return '';
  const keyRaw = serverName.toLowerCase()
    .replace(/\s+/g, '_')     
    .replace(/\//g, '_')      
    .replace(/,/g, '')        
    .replace(/\./g, '');      
    
  const fullKey = `options.${category}.${keyRaw}`;
  if (te(fullKey)) {
    return t(fullKey); 
  }
  return serverName; 
}
async function fetchListingData(id) {
   isDataLoading.value = true;
    try {
        const res = await axios.get(`${API_HOST}/Listing/${id}`);
        const data = res.data;

        const vehicleTypeId = data.vehicleType?.id ?? data.model?.brand?.vehicleTypeId ?? null;
        const brandId = data.brand?.id ?? data.model?.brandId ?? null;
        const modelId = data.model?.id ?? null; 
        const regionId = data.region?.id ?? data.city?.regionId ?? null;
        listing.value.isPublished = data.isPublished;
        listing.value.vehicleTypeId = vehicleTypeId;
        listing.value.brandId = brandId;
        listing.value.regionId = regionId;
        listing.value.modelId = modelId; 

        await fetchBrands(vehicleTypeId);
        await fetchModels(brandId, vehicleTypeId);
        await fetchBodyTypes(modelId); 
        await fetchCities(regionId);
        
        listing.value.cityId = data.city?.id ?? null;
        listing.value.bodyTypeId = data.bodyType?.id ?? null; 
        listing.value.year = data.year;
        listing.value.mileage = data.mileage;
        listing.value.fuelTypeId = data.fuelType?.id ?? data.fuelTypeId ?? null;
        listing.value.gearTypeId = data.gearType?.id ?? data.gearTypeId ?? null;
        
        listing.value.colorHex = data.colorHex;
        listing.value.inAccident = data.hasAccident;
        listing.value.conditionId = data.condition?.id ?? data.conditionId ?? null;

        listing.value.price = data.price;
        listing.value.currency = data.currency;
        listing.value.description = data.description;
        
        if (data.photoUrls && Array.isArray(data.photoUrls)) {
            
            if (data.photoUrls.length > 0 && typeof data.photoUrls[0] === 'object') {
                 listingPhotos.value = data.photoUrls.map(p => ({ 
                    url: p.url,      
                    id: p.id,       
                    isExisting: true 
                }));
            } 
            else {
                 listingPhotos.value = data.photoUrls.map((url, index) => ({ 
                    url: url, 
                    id: -index, 
                    isExisting: true 
                }));
            }
        } else {
            listingPhotos.value = [];
        }

    } catch (e) {
        console.error("Помилка завантаження даних:", e);
        toast.error(t('editListing.toast.fetchError'));
        router.push('/profile');
    } finally {
        isDataLoading.value = false;
    }
}

async function fetchBrands(typeId) {
    if (!typeId) return (lists.value.brands = []);
    try {
        const res = await axios.get(`${API_HOST}/VehicleBrand/for-type/${typeId}`);
        lists.value.brands = res.data;
    } catch (e) { console.error(e); lists.value.brands = []; }
}
async function fetchModels(brandId, typeId) {
    if (!brandId || !typeId) return (lists.value.models = []);
    try {
        const res = await axios.get(`${API_HOST}/VehicleModel`, {
            params: { brandId: brandId, vehicleTypeId: typeId }
        });
        lists.value.models = res.data;
    } catch (e) { console.error(e); lists.value.models = []; }
}
async function fetchBodyTypes(modelId) {
    if (!modelId) return (lists.value.bodyTypes = []);
    try {
        const res = await axios.get(`${API_HOST}/VehicleBodyType/for-model/${modelId}`);
        lists.value.bodyTypes = res.data;
    } catch (e) { console.error(e); lists.value.bodyTypes = []; }
}
async function fetchCities(regionId) {
    if (!regionId) return (lists.value.cities = []);
    try {
        const res = await axios.get(`${API_HOST}/City/for-region/${regionId}`);
        lists.value.cities = res.data;
    } catch (e) { console.error(e); lists.value.cities = []; }
}

// --- МОНТУВАННЯ ---
onMounted(async () => {
  try {
    const [types, reg, cond, fuels, gears] = await Promise.all([
      axios.get(`${API_HOST}/VehicleType`),
      axios.get(`${API_HOST}/Region`),
      axios.get(`${API_HOST}/VehicleCondition`),
      axios.get(`${API_HOST}/FuelType`),
      axios.get(`${API_HOST}/GearType`)
    ]);

    lists.value.vehicleTypes = types.data;
    lists.value.regions = reg.data;
    lists.value.conditions = cond.data;
    lists.value.fuelTypes = fuels.data;
    lists.value.gearTypes = gears.data;
    
    if (isEditMode.value) {
        await fetchListingData(listingId.value);
    }
  } catch (e) {
    console.error("Помилка завантаження списків:", e);
    if (isEditMode.value) {
        toast.error(t('editListing.toast.fetchError'));
        router.push('/profile');
    }
  }
});

// --- WATCHERS ---
watch(() => listing.value.vehicleTypeId, async (newId) => {
    if (isDataLoading.value) return; 
    listing.value.brandId = null;
    listing.value.modelId = null;
    await fetchBrands(newId);
});
watch(() => listing.value.brandId, async (newBrandId) => {
    if (isDataLoading.value) return; 
    listing.value.modelId = null;
    await fetchModels(newBrandId, listing.value.vehicleTypeId);
});
watch(() => listing.value.modelId, async (newId) => {
    if (isDataLoading.value) return; 
    listing.value.bodyTypeId = null;
    await fetchBodyTypes(newId);
});
watch(() => listing.value.regionId, async (newId) => {
    if (isDataLoading.value) return; 
    listing.value.cityId = null;
    await fetchCities(newId);
});

// --- ОБРОБКА ФОТО ---
function updateFiles(files) {
    listingPhotos.value = files; // Тільки НОВІ файли
}

function handlePhotoDeletion(deletedId) {
    if (!listing.value.photosToDelete.includes(deletedId)) {
        listing.value.photosToDelete.push(deletedId);
        toast.info(t('editListing.toast.photoMarkedForDeletion'));
    }
}

// --- НАВІГАЦІЯ ---
function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
}

function nextStep() {
  if (currentStep.value === 1) {
    if (!listing.value.vehicleTypeId || !listing.value.brandId || !listing.value.modelId || !listing.value.regionId || !listing.value.cityId || !listing.value.bodyTypeId) {
        toast.warning(t('createListing.toast.fillField', { field: 'Required fields' }));
        return;
    }
  }
  if (currentStep.value === 2) {
      if (!listing.value.fuelTypeId || !listing.value.gearTypeId || !listing.value.colorHex || !listing.value.conditionId) {
        toast.warning(t('createListing.toast.fillField', { field: 'Required fields' }));
        return;
      }
  }
  if (currentStep.value < steps.value.length) {
      currentStep.value++;
      window.scrollTo(0,0);
  }
}function getFormData() {
  const formData = new FormData();
  
  if (isEditMode.value && listingId.value) {
      formData.append('Id', listingId.value);
  }

  // FK
  if (listing.value.modelId) formData.append('ModelId', listing.value.modelId);
  if (listing.value.bodyTypeId) formData.append('BodyTypeId', listing.value.bodyTypeId);
  if (listing.value.conditionId) formData.append('ConditionId', listing.value.conditionId);
  if (listing.value.cityId) formData.append('CityId', listing.value.cityId);
  if (listing.value.fuelTypeId) formData.append('FuelTypeId', listing.value.fuelTypeId);
  if (listing.value.gearTypeId) formData.append('GearTypeId', listing.value.gearTypeId);
  
  // Fields
  formData.append('Year', listing.value.year);
  formData.append('Mileage', listing.value.mileage || 0);
  formData.append('Price', listing.value.price || 0);
  formData.append('Description', listing.value.description || '');
  formData.append('ColorHex', listing.value.colorHex || '#000000'); 
  formData.append('HasAccident', listing.value.inAccident);
  
  const userPhone = user?.value?.phoneNumber || '0000000000';
  formData.append('Number', userPhone);

  if (listing.value.photosToDelete && Array.isArray(listing.value.photosToDelete)) {
    listing.value.photosToDelete.forEach(id => {
        if (Number.isInteger(id) && id > 0) {
            formData.append('PhotosToRemove', id); 
        }
    });
  }

  if (listingPhotos.value.length) {
    listingPhotos.value.forEach((file) => {
       if (file instanceof File) {
           formData.append('NewPhotos', file); 
       }
    });
  }
  
  return formData;
}
async function handleSubmit() {
  if (isSubmitting.value) return;
  
  const hasExistingPhotos = listingPhotos.value.some(p => p.isExisting);
  const hasNewPhotos = listingPhotos.value.some(p => p instanceof File);
  
  if (!hasExistingPhotos && !hasNewPhotos) {
      toast.warning(t('createListing.toast.addPhoto'));
      return;
  }

  isSubmitting.value = true;
  
  let url = '';
  let method = '';

  if (isEditMode.value) {
      if (listing.value.isPublished === false) {
          url = `${API_HOST}/Listing/draft/${listingId.value}/publish`;
          method = 'post';
      } else {
          url = `${API_HOST}/Listing/${listingId.value}`;
          method = 'put';
      }
  } else {
      url = `${API_HOST}/Listing`;
      method = 'post';
  }

  try {
    const formData = getFormData();
    
    await axios[method](url, formData, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    toast.success(t('createListing.toast.submitSuccess'));
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    router.push('/profile');
    
  } catch (error) {
    console.error("Помилка обробки оголошення:", error);
    handleError(error);
  } finally {
    isSubmitting.value = false;
  }
}
// --- ВІДПРАВКА ЧЕРНЕТКИ (DRAFT) ---
async function handleDraft() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  
  // Логика выбора URL для черновика:
  // Редактирование черновика: PUT api/Listing/draft/{id}
  // Создание нового черновика: POST api/Listing/draft
  const url = isEditMode.value 
      ? `${API_HOST}/Listing/draft/${listingId.value}` 
      : `${API_HOST}/Listing/draft`; 
      
  const method = isEditMode.value ? 'put' : 'post';

  try {
    const formData = getFormData();
    // DraftVehicleListingRequest на бэке ждет 'NewPhotos' - тут всё совпадает идеально
    
    await axios[method](url, formData, {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'multipart/form-data'
      }
    });
    toast.success(t('createListing.toast.draftSaved'));
  } catch (error) {
    console.error("Помилка чернетки:", error);
    handleError(error);
  } finally {
    isSubmitting.value = false;
  }
}

// Вспомогательная функция для красивого вывода ошибок
function handleError(error) {
    let msg = "Сталася помилка";
    if (error.response?.data?.title) {
        msg = error.response.data.title;
    } else if (typeof error.response?.data === 'string') {
        msg = error.response.data;
    } else if (error.response?.data?.errors) {
        // Собираем все ошибки валидации в одну строку
        msg = Object.values(error.response.data.errors).flat().join('\n');
    }
    toast.error(msg);
}
</script>
<style scoped>
.create-listing-view {
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
.create-listing-view::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 0;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header-row h1 {
  margin: 0;
  text-align: left;
}
.btn-text {
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}
.btn-text:hover {
  color: #fff;
}
.form-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}
.form-card {
  background-color: rgba(30, 30, 30, 0.7);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 30px;
}
.form-card h2 {
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 10px;
  font-weight: 500;
}
.form-card h2 small {
  font-size: 13px;
  color: #ccc;
  font-weight: 400;
  margin-left: 10px;
}
.form-group {
  margin-bottom: 20px;
  position: relative;
  flex: 1;
}
.form-group label {
  width: 100%;
  display: block;
  font-size: 14px; 
  font-weight: 500;
  margin-bottom: 8px;
  color: #fff;
  text-align: left;
}
.form-group input,
.form-group textarea,
.form-group select {
  display: block;
  width: 100%;
  height: 45px;
  padding: 0 12px;
  border-radius: 3px;
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555;
  font-size: 14px;
  font-weight: 300;
  color: #fff;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  box-sizing: border-box;
}
.form-group textarea {
  height: auto;
  padding: 12px;
  min-height: 120px;
  resize: none;
}
.form-group select {
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
.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #ffd700;
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  outline: none;
}
.form-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
@media (min-width: 768px) {
  .form-row {
    flex-direction: row;
  }
}
.price-group .input-group {
  display: flex;
  gap: 10px; 
}
.price-group .input-group input {
  width: 100%;
}
.price-group .input-group select {
  width: 100px;
  flex-shrink: 0;
}
.checkbox-group {
  display: flex;
  align-items: center;
  padding-top: 0; 
}
.form-row .checkbox-group {
  padding-top: 30px; 
}
.checkbox-group.single-checkbox {
  padding-top: 0; 
}
.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 12px;
  flex-shrink: 0;
  cursor: pointer;
  background-color: rgba(255,255,255,0.1); 
  border: 1px solid #555;
  border-radius: 3px;
  appearance: none;
  position: relative;
  transition: background-color 0.2s, border-color 0.2s;
}
.checkbox-group input[type="checkbox"]:checked {
  background-color: #ffd700;
  border-color: #ffd700;
}
.checkbox-group input[type="checkbox"]:checked::after {
  content: '✔';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-size: 12px;
  font-weight: bold;
}
.checkbox-group label {
  margin-bottom: 0;
  font-weight: 300;
  text-align: left;
  cursor: pointer;
}
.comfort-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}
@media (min-width: 576px) {
  .comfort-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (min-width: 768px) {
  .comfort-grid {
    grid-template-columns: 1fr 1fr 1fr; 
  }
}
.comfort-grid .checkbox-group {
  padding-top: 0;
}
.progressbar-wrapper {
  width: 100%;
  margin-bottom: 30px;
}
.progressbar {
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  list-style: none;
}
.progressbar li {
  flex: 1;
  text-align: center;
  position: relative;
  color: #aaa;
  font-size: 12px;
  font-weight: 500;
  transition: color 0.3s ease;
}
.progressbar li::before {
  content: '';
  display: block;
  width: 20px;
  height: 20px;
  background: #555;
  border: 2px solid #555;
  border-radius: 50%;
  margin: 0 auto 8px auto;
  transition: all 0.3s ease;
}
.progressbar li::after {
  content: '';
  position: absolute;
  top: 10px;
  left: -50%;
  width: 100%;
  height: 2px;
  background: #555;
  z-index: -1;
  transition: all 0.3s ease;
}
.progressbar li:first-child::after {
  content: none;
}
.progressbar li.active {
  color: #fff;
}
.progressbar li.active::before {
  background: #ffd700;
  border-color: #ffd700;
}
.progressbar li.active::after {
  background: #ffd700;
}
.progressbar li span {
  display: none; 
}
@media (min-width: 768px) {
  .progressbar li span {
    display: block; 
  }
}
.step-content {
  margin-bottom: 25px; 
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease-out;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.form-actions {
  display: flex;
  justify-content: space-between; 
  gap: 15px;
}
.btn-submit {
  font-family: 'Open Sans', sans-serif;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  background-color: #cc0000;
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
  flex: 2;
}
.btn-submit:hover {
  background-color: #aa0000;
}
.btn-submit:disabled {
  background-color: #555;
  cursor: not-allowed;
}
.btn-secondary {
  font-family: 'Open Sans', sans-serif;
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
  background-color: rgba(255,255,255,0.27); 
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
  flex: 1;
}
.btn-secondary:hover {
  background-color: rgba(255,255,255,0.4);
}
.btn-secondary:disabled {
  background-color: #555;
  color: #999;
  cursor: not-allowed;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: white;
  font-family: 'Open Sans', sans-serif;
}
.loading-overlay h2 {
  margin-top: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
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
</style>