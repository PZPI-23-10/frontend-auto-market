<template>
  <div class="admin-view">
    <div class="container">
      <div class="header-row">
        <h1>Admin Panel</h1>
        <span class="admin-badge">SUPER ADMIN</span>
      </div>

      <div class="admin-layout">
        
        <aside class="admin-sidebar">
          <nav class="admin-nav">
            <ul>
              <li>
                <a href="#" :class="{ active: activeTab === 'dashboard' }" @click.prevent="activeTab = 'dashboard'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="#" :class="{ active: activeTab === 'users' }" @click.prevent="activeTab = 'users'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  Manage Users
                </a>
              </li>
              <li>
                <a href="#" :class="{ active: activeTab === 'cars' }" @click.prevent="activeTab = 'cars'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle><path d="M14 17h-3"></path></svg>
                  Car Data
                </a>
              </li>
              <li>
                <a href="#" :class="{ active: activeTab === 'reports' }" @click.prevent="activeTab = 'reports'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Reports
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <main class="admin-content">

          <div v-if="activeTab === 'dashboard'" class="tab-pane">
            <h2>System Overview</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <h3>Total Users</h3>
                <p class="stat-number">{{ users.length || '---' }}</p>
              </div>
              <div class="stat-card">
                <h3>New Listings (24h)</h3>
                <p class="stat-number">+12</p>
              </div>
              <div class="stat-card warning">
                <h3>Reports</h3>
                <p class="stat-number">0</p>
              </div>
            </div>
            <div class="alert-item" style="margin-top: 20px;">
              <div class="alert-icon">ℹ️</div>
              <div class="alert-info">
                <strong>Admin Mode</strong>
                <p>Use the tabs on the left to manage the platform.</p>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'users'" class="tab-pane">
            <h2>User Management</h2>
            
            <div class="search-bar">
              <input 
                type="text" 
                placeholder="Search by ID, Name or Email..." 
                v-model="searchQuery"
              >
            </div>

            <div v-if="isLoading" class="loading-state">
              <div class="spinner"></div>
              <p>Loading users...</p>
            </div>

            <table v-else class="data-table">
              <thead>
                <tr>
                  <th width="50">ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in filteredUsers" :key="u.id">
                  <td>#{{ u.id }}</td>
                  <td>
                    <div class="user-cell">
                      <img :src="u.avatarUrl || defaultAvatar" class="mini-avatar" alt="avatar" @error="$event.target.src = defaultAvatar">
                      <span>{{ getFullName(u) }}</span>
                    </div>
                  </td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.phoneNumber || '-' }}</td>
                  <td class="actions-cell">
                    <button class="btn-icon danger" title="Delete User" @click="deleteUser(u.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="5" class="no-data">No users found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="activeTab === 'cars'" class="tab-pane">
            <h2>Manage Vehicle Data</h2>
            <div class="forms-grid">
              <div class="admin-form-card">
                <h3>Add New Brand</h3>
                <form @submit.prevent>
                  <div class="form-group">
                    <label>Brand Name</label>
                    <input type="text" placeholder="e.g. Rivian">
                  </div>
                  <div class="form-group">
                    <label>Vehicle Type</label>
                    <select><option>Passenger Car</option></select>
                  </div>
                  <button class="btn-primary full-width">Add Brand</button>
                </form>
              </div>
              <div class="admin-form-card">
                <h3>Add New Model</h3>
                <form @submit.prevent>
                  <div class="form-group">
                    <label>Select Brand</label>
                    <select><option>Select...</option></select>
                  </div>
                  <div class="form-group">
                    <label>Model Name</label>
                    <input type="text" placeholder="e.g. R1T">
                  </div>
                  <button class="btn-primary full-width">Add Model</button>
                </form>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'reports'" class="tab-pane">
            <h2>Reports</h2>
            <div class="report-controls">
              <div class="form-group">
                <label>Report Type</label>
                <select><option>User Activity</option></select>
              </div>
              <button class="btn-primary">Generate PDF</button>
            </div>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { useAuth } from '@/store/auth'; 
import defaultAvatar from '@/assets/default-avatar.png';

const toast = useToast();
const router = useRouter();
const { token } = useAuth(); 

const API_BASE = 'https://backend-auto-market.onrender.com/api';
const activeTab = ref('users'); 
const isLoading = ref(false);
const users = ref([]);
const searchQuery = ref('');

// --- 1. ЗАВАНТАЖЕННЯ КОРИСТУВАЧІВ (Спроба API + Fallback) ---
async function fetchUsers() {
  isLoading.value = true;
  
  try {
    // 1. Спроба взяти реальні дані
    console.log("Запит до:", `${API_BASE}/Profile/all`);
    
    const response = await axios.get(`${API_BASE}/Profile/all`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    
    // Якщо успіх - записуємо
    users.value = response.data;
    // toast.success("Список користувачів оновлено.");

  } catch (error) {
    console.warn("API Error (Використовуємо мок-дані):", error);
    
    // Показуємо помилку, але не блокуємо сторінку
    if (error.response?.status === 401) {
       toast.warning("Немає прав адміністратора (401). Показані тестові дані.");
    } else {
       toast.error("Помилка з'єднання. Показані тестові дані.");
    }

    // 2. ЗАПАСНИЙ ВАРІАНТ (Мок-дані для верстки)
    users.value = [
      { 
        id: 101, 
        firstName: 'Test', 
        lastName: 'User', 
        email: 'user@test.com', 
        phoneNumber: '+380991112233', 
        role: 'User',
        avatarUrl: null
      },
      { 
        id: 102, 
        firstName: 'Spam', 
        lastName: 'Bot', 
        email: 'bot@spam.net', 
        phoneNumber: null, 
        role: 'User',
        avatarUrl: null
      },
      { 
        id: 103, 
        firstName: 'Super', 
        lastName: 'Admin', 
        email: 'admin@market.com', 
        phoneNumber: '+380670000000', 
        role: 'Admin',
        avatarUrl: null
      },
    ];
  } finally {
    isLoading.value = false;
  }
}

// --- 2. ФІЛЬТРАЦІЯ (Пошук + Приховування адмінів) ---
const filteredUsers = computed(() => {
  let result = users.value;

  // Фільтруємо, щоб не показувати адмінів у списку на видалення
  result = result.filter(u => {
      // Перевірка на масив ролей або рядок
      if (Array.isArray(u.roles)) return !u.roles.includes('Admin'); // Якщо бекенд шле roles: []
      if (Array.isArray(u.role)) return !u.role.includes('Admin');   // Якщо шле role: []
      return u.role !== 'Admin';                                     // Якщо шле role: "String"
  });

  // Пошук
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(u => 
      u.id.toString().includes(query) ||
      (u.email && u.email.toLowerCase().includes(query)) ||
      (u.firstName && u.firstName.toLowerCase().includes(query)) ||
      (u.lastName && u.lastName.toLowerCase().includes(query)) ||
      (u.phoneNumber && u.phoneNumber.includes(query))
    );
  }
  return result;
});

// --- 3. ВИДАЛЕННЯ ЮЗЕРА (Реальний API) ---
async function deleteUser(id) {
  if (!confirm(`Ви точно хочете видалити користувача ID #${id}?`)) return;

  try {
    // Використовуємо DELETE /api/Profile?userId=...
    await axios.delete(`${API_BASE}/Profile`, {
      headers: { 'Authorization': `Bearer ${token.value}` },
      params: { userId: id } 
    });

    toast.success("Користувача успішно видалено.");
    // Видаляємо з таблиці локально
    users.value = users.value.filter(u => u.id !== id);

  } catch (error) {
    console.error("Помилка видалення:", error);
    
    // Якщо 404 - значить вже видалений
    if (error.response && error.response.status === 404) {
        toast.warning("Користувача вже не існує.");
        users.value = users.value.filter(u => u.id !== id);
    } 
    // Якщо 401/403 - немає прав
    else if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        toast.error("У вас немає прав на видалення!");
    }
    else {
        toast.error("Не вдалося видалити користувача.");
    }
  }
}

// Допоміжна функція для повного імені
function getFullName(u) {
  if (u.firstName || u.lastName) {
    return `${u.firstName || ''} ${u.lastName || ''}`.trim();
  }
  return u.userName || 'No Name';
}

// Запуск при старті
onMounted(() => {
  fetchUsers();
});

// Оновлення при перемиканні вкладок
watch(activeTab, (newTab) => {
  if (newTab === 'users' && users.value.length === 0) {
    fetchUsers();
  }
});
</script>

<style scoped>
/* Стилі залишаємо гарними (Glass Admin, який ви вибрали) */
.admin-view {
  min-height: 100vh;
  /* Ваше фото з блюром */
  background-image: url('@/assets/car-header1.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;
  padding-top: 100px;
  padding-bottom: 40px;
  font-family: 'Open Sans', sans-serif;
  color: #ecf0f1;
}

.admin-view::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.92); /* Темна підкладка */
  backdrop-filter: blur(5px);
  z-index: 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}
.header-row h1 { margin: 0; font-weight: 700; }
.admin-badge {
  background: #e74c3c;
  color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
}

.admin-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}
@media (max-width: 992px) {
  .admin-layout { grid-template-columns: 1fr; }
}

/* SIDEBAR */
.admin-sidebar {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  height: fit-content;
}

.admin-nav ul {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 5px;
}

.admin-nav a {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 15px;
  color: #bdc3c7;
  text-decoration: none;
  border-radius: 6px;
  transition: 0.2s;
  font-weight: 500;
}
.admin-nav a:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.admin-nav a.active { background: #e74c3c; color: #fff; } 

/* CONTENT */
.admin-content {
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  min-height: 500px;
}

h2 { margin-top: 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 25px; }
h3 { margin-top: 0; font-size: 18px; color: #ecf0f1; }

/* SEARCH BAR */
.search-bar { display: flex; gap: 10px; margin-bottom: 20px; }
.search-bar input {
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #555;
  color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}
.btn-primary {
  background: #e74c3c; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600;
}
.btn-primary:hover { background: #c0392b; }

/* TABLE */
.data-table {
  width: 100%; border-collapse: collapse; font-size: 14px;
}
.data-table th { text-align: left; padding: 12px; color: #95a5a6; border-bottom: 1px solid rgba(255,255,255,0.1); }
.data-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.mini-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; background: #333; }

.actions-cell { text-align: right; }
.btn-icon {
  border: none; background: rgba(255,255,255,0.1); color: #fff;
  width: 30px; height: 30px; border-radius: 4px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  transition: 0.2s;
}
.btn-icon.danger:hover { background: #c0392b; }

.no-data { text-align: center; color: #7f8c8d; padding: 30px; }

/* STATS */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
.stat-card {
  background: rgba(255, 255, 255, 0.05); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
}
.stat-card h3 { font-size: 14px; color: #bdc3c7; margin-bottom: 5px; }
.stat-number { font-size: 28px; font-weight: 700; margin: 0; color: #fff; }

.alert-item {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  padding: 15px; border-radius: 8px;
  display: flex; align-items: center; gap: 15px;
}
.alert-icon { font-size: 24px; }

.loading-state { text-align: center; padding: 40px; color: #ccc; }
.spinner {
  width: 40px; height: 40px; border: 4px solid #555; border-top-color: #e74c3c;
  border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px auto;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* FORMS (Mock) */
.forms-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
@media (max-width: 768px) { .forms-grid { grid-template-columns: 1fr; } }
.admin-form-card {
  background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
}
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-size: 13px; color: #bdc3c7; }
.form-group input, .form-group select {
  width: 100%; height: 40px; padding: 0 10px; background: rgba(0,0,0,0.2);
  border: 1px solid #555; color: #fff; border-radius: 4px; box-sizing: border-box;
}
.form-group select option { background: #333; }
.full-width { width: 100%; }
.report-controls { display: grid; gap: 15px; max-width: 500px; }
</style>