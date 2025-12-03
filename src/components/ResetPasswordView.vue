<template>
  <div class="auth-view">
    <div class="form-container">
      <h3>Встановлення пароля</h3>
      
      <form @submit.prevent="resetPassword">
        <div class="form-group">
          <label>Новий пароль</label>
          <input type="password" v-model="password" required placeholder="••••••"/>
        </div>

        <div class="form-group">
          <label>Підтвердіть пароль</label>
          <input type="password" v-model="confirmPassword" required placeholder="••••••"/>
        </div>

        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Updating...' : 'Змінити пароль' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const API_URL = 'https://backend-auto-market.onrender.com/api/Auth/confirm-password-change';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

// Дані з URL (посилання з пошти)
const token = ref('');
const email = ref('');

onMounted(() => {
  token.value = route.query.token || '';
  email.value = route.query.email || '';

  if (!token.value || !email.value) {
    toast.error("Невірне посилання для скидання (немає токена).");
  }
});

async function resetPassword() {
  if (password.value.length < 6) { toast.warning("Пароль занадто короткий."); return; }
  if (!/\d/.test(password.value)) { toast.warning("Потрібна цифра."); return; }
  if (!/[A-Z]/.test(password.value)) { toast.warning("Потрібна велика літера."); return; }
  if (password.value !== confirmPassword.value) { toast.warning("Паролі не співпадають."); return; }

  isLoading.value = true;
  try {
    const payload = {
      email: email.value,
      token: token.value,
      newPassword: password.value
    };

    await axios.post(API_URL, payload);
    
    toast.success("Пароль успішно змінено!");
    router.push('/login');

  } catch (error) {
    console.error(error);
    const msg = error.response?.data?.message || error.response?.data || "Помилка зміни пароля";
    toast.error(msg);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
/* Ті ж самі стилі, що і вище */
.auth-view {
  min-height: 100vh;
  background-image: url('@/assets/car-header1.jpg');
  background-size: cover;
  background-position: center;
  display: flex; align-items: center; justify-content: center; position: relative;
}
.auth-view::before {
  content: ''; position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 0;
}
.form-container {
  position: relative; z-index: 1; background: rgba(30, 30, 30, 0.75); backdrop-filter: blur(10px);
  padding: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
  width: 100%; max-width: 400px; color: #fff; text-align: center;
}
h3 { margin-top: 0; font-size: 24px; margin-bottom: 25px; }
.form-group { text-align: left; margin-bottom: 20px; }
label { display: block; margin-bottom: 5px; font-size: 13px; color: #aaa; }
input {
  width: 100%; height: 45px; padding: 0 10px; background: rgba(255,255,255,0.1); border: 1px solid #555;
  border-radius: 5px; color: #fff; box-sizing: border-box;
}
.btn-primary {
  width: 100%; padding: 12px; background: #cc0000; color: #fff;
  border: none; border-radius: 5px; font-weight: bold; cursor: pointer; transition: 0.2s;
}
.btn-primary:hover { background: #ff0000; }
</style>