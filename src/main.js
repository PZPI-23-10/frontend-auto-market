import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'
import ua from './locales/ua.json'
import en from './locales/en.json'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const i18n = createI18n({
  legacy: false, 
  locale: localStorage.getItem('lang') || 'ua', 
  fallbackLocale: 'en', 
  messages: {
    ua: ua, 
    en: en 
  }
})
const options = {
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
app.use(Toast   );
app.use(i18n)
app.mount('#app')