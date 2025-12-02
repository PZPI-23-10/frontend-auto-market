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
              <li><a href="#" :class="{ active: activeTab === 'dashboard' }" @click.prevent="activeTab = 'dashboard'">Dashboard</a></li>
              <li><a href="#" :class="{ active: activeTab === 'users' }" @click.prevent="activeTab = 'users'">Manage Users</a></li>
              <li><a href="#" :class="{ active: activeTab === 'cars' }" @click.prevent="activeTab = 'cars'">Car Data</a></li>
              <li><a href="#" :class="{ active: activeTab === 'reports' }" @click.prevent="activeTab = 'reports'">Reports</a></li>
            </ul>
          </nav>
        </aside>

        <main class="admin-content">

          <div v-if="activeTab === 'dashboard'" class="tab-pane">
            <h2>System Overview</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <h3>Total Users</h3>
                <p class="stat-number">{{ users.length || '-' }}</p>
              </div>
              <div class="stat-card">
                <h3>Active Listings</h3>
                <p class="stat-number">Unknown</p>
              </div>
              <div class="stat-card warning">
                <h3>Admin Mode</h3>
                <p class="stat-number">Active</p>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'users'" class="tab-pane">
            <h2>User Management</h2>
            
            <div class="search-bar">
              <input 
                type="text" 
                placeholder="Search by ID, Name, Email or Phone..." 
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
                      <span v-if="u.role === 'Admin'" class="role-badge">Admin</span>
                    </div>
                  </td>
                  <td>{{ u.email }}</td>
                  <td>{{ u.phoneNumber || '-' }}</td>
                  <td class="actions-cell">
                    <button 
                      class="btn-icon danger" 
                      title="Delete User" 
                      @click="deleteUser(u.id)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="5" class="no-data">
                    {{ users.length === 0 ? 'No users found (check API).' : 'No users match your search.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="activeTab === 'cars'" class="tab-pane">
            <h2>Manage Vehicle Data</h2>
            
            <div class="mode-switch-container">
              <button 
                class="mode-btn add-mode" 
                :class="{ active: carDataMode === 'add' }"
                @click="carDataMode = 'add'"
              >
                ➕ ADD NEW DATA
              </button>
              <button 
                class="mode-btn delete-mode" 
                :class="{ active: carDataMode === 'delete' }"
                @click="carDataMode = 'delete'"
              >
                🗑️ MANAGE / DELETE
              </button>
            </div>

            <div v-if="carDataMode === 'add'" class="add-dashboard-grid">
              
              <div class="admin-form-card small-card">
                <h3>Add Vehicle Type</h3>
                <form @submit.prevent="addSimple('VehicleType', forms.type)">
                  <input type="text" v-model="forms.type" placeholder="e.g. Passenger Car" required>
                  <button class="btn-primary full-width" :disabled="isSubmitting">Add Type</button>
                </form>
              </div>

              <div class="admin-form-card small-card">
                <h3>Add Fuel Type</h3>
                <form @submit.prevent="addSimple('FuelType', forms.fuel)">
                  <input type="text" v-model="forms.fuel" placeholder="e.g. Electric" required>
                  <button class="btn-primary full-width" :disabled="isSubmitting">Add Fuel</button>
                </form>
              </div>

              <div class="admin-form-card small-card">
                <h3>Add Gearbox</h3>
                <form @submit.prevent="addSimple('GearType', forms.gear)">
                  <input type="text" v-model="forms.gear" placeholder="e.g. Automatic" required>
                  <button class="btn-primary full-width" :disabled="isSubmitting">Add Gearbox</button>
                </form>
              </div>
              
              <div class="admin-form-card small-card">
                 <h3>Add Condition</h3>
                 <form @submit.prevent="addSimple('VehicleCondition', forms.condition)">
                    <input type="text" v-model="forms.condition" placeholder="e.g. New" required>
                    <button class="btn-primary full-width" :disabled="isSubmitting">Add Condition</button>
                 </form>
              </div>

              <div class="admin-form-card medium-card">
                <h3>Add Brand</h3>
                <form @submit.prevent="addSimple('VehicleBrand', forms.brand)">
                  <label>Brand Name</label>
                  <input type="text" v-model="forms.brand" placeholder="e.g. Toyota" required>
                  <button class="btn-primary full-width" :disabled="isSubmitting">Create Brand</button>
                </form>
              </div>

              <div class="admin-form-card large-card">
                <h3>Add Model (Complex)</h3>
                <form @submit.prevent="createModel">
                  <div class="form-row">
                    
                    <div class="form-group">
                      <label>Type *</label>
                      <SearchableSelect 
                        v-model="newModelForm.vehicleTypeId" 
                        :options="carLists.types" 
                        placeholder="Select Type"
                      />
                    </div>

                    <div class="form-group">
                      <label>Brand *</label>
                      <SearchableSelect 
                        v-model="newModelForm.vehicleBrandId" 
                        :options="carLists.allBrands" 
                        placeholder="Select Brand"
                      />
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label>Model Name *</label>
                    <input type="text" v-model="newModelForm.name" placeholder="e.g. Camry" required>
                  </div>

                  <div class="form-group">
                    <label>Compatible Body Types *</label>
                    <div class="checkbox-grid">
                      <div v-for="bt in carLists.bodyTypes" :key="bt.id" class="checkbox-item">
                        <input 
                          type="checkbox" 
                          :id="`bt-${bt.id}`" 
                          :value="bt.id" 
                          v-model="newModelForm.vehicleBodyTypesIds"
                        >
                        <label :for="`bt-${bt.id}`">{{ bt.name }}</label>
                      </div>
                    </div>
                  </div>

                  <button class="btn-primary full-width" :disabled="isSubmitting">Create Model</button>
                </form>
              </div>
            </div>

<div v-if="carDataMode === 'delete'" class="delete-manager">
              
              <div class="delete-controls">
                <label>Select Category:</label>
                <div class="category-pills">
                  <button 
                    v-for="cat in deleteCategories" 
                    :key="cat.key"
                    :class="{ active: deleteTarget === cat.key }"
                    @click="loadDeleteList(cat.key)"
                  >
                    {{ cat.label }}
                  </button>
                </div>
              </div>

              <div class="search-bar compact">
                <input 
                  type="text" 
                  v-model="deleteSearch" 
                  :placeholder="`Search inside ${deleteTarget}...`"
                >
              </div>

              <div class="data-list-section">
                <div v-if="isListLoading" class="loading-state">
                  <div class="spinner"></div>
                </div>

                <table v-else class="data-table sortable">
                  <thead>
                    <tr>
                      <th width="80" @click="sortBy('id')">
                        ID 
                        <span v-if="sortConfig.key === 'id'">{{ sortConfig.order === 'asc' ? '▲' : '▼' }}</span>
                        <span v-else style="opacity: 0.3">⇅</span>
                      </th>
                      
                      <th @click="sortBy('name')">
                        Name
                        <span v-if="sortConfig.key === 'name'">{{ sortConfig.order === 'asc' ? '▲' : '▼' }}</span>
                        <span v-else style="opacity: 0.3">⇅</span>
                      </th>
                      
                      <th v-if="deleteTarget === 'VehicleModel'">Details</th>
                      <th style="text-align: right;">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in processedDeleteList" :key="item.id">
                      <td>#{{ item.id }}</td>
                      <td><strong>{{ item.name }}</strong></td>
                      
                      <td v-if="deleteTarget === 'VehicleModel'">
                        {{ item.brand?.name }} / {{ item.vehicleType?.name }}
                      </td>

                      <td class="actions-cell">
                        <button class="btn-icon danger" @click="deleteItem(item.id)">🗑</button>
                      </td>
                    </tr>
                    <tr v-if="processedDeleteList.length === 0">
                      <td :colspan="deleteTarget === 'VehicleModel' ? 4 : 3" class="no-data">
                        {{ deleteList.length === 0 ? 'List is empty.' : 'No matches found.' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
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
import SearchableSelect from '@/components/SearchableSelect.vue'; // Імпорт компонента

const toast = useToast();
const router = useRouter();
const { token } = useAuth(); 

const API_BASE = 'https://backend-auto-market.onrender.com/api';
const activeTab = ref('users');
const carDataMode = ref('add'); 

// --- USERS DATA ---
const users = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);

// --- CAR DATA ---
const isSubmitting = ref(false);
const isListLoading = ref(false);
const forms = ref({ type: '', fuel: '', gear: '', body: '', brand: '', condition: '' });
const newModelForm = ref({ name: '', vehicleBrandId: null, vehicleTypeId: null, vehicleBodyTypesIds: [] });
const deleteSearch = ref(''); 
const sortConfig = ref({ key: 'id', order: 'asc' });
const processedDeleteList = computed(() => {
  let result = [...deleteList.value]; 

  if (deleteSearch.value) {
    const q = deleteSearch.value.toLowerCase();
    result = result.filter(item => {
      const matchName = item.name?.toLowerCase().includes(q);
      const matchId = item.id?.toString().includes(q);
      
      let matchBrand = false;
      if (item.brand?.name) {
        matchBrand = item.brand.name.toLowerCase().includes(q);
      }

      return matchName || matchId || matchBrand;
    });
  }

  result.sort((a, b) => {
    let valA = a[sortConfig.value.key];
    let valB = b[sortConfig.value.key];

    if (!valA) valA = '';
    if (!valB) valB = '';

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortConfig.value.order === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.value.order === 'asc' ? 1 : -1;
    return 0;
  });

  return result;
});

const carLists = ref({ types: [], allBrands: [], filteredBrands: [], bodyTypes: [] });
const deleteTarget = ref('VehicleBrand');
const deleteList = ref([]);
const deleteCategories = [
  { key: 'VehicleBrand', label: 'Brands' },
  { key: 'VehicleModel', label: 'Models' },
  { key: 'VehicleType', label: 'Types' },
  { key: 'FuelType', label: 'Fuels' },
  { key: 'GearType', label: 'Gearboxes' },
  { key: 'VehicleCondition', label: 'Conditions' },
];

// --- 1. USERS LOGIC ---
async function fetchUsers() {
  isLoading.value = true;
  try {
    // Чесна спроба отримати дані
    const response = await axios.get(`${API_BASE}/Profile/all`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    users.value = response.data;
  } catch (error) {
    console.warn("API Error (Використовуємо мок-дані):", error);
    
    // Якщо помилка доступу або сервера - показуємо повідомлення, але не блокуємо
    if (error.response?.status === 401 || error.response?.status === 403) {
       toast.warning("Немає прав (403). Увімкнено ДЕМО режим.");
    } else {
       toast.error("Помилка сервера. Увімкнено ДЕМО режим.");
    }

    // Фейкові дані для верстки
    users.value = [
      { id: 101, firstName: 'Test', lastName: 'User', email: 'test@user.com', role: 'User' },
      { id: 102, firstName: 'Admin', lastName: 'Super', email: 'admin@test.com', role: 'Admin' },
      { id: 103, firstName: 'Bot', lastName: 'Spam', email: 'bot@spam.net', role: 'User' },
    ];
  } finally { isLoading.value = false; }
}

const filteredUsers = computed(() => {
  let res = users.value;
  // Видалено фільтр адмінів, щоб ви могли бачити себе в списку
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    res = res.filter(u => 
      u.email?.toLowerCase().includes(q) || 
      u.firstName?.toLowerCase().includes(q) || 
      u.lastName?.toLowerCase().includes(q)
    );
  }
  return res;
});

async function deleteUser(id) {
  if(!confirm(`Delete User #${id}?`)) return;
  try {
    await axios.delete(`${API_BASE}/Profile`, {
       headers: { 'Authorization': `Bearer ${token.value}` },
       params: { userId: id }
    });
    toast.success("User Deleted");
    users.value = users.value.filter(u => u.id !== id);
  } catch (e) {
    // Optimistic update (якщо 404 або 403 - прибираємо з екрану в демо режимі)
    if(e.response?.status === 404 || users.value.find(u => u.id === id && u.email.includes('test'))) {
       users.value = users.value.filter(u => u.id !== id);
       toast.success("User deleted (Demo/Optimistic)");
    } else {
       toast.error("Failed to delete user");
    }
  }
}

function getFullName(u) {
  return `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.userName || 'User';
}

// --- 2. CAR DATA LOGIC ---
async function loadBaseData() {
  try {
    const [tRes, bRes, btRes] = await Promise.all([
      axios.get(`${API_BASE}/VehicleType`),
      axios.get(`${API_BASE}/VehicleBrand`),
      axios.get(`${API_BASE}/VehicleBodyType`)
    ]);
    carLists.value.types = tRes.data;
    carLists.value.allBrands = bRes.data;
    carLists.value.bodyTypes = btRes.data;
  } catch (e) { console.error(e); }
}

// ADD SIMPLE ITEM
async function addSimple(endpoint, value) {
  if (!value.trim()) return;
  isSubmitting.value = true;
  try {
    await axios.post(`${API_BASE}/${endpoint}`, JSON.stringify(value), {
      headers: { 'Authorization': `Bearer ${token.value}`, 'Content-Type': 'application/json' }
    });
    toast.success("Added!");
    // Очистка
    if (endpoint === 'VehicleType') forms.value.type = '';
    if (endpoint === 'FuelType') forms.value.fuel = '';
    if (endpoint === 'GearType') forms.value.gear = '';
    if (endpoint === 'VehicleBrand') forms.value.brand = '';
    if (endpoint === 'VehicleCondition') forms.value.condition = '';
    
    await loadBaseData();
  } catch (e) { toast.error("Failed to add"); } 
  finally { isSubmitting.value = false; }
}

function sortBy(key) {
  if (sortConfig.value.key === key) {
    // Якщо клікнули туди ж - змінюємо напрямок
    sortConfig.value.order = sortConfig.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    // Якщо нова колонка - ставимо за зростанням
    sortConfig.value.key = key;
    sortConfig.value.order = 'asc';
  }
}

// ADD MODEL (Логіка для SearchableSelect)
function filterBrandsForModel() {
  // Скидаємо бренд
  newModelForm.value.vehicleBrandId = null;
  
  if (!newModelForm.value.vehicleTypeId) {
     carLists.value.filteredBrands = [];
     return;
  }
  
  // Запит на сервер за брендами
  axios.get(`${API_BASE}/VehicleBrand/for-type/${newModelForm.value.vehicleTypeId}`)
    .then(res => { carLists.value.filteredBrands = res.data; })
    .catch(() => { carLists.value.filteredBrands = carLists.value.allBrands; });
}

async function createModel() {
  const f = newModelForm.value;
  if (!f.name || !f.vehicleBrandId || !f.vehicleTypeId || f.vehicleBodyTypesIds.length === 0) {
    toast.warning("Fill all fields"); return;
  }
  isSubmitting.value = true;
  try {
    await axios.post(`${API_BASE}/VehicleModel`, f, {
       headers: { 'Authorization': `Bearer ${token.value}` }
    });
    toast.success("Model created!");
    newModelForm.value.name = '';
    newModelForm.value.vehicleBodyTypesIds = [];
  } catch (e) { toast.error("Error creating model"); } 
  finally { isSubmitting.value = false; }
}

// DELETE ITEM
async function loadDeleteList(category) {
  deleteTarget.value = category;
  isListLoading.value = true;
  try {
    const res = await axios.get(`${API_BASE}/${category}`);
    deleteList.value = res.data;
  } catch (e) { toast.error(`Error loading ${category}`); } 
  finally { isListLoading.value = false; }
}

async function deleteItem(id) {
  if(!confirm("Delete this item?")) return;
  
  try {
    await axios.delete(`${API_BASE}/${deleteTarget.value}`, {
      headers: { 'Authorization': `Bearer ${token.value}` },
      params: { id: id } 
    });
    
    toast.success("Deleted.");
    
    deleteList.value = deleteList.value.filter(i => i.id !== id);
    
    loadBaseData();
    
  } catch (e) {
    console.error("Delete error:", e);
    
    if (e.response?.status === 404) {
       deleteList.value = deleteList.value.filter(i => i.id !== id);
       toast.warning("Item already deleted (visual update).");
    } 
    else {
       toast.error(`Delete failed: ${e.response?.data?.title || 'Server Error'}`);
    }
  }
}

// --- INIT ---
onMounted(() => {
  if (activeTab.value === 'users') fetchUsers();
});

watch(activeTab, (newTab) => {
  if (newTab === 'users' && users.value.length === 0) fetchUsers();
  if (newTab === 'cars') loadBaseData();
});

watch(carDataMode, (newMode) => {
  if (newMode === 'delete') loadDeleteList(deleteTarget.value);
});
</script>

<style scoped>
/* --- 1. GLOBAL LAYOUT --- */
.admin-view {
  min-height: 100vh;
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
  background: rgba(15, 23, 42, 0.92); 
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

/* Header */
.header-row {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}
.header-row h1 { margin: 0; font-weight: 700; font-size: 28px; }
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

/* --- 2. SIDEBAR --- */
.admin-sidebar {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  height: fit-content;
}

.admin-nav ul {
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 8px;
}

.admin-nav a {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 15px;
  color: #bdc3c7;
  text-decoration: none;
  border-radius: 8px;
  transition: 0.2s;
  font-weight: 500;
  font-size: 14px;
}
.admin-nav a:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.admin-nav a.active { background: #e74c3c; color: #fff; font-weight: 600; }

/* --- 3. MAIN CONTENT --- */
.admin-content {
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  min-height: 600px;
}

h2 {
  margin-top: 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 15px;
  margin-bottom: 25px;
  font-size: 22px;
}

/* --- 4. DASHBOARD STATS --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
}
.stat-card h3 { font-size: 13px; color: #aaa; margin-bottom: 5px; text-transform: uppercase; }
.stat-number { font-size: 32px; font-weight: 700; margin: 0; color: #fff; }
.stat-card.warning .stat-number { color: #f39c12; }

/* --- 5. TABLES (Users & Delete) --- */
.search-bar { display: flex; gap: 10px; margin-bottom: 20px; }
.search-bar input {
  flex-grow: 1;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #555;
  color: #fff;
  padding: 12px 15px;
  border-radius: 6px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.data-table th {
  text-align: left;
  padding: 15px;
  color: #aaa;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  font-weight: 600;
}
.data-table td {
  padding: 15px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  vertical-align: middle;
}

.user-cell { display: flex; align-items: center; gap: 12px; }
.mini-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; background: #333; border: 1px solid #555; }
.role-badge {
  background: #f39c12; color: #fff; font-size: 10px;
  padding: 2px 6px; border-radius: 4px; margin-left: 8px;
  text-transform: uppercase; font-weight: 700;
}

.actions-cell { text-align: right; }
.btn-icon {
  border: none; background: rgba(255,255,255,0.1); color: #fff;
  width: 34px; height: 34px; border-radius: 6px; cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
  transition: 0.2s;
}
.btn-icon:hover { background: rgba(255,255,255,0.2); }
.btn-icon.danger:hover { background: #c0392b; }
.btn-icon:disabled { opacity: 0.3; cursor: not-allowed; }

.no-data { text-align: center; color: #777; padding: 40px; font-style: italic; }

/* --- 6. CAR DATA (Forms & Modes) --- */
.mode-switch-container {
  display: flex; gap: 15px; margin-bottom: 30px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 20px;
}

.mode-btn {
  flex: 1; padding: 12px; border-radius: 8px;
  border: 2px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: #ccc; font-weight: 700; font-size: 14px;
  cursor: pointer; transition: all 0.3s ease;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.mode-btn:hover { background: rgba(255,255,255,0.1); }
.mode-btn.add-mode.active {
  background: rgba(46, 204, 113, 0.15);
  border-color: #2ecc71; color: #2ecc71;
}
.mode-btn.delete-mode.active {
  background: rgba(231, 76, 60, 0.15);
  border-color: #e74c3c; color: #e74c3c;
}

/* Grid for Forms */
.add-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.admin-form-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}
.admin-form-card h3 {
  font-size: 14px; text-transform: uppercase; color: #aaa;
  margin-top: 0; margin-bottom: 15px; letter-spacing: 1px;
  border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;
}
.medium-card { grid-column: span 2; }
.large-card { grid-column: 1 / -1; background: rgba(30, 30, 30, 0.8); border-color: #ffd700; }

.search-bar.compact input {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  font-size: 13px;
  padding: 8px 12px;
  height: 36px;
}
/* Сортування в таблиці */
.data-table.sortable th {
  cursor: pointer;
  user-select: none; /* Щоб текст не виділявся при швидкому кліку */
  transition: color 0.2s;
}
.data-table.sortable th:hover {
  color: #fff;
  background-color: rgba(255,255,255,0.05);
}

/* Inputs & Buttons */
.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-size: 12px; color: #ccc; margin-bottom: 5px; }
input, select {
  width: 100%; height: 42px; padding: 0 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #555;
  color: #fff; border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
}
.btn-primary {
  background: #2980b9;
  color: #fff;
  border: none;
  padding: 12px 20px; /* Збільшив висоту кнопки */
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px; /* Трохи менший шрифт, щоб не прилипав */
  letter-spacing: 0.5px;
  transition: 0.2s;
  line-height: 1.2;
}
.full-width {
  width: 100%;
  margin-top: 15px; /* Було 10px, стало 15px для простору */
}

/* Також перевірте інпути */
input, select {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #555;
  color: #fff;
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 14px;
  margin-bottom: 5px; /* Відступ знизу, якщо елементів декілька */
}
.btn-primary:hover { background: #3498db; }
.btn-primary:disabled { background: #555; cursor: not-allowed; }

.form-row { display: flex; gap: 20px; }
.form-row .form-group { flex: 1; }

/* Checkboxes (Body Types) */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  background: rgba(0,0,0,0.2);
  padding: 15px;
  border-radius: 6px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #444;
}
.checkbox-item { display: flex; align-items: center; gap: 8px; }
.checkbox-item input { width: 18px; height: 18px; cursor: pointer; }
.checkbox-item label { margin: 0; cursor: pointer; font-size: 13px; user-select: none; }

/* Delete Category Switcher */
.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 15px; /* Збільшив відступ між кнопками */
  margin-top: 10px;
  margin-bottom: 25px;
}

.category-pills button {
  background: transparent;
  border: 1px solid #555;
  color: #ccc;
  padding: 8px 16px; /* Більше повітря всередині кнопки */
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s;
  white-space: nowrap; /* Щоб текст не ламався */
}

.category-pills button:hover { border-color: #aaa; color: #fff; }
.category-pills button.active {
  background: #e74c3c; color: #fff; border-color: #e74c3c;
}

/* Loading */
.loading-state { text-align: center; padding: 50px; color: #ccc; }
.spinner {
  width: 40px; height: 40px;
  border: 4px solid #444;
  border-top-color: #e74c3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px auto;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>