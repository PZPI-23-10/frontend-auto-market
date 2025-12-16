import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import ua from './locales/ua.json'
import en from './locales/en.json'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// 1. ВАЖНО: Стили Leaflet подключены
import 'leaflet/dist/leaflet.css'; 

// Если у вас есть глобальные стили (например, для body margin: 0), подключите их тут:
// import './assets/main.css'; 

const i18n = createI18n({
  legacy: false, 
  locale: localStorage.getItem('lang') || 'ua', 
  fallbackLocale: 'en', 
  messages: {
    ua: ua, 
    en: en 
  }
})

const toastOptions = {
    timeout: 3500,               
    closeOnClick: true,           
    pauseOnFocusLoss: true,       
    pauseOnHover: true,           
    draggable: true,             
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,       
    closeButton: "button",        
    icon: true,                   
    rtl: false
};

const app = createApp(App)

app.use(router)
app.use(i18n)

app.use(Toast, toastOptions); 

app.mount('#app')