<template>
  <div class="vehicle-check-card">
    <div class="check-header">
      <div class="header-title">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
        <h3>{{ t('listingDetail.checkTitle') || 'Звіт по базі МВС' }}</h3>
      </div>
      
      <div v-if="!loading && !error && report" class="check-status" :class="report.isStolen ? 'danger' : 'success'">
        {{ report.isStolen ? 'У РОЗШУКУ' : 'Юридично чиста' }}
      </div>
    </div>

    <div v-if="loading" class="check-loading">
      <div class="spinner-small"></div>
      <span>Перевірка держ. номера...</span>
    </div>

    <div v-else-if="error" class="check-error">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      {{ error }}
    </div>

    <div v-else-if="report" class="check-body">
      <div class="check-grid">
        
        <div class="check-item">
          <span class="label">Марка/Модель:</span>
          <span class="value">{{ report.brand }} {{ report.model }}</span>
        </div>
        
        <div class="check-item">
          <span class="label">Рік випуску:</span>
          <span class="value">{{ report.year }}</span>
        </div>
        
          <div class="check-item">
    <span class="label">Колір:</span>
    <span class="value">
      <span class="color-dot" :style="{ background: report.colorHex }"></span>
      
      {{ t('options.color.' + getLabelKey(report.color)) }}
    </span>
  </div>


        
        <div class="check-item">
          <span class="label">Об'єм двигуна:</span>
          <span class="value">
            {{ formatEngine(report.engineCapacity) }} 
            <span class="sub-text">({{ report.engineCapacity }} см³)</span>
          </span>
        </div>
        
 <div class="check-item">
  <span class="label">Тип палива:</span>
  <span class="value">
    {{ t('options.fuel.' + getLabelKey(report.fuel)) }}
  </span>
</div>
        
        <div class="check-item">
          <span class="label">Дата реєстрації:</span>
          <span class="value">{{ report.lastOperationDate }}</span>
        </div>
        
      </div>
      
      <div class="check-footer">
        <p>Остання операція: <strong>{{ report.lastOperationName }}</strong></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  licensePlate: {
    type: String,
    required: true
  }
});

const { t, locale } = useI18n();
const API_HOST = 'https://backend-auto-market-wih5h.ondigitalocean.app/api'; 

const loading = ref(true);
const report = ref(null);
const error = ref(null);
function getLabelKey(key) {
  if (!key) return 'other'; // Если пусто, вернем 'other'
  return key.toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/\//g, '_')
    .replace(/,/g, '')
    .replace(/\./g, '');
}
// Хелпер для кольорів (Українські назви -> HEX)
function getColorHex(colorName) {
  if (!colorName) return '#ccc';
  const c = colorName.toLowerCase();
  
  const map = {
    'чорний': '#000000', 'black': '#000000',
    'білий': '#ffffff', 'white': '#ffffff',
    'сірий': '#808080', 'gray': '#808080', 'grey': '#808080',
    'срібний': '#c0c0c0', 'silver': '#c0c0c0',
    'синій': '#0000ff', 'blue': '#0000ff',
    'червоний': '#ff0000', 'red': '#ff0000',
    'зелений': '#008000', 'green': '#008000',
    'жовтий': '#ffff00', 'yellow': '#ffff00',
    'коричневий': '#a52a2a', 'brown': '#a52a2a',
    'бежевий': '#f5f5dc', 'beige': '#f5f5dc',
    'помаранчевий': '#ffa500', 'orange': '#ffa500',
    'фіолетовий': '#800080', 'purple': '#800080'
  };
  
  return map[c] || '#ccc';
}

function formatEngine(cc) {
  if (!cc) return '';
  return (cc / 1000).toFixed(1) + ' л.';
}

async function fetchOfficialData() {
  loading.value = true;
  error.value = null;
  report.value = null; // Скидаємо попередні дані

  if (!props.licensePlate || props.licensePlate === 'Приховано' || props.licensePlate.length < 3) {
      // Якщо номер приховано, просто не вантажимо нічого, компонент сховається через v-if у батька
      loading.value = false;
      return;
  }

  try {
    const res = await axios.get(`${API_HOST}/VehicleCheck/${props.licensePlate}`, {
        params: { lang: locale.value } 
    });
    
    const data = res.data;

    report.value = {
      brand: data.brand,
      model: data.model,
      year: data.year,
      
      color: data.color,
      colorHex: getColorHex(data.color), // Конвертуємо назву в HEX для точки
      
      engineCapacity: data.engineCapacity,
      fuel: data.fuel,
      isStolen: data.isStolen,
      
      lastOperationDate: data.lastOperationDate,
      lastOperationName: data.lastOperationName
    };

  } catch (err) {
    console.error("Помилка VehicleCheck:", err);
    if (err.response && err.response.status === 404) {
       error.value = "Авто не знайдено в базі МВС.";
    } else {
       error.value = "Сервіс перевірки тимчасово недоступний.";
    }
  } finally {
    loading.value = false;
  }
}

// Слідкуємо за зміною номера (коли завантажиться лістинг)
watch(() => props.licensePlate, (newVal) => {
    if (newVal && newVal !== 'Приховано') {
        fetchOfficialData();
    }
});

// Слідкуємо за мовою (щоб перезапитати дані, якщо API підтримує переклад)
watch(locale, () => {
   if (report.value) fetchOfficialData();
});

onMounted(() => {
  if (props.licensePlate && props.licensePlate !== 'Приховано') {
      fetchOfficialData();
  }
});
</script>

<style scoped>
.vehicle-check-card {
  /* Гарний напівпрозорий фон */
  background: rgba(40, 167, 69, 0.08); 
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
  color: #fff;
  font-family: 'Open Sans', sans-serif;
}

.check-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #e0e0e0;
}

.check-status {
  font-size: 12px;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.check-status.success {
  background: #28a745;
  color: #fff;
}

.check-status.danger {
  background: #dc3545;
  color: #fff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

.check-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #aaa;
  font-size: 14px;
  padding: 20px 0;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: #28a745;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.check-error {
    color: #ffc107;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 0;
}

.check-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* На мобільному в одну колонку */
@media (max-width: 500px) {
  .check-grid {
    grid-template-columns: 1fr;
  }
}

.check-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 11px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.value {
  font-size: 14px;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sub-text {
    font-size: 12px;
    color: #aaa;
    font-weight: 400;
    margin-left: 4px;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.5);
  display: inline-block;
}

.check-footer {
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 13px;
  color: #ccc;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>