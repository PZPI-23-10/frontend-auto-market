import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import gAuthPlugin from 'vue3-google-oauth2'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const gAuthOptions = {
  clientId: '3034698813-85db3r4l3983dd6onqi9fejios94cbg7.apps.googleusercontent.com',
  scope: 'email profile openid', // Запитуємо email та профіль
  prompt: 'consent'
}

const options = {
    timeout: 3500,                // Скільки висітимуть (в мілісекундах)
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
app.use(Toast, options);
app.use(gAuthPlugin, gAuthOptions)
app.mount('#app')