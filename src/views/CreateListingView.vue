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
              <h2>{{ t('createListing.step1.title') }} <small> {{ t('createListing.required') }}</small></h2>
              
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
                  <input type="number" id="mileage" v-model.number="listing.mileage" required :placeholder="t('createListing.step1.mileagePlaceholder')" @keydown="preventInvalidInput">
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

              <div class="identification-section">
                <label style="margin-bottom: 10px; display: block; font-weight: 600;">
                  {{ t('createListing.step1.identificationTitle') }}
                </label>
                
                <div class="toggle-container">
                  <button type="button" class="toggle-btn" :class="{ active: inputType === 'plate' }" @click="switchInputType('plate')">
                    {{ t('createListing.step1.plateBtn') }}
                  </button>
                  <button type="button" class="toggle-btn" :class="{ active: inputType === 'vin' }" @click="switchInputType('vin')">
                    {{ t('createListing.step1.vinBtn') }}
                  </button>
                </div>

                <div v-if="inputType === 'plate'" class="form-group fade-in">
                  <input type="text" id="licensePlate" v-model="listing.licensePlate" @input="formatLicensePlate" placeholder="AA1234BB" maxlength="8" class="plate-input">
                  <small style="color: #aaa; margin-top: 5px; display: block;">
                    {{ t('createListing.step1.plateHint') }}
                  </small>
                </div>

                <div v-if="inputType === 'vin'" class="form-group fade-in">
                  <div class="input-wrapper" :class="{ 'has-error': vinError || vinStatus === 'invalid', 'has-success': vinStatus === 'valid', 'has-warning': vinStatus === 'warning' }">
                    <input type="text" id="vin" v-model="listing.vin" @input="handleVinInput" placeholder="WBA..." maxlength="17" :class="{ 'input-error': vinError || vinStatus === 'invalid', 'input-success': vinStatus === 'valid', 'input-warning': vinStatus === 'warning' }">
                    
                    <span v-if="vinStatus === 'loading'" class="status-icon"><div class="mini-spinner"></div></span>
                    <span v-if="vinStatus === 'valid'" class="status-icon valid-icon">✅</span>
                    <span v-if="vinStatus === 'warning'" class="status-icon warning-icon">⚠️</span>
                    <span v-if="vinStatus === 'invalid' || vinError" class="status-icon invalid-icon">❌</span>
                  </div>
                  
                  <small v-if="vinError" class="error-message">{{ vinError }}</small>
                  <small v-else-if="vinStatus === 'invalid'" class="error-message">{{ vinStatusMsg }}</small>
                  <small v-else-if="vinStatus === 'valid'" style="color: #2ecc71; margin-top: 5px; display: block; font-weight: 600;">
                    {{ vinStatusMsg }} {{ t('createListing.step1.vinVerified') }}
                  </small>
                  <small v-else-if="vinStatus === 'warning'" style="color: #f1c40f; margin-top: 5px; display: block; font-weight: 600;">{{ vinStatusMsg }}</small>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="region">{{ t('createListing.step1.region') }} *</label>
                  <select id="region" v-model="listing.regionId" required>
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="r in lists.regions" :key="r.id" :value="r.id">{{ getLabel('region', r.name) }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label for="city">{{ t('createListing.step1.city') }} *</label>
                  <select id="city" v-model="listing.cityId" required :disabled="!listing.regionId">
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="c in lists.cities" :key="c.id" :value="c.id">{{ getLabel('city', c.name) }}</option>
                  </select>
                </div>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 2">
               <h2>
                 {{ t('createListing.step2.mapTitle') }} 
                 <small>{{ t('createListing.step2.required') }}</small>
               </h2>
               <p style="color: #aaa; font-size: 14px; margin-bottom: 15px;">
                   {{ t('createListing.step2.mapHint') }}
               </p>
               
               <div id="map-container" class="map-container"></div>
               
               <div v-if="listing.latitude && listing.longitude" class="coords-display">
                   {{ t('createListing.step2.coordsSelected') }} {{ listing.latitude.toFixed(6) }}, {{ listing.longitude.toFixed(6) }}
               </div>
               <div v-else class="coords-display error">
                   {{ t('createListing.step2.coordsError') }}
               </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 3">
              <h2>{{ t('createListing.step3.title') }} <small> {{ t('createListing.required') }}</small></h2>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="fuel">{{ t('createListing.step3.fuel') }} *</label>
                  <select id="fuel" v-model="listing.fuelTypeId" required>
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="fuel in lists.fuelTypes" :key="fuel.id" :value="fuel.id">
                      {{ getLabel('fuel', fuel.name) }}
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="transmission">{{ t('createListing.step3.transmission') }} *</label>
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
                  <label for="technicalCondition">{{ t('createListing.step3.technicalCondition') }} *</label>
                  <select id="technicalCondition" v-model="listing.conditionId" required>
                    <option :value="null" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="cond in lists.conditions" :key="cond.id" :value="cond.id">
                      {{ getLabel('techState', cond.name) }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="color">{{ t('createListing.step3.color') }} *</label>
                  <select id="color" v-model="listing.colorHex" required>
                    <option value="" disabled>{{ t('createListing.select') }}</option>
                    <option v-for="c in colorOptions" :key="c.hex" :value="c.hex">
                      {{ t('options.color.' + c.hex) }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group checkbox-group single-checkbox">
                  <input type="checkbox" id="inAccident" v-model="listing.inAccident">
                  <label for="inAccident">{{ t('createListing.step3.inAccident') }}</label>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 4">
              <h2>{{ t('createListing.step4.title') }} <small> {{ t('createListing.required') }}</small></h2>
              <div class="form-group price-group">
                <label for="price">{{ t('createListing.step4.price') }} *</label>
                <div class="input-group">
                  <input type="number" id="price" v-model.number="listing.price" required placeholder="0" @keydown="preventInvalidInput">
                  <select id="currency" v-model="listing.currency">
                    <option value="USD">USD</option>
                    <option value="UAH">UAH</option>
                  </select>
                </div>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 5">
              <h2>{{ t('createListing.step5.title') }}</h2>
              <div class="form-group">
                <label for="description">{{ t('createListing.step5.label') }}</label>
                <textarea id="description" v-model="listing.description" rows="6"></textarea>
              </div>
            </section>
            
            <section class="form-card" v-else-if="currentStep === 6">
              <h2>{{ t('createListing.step6.title') }} <small> {{ t('createListing.required') }}</small></h2>
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
            v-if="!listing.isPublished" 
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
import { ref, computed, watch, onMounted, nextTick } from 'vue'; 
import { useRoute, useRouter } from 'vue-router'; 
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import PhotoUploader from '@/components/PhotoUploader.vue'; 
import { useAuth } from '@/store/auth'; 

// --- LEAFLET IMPORTS ---
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// -----------------------

const route = useRoute(); 
const router = useRouter();
const toast = useToast();
const { t, te } = useI18n();
const { token } = useAuth();
const DRAFT_STORAGE_KEY = 'newListingDraft';

const API_HOST = 'https://backend-auto-market-wih5h.ondigitalocean.app/api';

// --- STATE ---
const listingId = ref(route.params.id); 
const isEditMode = computed(() => !!listingId.value);
const isSubmitting = ref(false);
const isDataLoading = ref(isEditMode.value); 

const vinError = ref(''); 
const inputType = ref('plate');
const vinStatus = ref(null);
const vinStatusMsg = ref(''); 

const pageTitle = computed(() => isEditMode.value ? t('editListing.title') : t('createListing.title'));
const submitButtonText = computed(() => {
    if (isSubmitting.value) return t('createListing.buttons.submitting');
    return isEditMode.value ? t('editListing.buttons.saveChanges') : t('createListing.buttons.submit');
});

const lists = ref({ vehicleTypes: [], brands: [], models: [], bodyTypes: [], regions: [], cities: [], conditions: [], fuelTypes: [], gearTypes: [] });

const listing = ref({
  vehicleTypeId: null, brandId: null, modelId: null, bodyTypeId: null,
  year: new Date().getFullYear(), mileage: '',
  regionId: null, cityId: null,
  fuelTypeId: null, gearTypeId: null,
  isPublished: false, colorHex: '', inAccident: false, conditionId: null, 
  price: '', currency: 'USD', description: '',
  licensePlate: '', vin: '', 
  latitude: null, longitude: null, 
  photosToDelete: [] 
});
const listingPhotos = ref([]); 
const currentStep = ref(1);

// --- STEPS ---
const steps = ref([
  { titleKey: 'createListing.steps.basic' }, 
  { titleKey: 'createListing.steps.map' }, 
  { titleKey: 'createListing.steps.specs' },
  { titleKey: 'createListing.steps.price' }, 
  { titleKey: 'createListing.steps.description' }, 
  { titleKey: 'createListing.steps.photos' }       
]);

const colorOptions = [{ hex: '#000000' }, { hex: '#ffffff' }, { hex: '#808080' }, { hex: '#cccccc' }, { hex: '#ff0000' }, { hex: '#0000ff' }, { hex: '#008000' }];
const years = computed(() => Array.from({length: new Date().getFullYear() - 1969}, (_, i) => new Date().getFullYear() - i));

const preventInvalidInput = (e) => { if (['-', '+', 'e', 'E'].includes(e.key)) e.preventDefault(); };

function getLabel(cat, name) {
  if (!name) return '';
  const keyRaw = name.toLowerCase().replace(/['’\s\/,.]/g, '_');
  const fullKey = `options.${cat}.${keyRaw}`;
  return te(fullKey) ? t(fullKey) : name; 
}

// --- LOGIC: Input Switch ---
function switchInputType(type) {
    inputType.value = type;
    vinError.value = '';
}

// --- LOGIC: VIN ---
function handleVinInput(event) { 
    let val = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length > 17) val = val.slice(0, 17);
    listing.value.vin = val;
    event.target.value = val; 
    vinError.value = ''; 
    vinStatus.value = null;
    vinStatusMsg.value = '';
    if (val.length === 17) checkVinData(val);
}
const isManualMode = ref(false);

async function checkVinData(vin) {
    vinStatus.value = 'loading';
    vinStatusMsg.value = '';
    isManualMode.value = false;

    try {
        const res = await axios.get(`${API_HOST}/VehicleCheck/vin/${vin}`);
        const apiData = res.data;
        vinStatus.value = 'valid';
        vinStatusMsg.value = `${apiData.brand} ${apiData.model} (${apiData.year})`;
        
       if (apiData.digits) {
            listing.value.licensePlate = apiData.digits;
            toast.success(`Номер ${apiData.digits} знайдено!`);
        } else if (apiData.number) {
            listing.value.licensePlate = apiData.number;
        }
    } catch(e) {
       if (e.response && e.response.status === 404) {
             vinStatus.value = 'warning'; 
             vinStatusMsg.value = "Авто не знайдено в базі. Заповніть дані вручну.";
             isManualMode.value = true;
        } else {
             vinStatus.value = 'invalid';
             vinStatusMsg.value = "Помилка перевірки VIN";
        }
    }
}

// --- MAP LOGIC ---
let map = null;
let marker = null;

const initMap = () => {
    if (map) {
        map.remove();
        map = null;
        marker = null; // Очищення маркера
    }

    const container = document.getElementById('map-container');
    if (!container) return;

    // Центр України за замовчуванням
    const defaultCoords = [48.3794, 31.1656]; 
    const initialZoom = 6;
    
    // Перевірка: чи є валідні координати (не null і не 0)
    const hasCoords = listing.value.latitude && listing.value.longitude;
    
    const viewCoords = hasCoords 
        ? [listing.value.latitude, listing.value.longitude] 
        : defaultCoords;
        
    const viewZoom = hasCoords ? 13 : initialZoom;

    map = L.map('map-container').setView(viewCoords, viewZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    if (hasCoords) {
        marker = L.marker([listing.value.latitude, listing.value.longitude]).addTo(map);
    }

    map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        // Зберігаємо як числа
        listing.value.latitude = lat;
        listing.value.longitude = lng;

        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker(e.latlng).addTo(map);
        }
    });
    
    setTimeout(() => {
        if(map) map.invalidateSize();
    }, 100);
};

// --- WATCHER FIX ---
watch(currentStep, (newStep) => {
    if (newStep === 2) {
        // Чекаємо завершення анімації переходу (Transition)
        setTimeout(() => {
            initMap();
        }, 500); 
    }
});

// --- DATA FETCHING ---
async function fetchListingData(id) {
    isDataLoading.value = true;
    try {
        const res = await axios.get(`${API_HOST}/Listing/${id}`);
        const data = res.data;
        
        if (data.vin) inputType.value = 'vin';
        else inputType.value = 'plate';

        const vehicleTypeId = data.vehicleType?.id ?? data.model?.brand?.vehicleTypeId;
        const brandId = data.brand?.id ?? data.model?.brandId;
        const modelId = data.model?.id; 
        const regionId = data.region?.id ?? data.city?.regionId;
        
        listing.value.isPublished = data.isPublished;
        listing.value.vehicleTypeId = vehicleTypeId;
        listing.value.brandId = brandId;
        listing.value.regionId = regionId;
        listing.value.modelId = modelId; 

        await Promise.all([
            fetchBrands(vehicleTypeId), fetchModels(brandId, vehicleTypeId),
            fetchBodyTypes(modelId), fetchCities(regionId)
        ]);
        
        Object.assign(listing.value, {
            cityId: data.city?.id, bodyTypeId: data.bodyType?.id,
            year: data.year, mileage: data.mileage,
            fuelTypeId: data.fuelType?.id ?? data.fuelTypeId,
            gearTypeId: data.gearType?.id ?? data.gearTypeId,
            colorHex: data.colorHex, inAccident: data.hasAccident,
            conditionId: data.condition?.id ?? data.conditionId,
            price: data.price, currency: data.currency || 'USD', description: data.description,
            licensePlate: data.number || '', 
            vin: data.vin || '',
            // Якщо координати 0 (дефолт бекенда), ставимо null, щоб карта не ставила маркер в океані
            latitude: (data.latitude && data.latitude !== 0) ? data.latitude : null,
            longitude: (data.longitude && data.longitude !== 0) ? data.longitude : null
        });
        
        if (listing.value.vin && listing.value.vin.length === 17) {
            checkVinData(listing.value.vin);
        }
        
        let rawPhotos = data.photos || data.photoUrls || [];
        if (Array.isArray(rawPhotos) && rawPhotos.length > 0) {
            if (typeof rawPhotos[0] === 'object') {
                rawPhotos.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
                listingPhotos.value = rawPhotos.map(p => ({ url: p.url, id: p.id, isExisting: true }));
            } else {
                listingPhotos.value = rawPhotos.map((url, index) => ({ url: url, id: -index, isExisting: true }));
            }
        } else listingPhotos.value = [];

    } catch (e) {
        console.error(e);
        toast.error(t('editListing.toast.fetchError'));
        router.push('/profile');
    } finally { isDataLoading.value = false; }
}

// --- HELPERS FETCH ---
async function fetchBrands(typeId) {
    if (!typeId) return (lists.value.brands = []);
    try { lists.value.brands = (await axios.get(`${API_HOST}/VehicleBrand/for-type/${typeId}`)).data; } catch (e) { lists.value.brands = []; }
}
async function fetchModels(brandId, typeId) {
    if (!brandId || !typeId) return (lists.value.models = []);
    try { lists.value.models = (await axios.get(`${API_HOST}/VehicleModel`, { params: { brandId, vehicleTypeId: typeId } })).data; } catch (e) { lists.value.models = []; }
}
async function fetchBodyTypes(modelId) {
    if (!modelId) return (lists.value.bodyTypes = []);
    try { lists.value.bodyTypes = (await axios.get(`${API_HOST}/VehicleBodyType/for-model/${modelId}`)).data; } catch (e) { lists.value.bodyTypes = []; }
}
async function fetchCities(regionId) {
    if (!regionId) return (lists.value.cities = []);
    try { lists.value.cities = (await axios.get(`${API_HOST}/City/for-region/${regionId}`)).data; } catch (e) { lists.value.cities = []; }
}

onMounted(async () => {
  try {
    const [types, reg, cond, fuels, gears] = await Promise.all([
      axios.get(`${API_HOST}/VehicleType`), axios.get(`${API_HOST}/Region`),
      axios.get(`${API_HOST}/VehicleCondition`), axios.get(`${API_HOST}/FuelType`), axios.get(`${API_HOST}/GearType`)
    ]);
    lists.value.vehicleTypes = types.data;
    lists.value.regions = reg.data;
    lists.value.conditions = cond.data;
    lists.value.fuelTypes = fuels.data;
    lists.value.gearTypes = gears.data;
    if (isEditMode.value) await fetchListingData(listingId.value);
  } catch (e) { console.error(e); }
});

// --- WATCHERS ---
watch(() => listing.value.vehicleTypeId, async (newId) => { if(!isDataLoading.value) { listing.value.brandId = null; await fetchBrands(newId); } });
watch(() => listing.value.brandId, async (newBrandId) => { if(!isDataLoading.value) { listing.value.modelId = null; await fetchModels(newBrandId, listing.value.vehicleTypeId); } });
watch(() => listing.value.modelId, async (newId) => { if(!isDataLoading.value) { listing.value.bodyTypeId = null; await fetchBodyTypes(newId); } });
watch(() => listing.value.regionId, async (newId) => { if(!isDataLoading.value) { listing.value.cityId = null; await fetchCities(newId); } });

function updateFiles(files) { listingPhotos.value = files; }
function handlePhotoDeletion(deletedId) {
    if (!listing.value.photosToDelete.includes(deletedId)) {
        listing.value.photosToDelete.push(deletedId);
        toast.info(t('editListing.toast.photoMarkedForDeletion'));
    }
}

// --- NAV ---
function prevStep() { if (currentStep.value > 1) currentStep.value--; }
function nextStep() {
  if (currentStep.value === 1) {
    if (!listing.value.vehicleTypeId || !listing.value.brandId || !listing.value.modelId || !listing.value.regionId || !listing.value.cityId || !listing.value.bodyTypeId) {
        toast.warning(t('createListing.toast.fillField', { field: 'Required fields' }));
        return;
    }
  }
  
  // Валідація карти
  if (currentStep.value === 2) {
      if (!listing.value.latitude || !listing.value.longitude) {
           toast.warning("Будь ласка, вкажіть місцезнаходження на мапі");
           return;
      }
  }

  if (currentStep.value === 3) {
      if (!listing.value.fuelTypeId || !listing.value.gearTypeId || !listing.value.colorHex || !listing.value.conditionId) {
        toast.warning(t('createListing.toast.fillField', { field: 'Required fields' }));
        return;
      }
  }
  
  if (currentStep.value < steps.value.length) {
      currentStep.value++;
      window.scrollTo(0,0);
  }
}

function getFormData() {
  const formData = new FormData();
  
  const appendIfVal = (key, val) => {
    if (val !== null && val !== undefined && val !== '') {
      formData.append(key, val);
    }
  };

  if (isEditMode.value && listingId.value) formData.append('Id', listingId.value);

  appendIfVal('ModelId', listing.value.modelId);
  appendIfVal('BodyTypeId', listing.value.bodyTypeId);
  appendIfVal('ConditionId', listing.value.conditionId);
  appendIfVal('CityId', listing.value.cityId);
  appendIfVal('FuelTypeId', listing.value.fuelTypeId);
  appendIfVal('GearTypeId', listing.value.gearTypeId);
  
  formData.append('Year', listing.value.year);
  formData.append('Mileage', listing.value.mileage || 0);
  formData.append('Price', listing.value.price || 0);
  
  formData.append('Description', listing.value.description || '');
  formData.append('ColorHex', listing.value.colorHex || '#000000'); 
  formData.append('HasAccident', listing.value.inAccident);
  
  if (listing.value.vin && listing.value.vin.length === 17) {
      formData.append('Vin', listing.value.vin);
  }
  if (listing.value.licensePlate && listing.value.licensePlate.length >= 3) {
      formData.append('Number', listing.value.licensePlate);
  }

  // --- ВИПРАВЛЕНА ЛОГІКА КООРДИНАТ ---
  // 1. Перевіряємо на null і undefined (0 - теж валідна координата)
  if (listing.value.latitude !== null && listing.value.latitude !== undefined) {
      // 2. Передаємо як рядок з крапкою для надійності
      // Якщо сервер вимагає кому (укр. локаль), спробуйте: .toString().replace('.', ',')
      formData.append('Latitude', listing.value.latitude.toString());
  }
  if (listing.value.longitude !== null && listing.value.longitude !== undefined) {
      formData.append('Longitude', listing.value.longitude.toString());
  }

  if (listing.value.photosToDelete) {
    listing.value.photosToDelete.forEach(id => { if (id > 0) formData.append('PhotosToRemove', id); });
  }

  let newPhotoIndex = 0;    
  let updatePhotoIndex = 0; 
  listingPhotos.value.forEach((photoItem, index) => {
      const actualFile = photoItem.file; 
      if (actualFile instanceof File) {
          formData.append(`NewPhotos[${newPhotoIndex}].File`, actualFile);
          formData.append(`NewPhotos[${newPhotoIndex}].SortOrder`, index);
          newPhotoIndex++;
      } else if (photoItem.isExisting && photoItem.id > 0) {
          formData.append(`UpdatedPhotoSortOrder[${updatePhotoIndex}].PhotoId`, photoItem.id);
          formData.append(`UpdatedPhotoSortOrder[${updatePhotoIndex}].SortOrder`, index);
          updatePhotoIndex++;
      }
  });
  
  return formData;
}

async function handleSubmit() {
  vinError.value = '';
  
  if (isSubmitting.value) return;
  
  if (listingPhotos.value.length === 0) {
      toast.warning(t('createListing.toast.addPhoto'));
      return;
  }

  if (inputType.value === 'plate') {
      if (!listing.value.licensePlate || listing.value.licensePlate.length < 3) {
          toast.warning("Вкажіть коректний держ. номер (мінімум 3 символи)");
          currentStep.value = 1;
          setTimeout(() => document.getElementById('licensePlate')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          return;
      }
  } 
  else if (inputType.value === 'vin') {
      if (!listing.value.vin || listing.value.vin.length !== 17) {
          vinError.value = "VIN код повинен містити рівно 17 символів";
          currentStep.value = 1;
          setTimeout(() => document.getElementById('vin')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          return;
      }
      if (vinStatus.value === 'invalid') {
          vinError.value = "Помилка перевірки VIN. Перевірте код або спробуйте ввести держ. номер.";
          currentStep.value = 1;
          setTimeout(() => document.getElementById('vin')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          return;
      }
      if (vinStatus.value === 'loading') {
           toast.info("Зачекайте завершення перевірки VIN...");
           return;
      }
  }

  isSubmitting.value = true;
  
  let url = isEditMode.value 
      ? (listing.value.isPublished ? `${API_HOST}/Listing/${listingId.value}` : `${API_HOST}/Listing/draft/${listingId.value}/publish`)
      : `${API_HOST}/Listing`;
  let method = isEditMode.value && listing.value.isPublished ? 'put' : 'post';

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
    console.error("Помилка:", error);
    
    const errorData = error.response?.data;
    let serverMessage = '';

    if (typeof errorData === 'string') {
          serverMessage = errorData;
    } else if (errorData?.title) {
          serverMessage = errorData.title;
    } else if (errorData?.errors) {
          const firstKey = Object.keys(errorData.errors)[0];
          serverMessage = errorData.errors[firstKey][0];
    } else if (errorData?.message) {
          serverMessage = errorData.message;
    }

    if (serverMessage && (serverMessage.includes('VIN') || inputType.value === 'vin')) {
          vinError.value = serverMessage;
          currentStep.value = 1;
          setTimeout(() => document.getElementById('vin')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else {
          handleError(error);
    }
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDraft() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;
  const url = isEditMode.value ? `${API_HOST}/Listing/draft/${listingId.value}` : `${API_HOST}/Listing/draft`; 
  const method = isEditMode.value ? 'put' : 'post';
  try {
    await axios[method](url, getFormData(), { headers: { 'Authorization': `Bearer ${token.value}` } });
    toast.success(t('createListing.toast.draftSaved'));
  } catch (error) { handleError(error); } finally { isSubmitting.value = false; }
}

function formatLicensePlate(event) {
  let value = event.target.value.toUpperCase().replace(/[^A-Z0-9А-ЯІЇЄ]/g, '');
  if (value.length > 8) value = value.slice(0, 8);
  listing.value.licensePlate = value;
  event.target.value = value;
}

function handleError(error) {
    let msg = "Сталася помилка";
    if (error.response?.data?.title) msg = error.response.data.title;
    else if (typeof error.response?.data === 'string') msg = error.response.data;
    else if (error.response?.data?.errors) msg = Object.values(error.response.data.errors).flat().join('\n');
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
.create-listing-view::before { content: ''; position: absolute; inset: 0; background: rgba(0, 0, 0, 0.6); z-index: 0; }
.header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header-row h1 { margin: 0; text-align: left; }
.form-container { max-width: 800px; margin: 0 auto; position: relative; z-index: 1; }
.form-card { background-color: rgba(30, 30, 30, 0.7); border-radius: 12px; backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.1); box-shadow: 0 0 40px rgba(8,7,16,0.6); padding: 30px; }
.form-card h2 { margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); padding-bottom: 10px; font-weight: 500; }
.form-group { margin-bottom: 20px; position: relative; flex: 1; }
.form-group label { width: 100%; display: block; font-size: 14px; font-weight: 500; margin-bottom: 8px; color: #fff; text-align: left; }
.form-group input, .form-group textarea, .form-group select { display: block; width: 100%; height: 45px; padding: 0 12px; border-radius: 3px; background-color: rgba(255,255,255,0.1); border: 1px solid #555; font-size: 14px; font-weight: 300; color: #fff; box-sizing: border-box; }
.form-group textarea { height: auto; padding: 12px; min-height: 120px; resize: none; }
.form-group select option { background: #333; color: #fff; }
.form-row { display: flex; flex-direction: column; gap: 20px; }
@media (min-width: 768px) { .form-row { flex-direction: row; } }
.price-group .input-group { display: flex; gap: 10px; }
.price-group .input-group input { width: 100%; }
.price-group .input-group select { width: 100px; flex-shrink: 0; }
.checkbox-group { display: flex; align-items: center; padding-top: 0; }
.checkbox-group input[type="checkbox"] { width: 18px; height: 18px; margin-right: 12px; cursor: pointer; }
.progressbar-wrapper { width: 100%; margin-bottom: 30px; }
.progressbar { display: flex; justify-content: space-between; padding: 0; margin: 0; list-style: none; }
.progressbar li { flex: 1; text-align: center; position: relative; color: #aaa; font-size: 12px; font-weight: 500; transition: color 0.3s ease; }
.progressbar li::before { content: ''; display: block; width: 20px; height: 20px; background: #555; border: 2px solid #555; border-radius: 50%; margin: 0 auto 8px auto; transition: all 0.3s ease; }
.progressbar li::after { content: ''; position: absolute; top: 10px; left: -50%; width: 100%; height: 2px; background: #555; z-index: -1; transition: all 0.3s ease; }
.progressbar li:first-child::after { content: none; }
.progressbar li.active { color: #fff; }
.progressbar li.active::before { background: #ffd700; border-color: #ffd700; }
.progressbar li.active::after { background: #ffd700; }
.progressbar li span { display: none; }
@media (min-width: 768px) { .progressbar li span { display: block; } }
.step-content { margin-bottom: 25px; }
.form-actions { display: flex; justify-content: space-between; gap: 15px; }
.btn-submit { padding: 12px 0; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; background-color: #cc0000; color: #fff; font-size: 16px; text-transform: uppercase; flex: 2; }
.btn-secondary { padding: 12px 0; border-radius: 6px; border: none; font-weight: 600; cursor: pointer; background-color: rgba(255,255,255,0.27); color: #fff; font-size: 16px; text-transform: uppercase; flex: 1; }
.loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 9999; color: white; }
.spinner { width: 60px; height: 60px; border: 5px solid #555; border-top-color: #ffd700; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* TABS / IDENTIFICATION */
.identification-section { background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 20px; }
.toggle-container { display: flex; gap: 10px; margin-bottom: 15px; }
.toggle-btn { flex: 1; padding: 10px; border: 1px solid #555; background: transparent; color: #aaa; border-radius: 6px; cursor: pointer; transition: all 0.3s ease; font-weight: 600; }
.toggle-btn.active { background: #ffd700; border-color: #ffd700; color: #000; }
.plate-input { text-transform: uppercase; font-weight: bold; letter-spacing: 2px; }
.input-wrapper { position: relative; }
.input-wrapper input { padding-right: 35px; }
.input-wrapper.has-error input { border-color: #e74c3c; box-shadow: 0 0 5px rgba(231, 76, 60, 0.4); }
.input-wrapper.has-success input { border-color: #2ecc71; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4); }
.status-icon { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; }
.valid-icon { font-size: 14px; }
.invalid-icon { font-size: 14px; }
.error-message { color: #e74c3c; font-size: 12px; margin-top: 5px; display: block; font-weight: 600; animation: shake 0.3s ease-in-out; }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
.fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
.mini-spinner { width: 16px; height: 16px; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: #ffd700; border-radius: 50%; animation: spin 0.8s linear infinite; }

/* MAP */
.map-container {
    width: 100%;
    height: 400px;
    border-radius: 6px;
    margin-bottom: 20px;
    border: 1px solid rgba(255,255,255,0.2);
    z-index: 10;
    position: relative; /* Важно для Leaflet */
}
.coords-display {
    padding: 10px;
    background: rgba(0,0,0,0.3);
    border-radius: 4px;
    font-size: 14px;
    color: #ffd700;
}
.coords-display.error {
    color: #e74c3c;
}
</style>