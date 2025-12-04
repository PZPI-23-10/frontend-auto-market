<template>
  <div class="admin-view">
    <div class="container">
      <div class="header-row">
        <a :class="{ active: activeTab === 'dashboard' }" @click.prevent="activeTab = 'dashboard'">
          <h1>Admin Panel</h1>
        </a>
        <a :class="{ active: activeTab === 'dashboard' }" @click.prevent="activeTab = 'dashboard'">
          <span class="admin-badge">SUPER ADMIN</span>
        </a>
      </div>

      <div class="admin-layout">
        <aside class="admin-sidebar">
          <nav class="admin-nav">
            <ul>
              <li><a :class="{ active: activeTab === 'dashboard' }" @click.prevent="activeTab = 'dashboard'">Dashboard</a></li>
              <li><a :class="{ active: activeTab === 'users' }" @click.prevent="activeTab = 'users'">Manage Users</a></li>
              <li><a :class="{ active: activeTab === 'cars' }" @click.prevent="activeTab = 'cars'">Car Data</a></li>
              <li><a :class="{ active: activeTab === 'reports' }" @click.prevent="activeTab = 'reports'">Reports</a></li>
            </ul>
          </nav>
        </aside>

        <main class="admin-content">

          <div v-if="activeTab === 'dashboard'" class="tab-pane fade-in">
            <div class="header-flex">
              <h2>System Overview</h2>
              <div v-if="!dashboardLoading" class="last-updated">
                Updated: {{ new Date().toLocaleTimeString() }}
              </div>
            </div>

            <div v-if="dashboardLoading" class="loading-state">
              <div class="spinner"></div>
              <p>Analyzing system data...</p>
            </div>

            <div v-else>
              <div class="stats-grid">
                <div class="stat-card blue">
                  <div class="stat-icon">👥</div>
                  <div class="stat-info">
                    <h3>Total Users</h3>
                    <p class="stat-number">{{ stats.totalUsers }}</p>
                    <small v-if="stats.newIn24h > 0" style="color: #2ecc71; font-weight: bold;">
                      +{{ stats.newIn24h }} in last 24h
                    </small>
                    <small v-else style="color: rgba(255,255,255,0.5);">
                      No growth in 24h
                    </small>
                  </div>
                </div>

                <div class="stat-card green">
                  <div class="stat-icon">🚗</div>
                  <div class="stat-info">
                    <h3>Active Listings</h3>
                    <p class="stat-number">{{ stats.totalCars }}</p>
                    <small>Avg Price: {{ stats.avgPrice }}</small>
                  </div>
                </div>

                <div class="stat-card gold">
                  <div class="stat-icon">💰</div>
                  <div class="stat-info">
                    <h3>Market Cap</h3>
                    <p class="stat-number">{{ stats.totalValue }}</p>
                    <small>Total inventory value</small>
                  </div>
                </div>
              </div>

              <div class="dashboard-split">
                <div class="dashboard-column">
                  <div class="dashboard-box alert-box" v-if="stats.alerts.length > 0">
                    <div class="box-header">
                      <h3>⚠️ Security Alerts</h3>
                      <span class="badge-danger">{{ stats.alerts.length }} issues</span>
                    </div>
                    <ul class="alert-list">
                      <li v-for="(alert, index) in stats.alerts" :key="index">
                        <div class="alert-content">
                          <strong>{{ alert.type }}:</strong> {{ alert.message }}
                        </div>
                        <button class="btn-xs" @click="resolveAlert(alert)">Check</button>
                      </li>
                    </ul>
                  </div>
                  <div class="dashboard-box ok-box" v-else>
                    <h3>✅ System Status</h3>
                    <p style="color: #2ecc71; margin: 0;">No security alerts. System is healthy.</p>
                  </div>

                  <div class="dashboard-box">
                    <h3>New Members (Last 24h)</h3>
                    <table class="simple-table">
                      <tbody>
                        <tr v-for="u in stats.newUsersList" :key="u.id">
                          <td>
                            <div class="user-cell clickable" @click="openProfile(u)">
                              <img :src="u.avatarUrl || defaultAvatar" class="mini-avatar">
                              <div>
                                <div class="u-name">{{ getFullName(u) }}</div>
                                <div class="u-email">{{ u.email }}</div>
                                <small style="color: #777; font-size: 10px;">
                                  Registered: {{ formatTime(u.dateCreated) }}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td class="text-right">
                            <span class="role-badge" v-if="isAdmin(u)">Admin</span>
                            <span class="role-text" v-else>User</span>
                          </td>
                        </tr>
                        <tr v-if="stats.newUsersList.length === 0">
                          <td colspan="2" class="no-data-text">No new registrations in the last 24h.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="dashboard-column small-col">
                  <div class="dashboard-box">
                    <h3>Quick Actions</h3>
                    <div class="quick-actions">
                      <button class="action-btn" @click="activeTab = 'users'">
                        <span>🔍 Find User</span>
                        <span>→</span>
                      </button>
                      <button class="action-btn" @click="activeTab = 'cars'; carDataMode = 'add'">
                        <span>➕ Add Car Brand</span>
                        <span>→</span>
                      </button>
                      <button class="action-btn" @click="activeTab = 'reports'">
                        <span>📄 View Reports</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>

                  <div class="dashboard-box">
                    <h3>New in 24h <small style="color:#777; font-size: 11px;">({{ stats.newIn24h }})</small></h3>
                    <div class="new-users-list">
                      <div v-for="u in stats.newUsersList" :key="u.id" class="new-user-item">
                        <img :src="u.avatarUrl || defaultAvatar" class="mini-avatar-small" @error="$event.target.src = defaultAvatar">
                        <div class="new-user-info">
                          <span class="nu-name">{{ getFullName(u) }}</span>
                          <span class="nu-time">{{ formatTime(u.dateCreated) }}</span>
                        </div>
                        <div class="nu-status">
                          <span class="status-dot" :class="{ verified: u.isVerified }" title="Email Status"></span>
                        </div>
                      </div>
                      <div v-if="stats.newUsersList.length === 0" class="no-data-text-small">
                        No registrations in last 24h.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'users'" class="tab-pane">
            <div class="header-flex">
              <h2>User Management</h2>
              <button class="btn-refresh" @click="fetchUsers" title="Оновити список">🔄</button>
            </div>

            <div class="filter-controls">
              <button class="filter-pill" :class="{ active: userFilterStatus === 'all' }" @click="userFilterStatus = 'all'">
                All Users
              </button>
              <button class="filter-pill verified" :class="{ active: userFilterStatus === 'verified' }" @click="userFilterStatus = 'verified'">
                Verified
              </button>
              <button class="filter-pill unverified" :class="{ active: userFilterStatus === 'unverified' }" @click="userFilterStatus = 'unverified'">
                ⚠️ Unverified
              </button>
            </div>

            <div class="search-bar">
              <input type="text" placeholder="Search by ID, Name, Email or Phone..." v-model="searchQuery">
            </div>

            <div v-if="isLoading" class="loading-state">
              <div class="spinner"></div>
              <p>Завантаження користувачів...</p>
            </div>

            <table v-else class="data-table">
              <thead>
                <tr>
                  <th width="50">ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Phone</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in filteredUsers" :key="u.id">
                  <td>#{{ u.id }}</td>
                  <td>
                    <div class="user-cell clickable" @click="openProfile(u)">
                      <div class="avatar-wrapper">
                        <img :src="u.avatarUrl || defaultAvatar" class="mini-avatar" alt="avatar" @error="$event.target.src = defaultAvatar">
                        <span class="status-indicator" :class="{ verified: u.isVerified }" :title="u.isVerified ? 'Verified' : 'Unverified'"></span>
                      </div>
                      <div class="user-info-col">
                        <span class="user-name">{{ getFullName(u) }}</span>
                        <span v-if="isAdmin(u)" class="role-badge">Admin</span>
                      </div>
                    </div>
                  </td>
                  <td>{{ u.email }}</td>
                  <td>
                    <span v-if="u.isVerified" style="color: #2ecc71; font-size: 11px;">Verified</span>
                    <span v-else style="color: #e74c3c; font-size: 11px; font-weight: bold;">Unverified</span>
                  </td>
                  <td>{{ u.phoneNumber || '-' }}</td>
                  <td class="actions-cell">
                    <button v-if="!isAdmin(u)" class="btn-icon danger" title="Delete User" @click.stop="askToDelete(u)">
                      🗑️
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="no-data">
                    {{ users.length === 0 ? 'Список користувачів порожній.' : 'Нічого не знайдено.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="activeTab === 'cars'" class="tab-pane">
            <h2>Manage Vehicle Data</h2>
            <div class="mode-switch-container">
              <button class="mode-btn add-mode" :class="{ active: carDataMode === 'add' }" @click="carDataMode = 'add'">
                ➕ ADD NEW DATA
              </button>
              <button class="mode-btn delete-mode" :class="{ active: carDataMode === 'delete' }" @click="carDataMode = 'delete'">
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
                      <SearchableSelect v-model="newModelForm.vehicleTypeId" :options="carLists.types" placeholder="Select Type" />
                    </div>
                    <div class="form-group">
                      <label>Brand *</label>
                      <SearchableSelect v-model="newModelForm.vehicleBrandId" :options="carLists.allBrands" placeholder="Select Brand" />
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
                        <input type="checkbox" :id="`bt-${bt.id}`" :value="bt.id" v-model="newModelForm.vehicleBodyTypesIds">
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
                  <button v-for="cat in deleteCategories" :key="cat.key" :class="{ active: deleteTarget === cat.key }" @click="loadDeleteList(cat.key)">
                    {{ cat.label }}
                  </button>
                </div>
              </div>
              <div class="search-bar compact">
                <input type="text" v-model="deleteSearch" :placeholder="`Search inside ${deleteTarget}...`">
              </div>
              <div class="data-list-section">
                <div v-if="isListLoading" class="loading-state"><div class="spinner"></div></div>
                <table v-else class="data-table sortable">
                  <thead>
                    <tr>
                      <th width="80" @click="sortBy('id')">ID <span v-if="sortConfig.key === 'id'">{{ sortConfig.order === 'asc' ? '▲' : '▼' }}</span></th>
                      <th @click="sortBy('name')">Name <span v-if="sortConfig.key === 'name'">{{ sortConfig.order === 'asc' ? '▲' : '▼' }}</span></th>
                      <th v-if="deleteTarget === 'VehicleModel'">Details</th>
                      <th style="text-align: right;">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in processedDeleteList" :key="item.id">
                      <td>#{{ item.id }}</td>
                      <td><strong>{{ item.name }}</strong></td>
                      <td v-if="deleteTarget === 'VehicleModel'">{{ item.brand?.name }} / {{ item.vehicleType?.name }}</td>
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

      <div v-if="showProfileModal" class="modal-backdrop" @click.self="showProfileModal = false">
        <div class="modal-window profile-modal">
          <div class="modal-header">
            <h3>User Profile & Listings</h3>
            <button class="close-btn" @click="showProfileModal = false">×</button>
          </div>
          <div class="modal-body">
            <div v-if="isProfileLoading" class="loading-state" style="padding: 30px;">
              <div class="spinner"></div>
              <p style="font-size: 12px;">Loading data...</p>
            </div>
            <div v-else-if="selectedUserProfile">
              <div class="profile-header-section">
                <img :src="selectedUserProfile.avatarUrl || defaultAvatar" class="profile-big-avatar" @error="$event.target.src = defaultAvatar">
                <div class="profile-main-info">
                  <h2>{{ getFullName(selectedUserProfile) }}</h2>
                  <div class="profile-badges">
                    <span class="p-badge role" v-if="isAdmin(selectedUserProfile)">Admin</span>
                    <span class="p-badge status" :class="{ verified: selectedUserProfile.isVerified }">
                      {{ selectedUserProfile.isVerified ? 'Verified' : 'Unverified' }}
                    </span>
                    <span class="p-badge" style="background: #555;">ID: {{ selectedUserProfile.id }}</span>
                  </div>
                  <div class="contact-row">
                    <span>📧 {{ selectedUserProfile.email }}</span>
                    <span>📞 {{ selectedUserProfile.phoneNumber || 'No Phone' }}</span>
                  </div>
                </div>
              </div>
              <hr class="divider">
              <div class="profile-details-grid">
                <div class="detail-item">
                  <label>Country / Region</label>
                  <span>{{ selectedUserProfile.country || '-' }}</span>
                </div>
                <div class="detail-item">
                  <label>Registered</label>
                  <span>{{ new Date(selectedUserProfile.dateCreated).toLocaleDateString() }}</span>
                </div>
                <div class="detail-item full-width">
                  <label>Address</label>
                  <span>{{ selectedUserProfile.address || 'Not provided' }}</span>
                </div>
              </div>
              <hr class="divider">
              <div class="listings-section">
                <h4 class="section-title">User Listings ({{ userListings.length }})</h4>
                <div v-if="userListings.length === 0" class="no-data-text-small">
                  This user has no car listings.
                </div>
                <div class="listings-list">
                  <div v-for="car in userListings" :key="car.id" class="listing-card-row">
                    <img :src="getCarImage(car)" class="car-thumb">
                    <div class="car-info">
                      <div class="car-title">
                        {{ car.brand?.name }} {{ car.model?.name }} 
                        <span class="car-year">{{ car.year }}</span>
                      </div>
                      <div class="car-meta">
                        {{ car.fuelType?.name }} • {{ car.gearType?.name }} • {{ (car.mileage / 1000).toFixed(0) }}k km
                      </div>
                      <div class="car-price">
                        ${{ car.price.toLocaleString() }}
                      </div>
                    </div>
                    <div class="car-status">
                      <span v-if="car.isPublished" class="status-pill published">Active</span>
                      <span v-else class="status-pill hidden">Hidden</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-primary small" @click="showProfileModal = false">Close</button>
          </div>
        </div>
      </div>

      <div v-if="showUnverifiedModal" class="modal-backdrop" @click.self="showUnverifiedModal = false">
        <div class="modal-window">
          <div class="modal-header">
            <h3>Unverified Users</h3>
            <button class="close-btn" @click="showUnverifiedModal = false">×</button>
          </div>
          <div class="modal-body">
            <table class="simple-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in unverifiedUsersList" :key="u.id">
                  <td>
                    <div class="user-cell">
                      <img :src="u.avatarUrl || defaultAvatar" class="mini-avatar-small">
                      <span class="u-name">{{ getFullName(u) }}</span>
                    </div>
                  </td>
                  <td style="color: #ccc; font-size: 12px;">{{ u.email }}</td>
                  <td style="color: #888; font-size: 11px;">{{ formatTime(u.dateCreated) }}</td>
                </tr>
                <tr v-if="unverifiedUsersList.length === 0">
                  <td colspan="3" class="no-data-text-small">No unverified users found.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button class="btn-primary small" @click="showUnverifiedModal = false">Close</button>
          </div>
        </div>
      </div>

      <div v-if="showDeleteModal" class="modal-backdrop" @click.self="showDeleteModal = false">
        <div class="modal-window delete-modal">
          <div class="modal-header">
            <h3>Confirm Deletion</h3>
            <button class="close-btn" @click="showDeleteModal = false">×</button>
          </div>
          <div class="modal-body text-center">
            <div style="font-size: 40px; margin-bottom: 10px;">⚠️</div>
            <p>Are you sure you want to delete user:</p>
            <div class="user-preview" v-if="userToDelete">
              <img :src="userToDelete.avatarUrl || defaultAvatar" class="mini-avatar">
              <strong>{{ getFullName(userToDelete) }}</strong>
              <span>(ID: {{ userToDelete.id }})</span>
            </div>
            <p style="color: #e74c3c; font-size: 13px; margin-top: 10px;">
              This action cannot be undone.
            </p>
          </div>
          <div class="modal-footer" style="justify-content: space-between; display: flex;">
            <button class="btn-secondary" @click="showDeleteModal = false">Cancel</button>
            <button class="btn-danger" @click="confirmDelete">Yes, Delete User</button>
          </div>
        </div>
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
import SearchableSelect from '@/components/SearchableSelect.vue'; 

const toast = useToast();
const router = useRouter();
const { token } = useAuth(); 

const API_BASE = 'https://backend-auto-market.onrender.com/api';
const activeTab = ref('dashboard');
const carDataMode = ref('add'); 

// --- STATE VARIABLES ---

// Users State
const users = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);
const userFilterStatus = ref('all'); // 'all', 'verified', 'unverified'

// Dashboard State
const listings = ref([]); 
const dashboardLoading = ref(false);

// Car Data State
const isSubmitting = ref(false);
const isListLoading = ref(false);
const forms = ref({ type: '', fuel: '', gear: '', body: '', brand: '', condition: '' });
const newModelForm = ref({ name: '', vehicleBrandId: null, vehicleTypeId: null, vehicleBodyTypesIds: [] });
const deleteSearch = ref(''); 
const sortConfig = ref({ key: 'id', order: 'asc' });

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

// --- MODALS STATE ---
const showUnverifiedModal = ref(false);
const showDeleteModal = ref(false);
const userToDelete = ref(null);

// Profile Modal State
const showProfileModal = ref(false);
const selectedUserProfile = ref(null);
const userListings = ref([]);
const isProfileLoading = ref(false);

// --- COMPUTED ---

const stats = computed(() => {
  const totalUsers = users.value.length;
  const totalCars = listings.value.length;
  const totalValue = listings.value.reduce((sum, car) => sum + (car.price || 0), 0);
  const avgPrice = totalCars > 0 ? Math.round(totalValue / totalCars) : 0;
  
  const oneDayAgo = new Date();
  oneDayAgo.setHours(oneDayAgo.getHours() - 24);
  
  const newUsersList = users.value.filter(u => {
      if (!u.dateCreated) return false; 
      return new Date(u.dateCreated) > oneDayAgo;
  }).sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

  const recentUsers = [...users.value].sort((a, b) => {
      return new Date(b.dateCreated) - new Date(a.dateCreated);
  }).slice(0, 5);
  
  const alerts = [];
  const unverifiedCount = users.value.filter(u => !u.isVerified).length;
  if (unverifiedCount > 0) {
      alerts.push({ 
          type: 'Verification', 
          message: `${unverifiedCount} users pending email verification.` 
      });
  }
  
  return {
    totalUsers,
    totalCars,
    avgPrice: avgPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    totalValue: totalValue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
    recentUsers,
    newUsersList, 
    newIn24h: newUsersList.length, 
    alerts
  };
});

// Список для модалки неверифікованих
const unverifiedUsersList = computed(() => {
  return users.value.filter(u => !u.isVerified);
});

// Фільтр для таблиці Users
const filteredUsers = computed(() => {
  let res = users.value;

  // 1. Фільтр статусу
  if (userFilterStatus.value === 'verified') {
     res = res.filter(u => u.isVerified);
  } else if (userFilterStatus.value === 'unverified') {
     res = res.filter(u => !u.isVerified);
  }

  // 2. Пошук
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    res = res.filter(u => 
      u.id?.toString().includes(q) ||
      u.email?.toLowerCase().includes(q) || 
      u.firstName?.toLowerCase().includes(q) || 
      u.lastName?.toLowerCase().includes(q) ||
      u.phoneNumber?.includes(q)
    );
  }
  return res.sort((a, b) => b.id - a.id);
});

// --- HELPER FUNCTIONS ---

function formatTime(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getFullName(u) {
  return `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.userName || 'User';
}

function isAdmin(user) {
    if (Array.isArray(user.roles)) return user.roles.includes('Admin');
    return user.role === 'Admin';
}

// Отримання головного фото авто
function getCarImage(car) {
    if (car.photoUrls && car.photoUrls.length > 0) {
        return car.photoUrls[0].url; 
    }
    return 'https://via.placeholder.com/150?text=No+Image'; 
}

// --- API ACTIONS ---

async function fetchListings() {
  try {
    const response = await axios.get(`${API_BASE}/Listing`);
    listings.value = response.data;
  } catch (e) { console.error("Error loading listings", e); }
}

async function fetchUsers() {
  if (activeTab.value === 'users') isLoading.value = true;
  try {
    const response = await axios.get(`${API_BASE}/Profile/all`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    });
    users.value = response.data;
  } catch (error) {
    console.error(error);
    if (error.response?.status === 401) {
       toast.error("Session expired.");
       router.push('/login');
    }
  } finally {
    isLoading.value = false;
  }
}

async function loadDashboardData() {
  dashboardLoading.value = true;
  await Promise.all([fetchUsers(), fetchListings()]);
  dashboardLoading.value = false;
}

// PROFILE ACTION (API Fetch)
async function openProfile(user) {
  selectedUserProfile.value = user;
  showProfileModal.value = true;
  isProfileLoading.value = true;
  userListings.value = [];

  try {
    const config = { headers: { 'Authorization': `Bearer ${token.value}` } };

    const [profileRes, listingsRes] = await Promise.all([
        axios.get(`${API_BASE}/Profile`, { params: { userId: user.id }, ...config }),
        axios.get(`${API_BASE}/Listing/user`, { params: { userId: user.id }, ...config })
    ]);

    selectedUserProfile.value = profileRes.data;
    userListings.value = listingsRes.data;

  } catch (e) {
    console.error("Error loading profile details:", e);
    toast.error("Failed to load full profile data");
  } finally {
    isProfileLoading.value = false;
  }
}

function resolveAlert(alert) {
    if (alert.type === 'Verification') {
        showUnverifiedModal.value = true;
    } else {
        toast.info("Alert checked.");
    }
}

// DELETE USER ACTION
function askToDelete(user) {
  userToDelete.value = user;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!userToDelete.value) return;
  const id = userToDelete.value.id;
  
  try {
    await axios.delete(`${API_BASE}/Profile`, {
       headers: { 'Authorization': `Bearer ${token.value}` },
       params: { userId: id }
    });
    toast.success("User deleted successfully");
    users.value = users.value.filter(u => u.id !== id);
  } catch (e) {
    if(e.response?.status === 404) {
       users.value = users.value.filter(u => u.id !== id);
       toast.info("User already deleted.");
    } else {
       toast.error("Failed to delete user.");
    }
  } finally {
    showDeleteModal.value = false;
    userToDelete.value = null;
  }
}

// CAR DATA ACTIONS
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

async function addSimple(endpoint, value) {
  if (!value.trim()) return;
  isSubmitting.value = true;
  try {
    await axios.post(`${API_BASE}/${endpoint}`, JSON.stringify(value), {
      headers: { 'Authorization': `Bearer ${token.value}`, 'Content-Type': 'application/json' }
    });
    toast.success("Added!");
    if (endpoint === 'VehicleType') forms.value.type = '';
    if (endpoint === 'FuelType') forms.value.fuel = '';
    if (endpoint === 'GearType') forms.value.gear = '';
    if (endpoint === 'VehicleBrand') forms.value.brand = '';
    if (endpoint === 'VehicleCondition') forms.value.condition = '';
    await loadBaseData();
  } catch (e) { toast.error("Failed to add"); } 
  finally { isSubmitting.value = false; }
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

const processedDeleteList = computed(() => {
  let result = [...deleteList.value]; 
  if (deleteSearch.value) {
    const q = deleteSearch.value.toLowerCase();
    result = result.filter(item => {
      const matchName = item.name?.toLowerCase().includes(q);
      const matchId = item.id?.toString().includes(q);
      let matchBrand = false;
      if (item.brand?.name) matchBrand = item.brand.name.toLowerCase().includes(q);
      return matchName || matchId || matchBrand;
    });
  }
  result.sort((a, b) => {
    let valA = a[sortConfig.value.key] || '';
    let valB = b[sortConfig.value.key] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortConfig.value.order === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.value.order === 'asc' ? 1 : -1;
    return 0;
  });
  return result;
});

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
    if (e.response?.status === 404) {
       deleteList.value = deleteList.value.filter(i => i.id !== id);
    } else {
       toast.error(`Delete failed`);
    }
  }
}

function sortBy(key) {
  if (sortConfig.value.key === key) {
    sortConfig.value.order = sortConfig.value.order === 'asc' ? 'desc' : 'asc';
  } else {
    sortConfig.value.key = key;
    sortConfig.value.order = 'asc';
  }
}

// --- LIFECYCLE ---

onMounted(() => {
  if (activeTab.value === 'dashboard') loadDashboardData();
  if (activeTab.value === 'users') fetchUsers();
  if (activeTab.value === 'cars') loadBaseData();
});

watch(activeTab, (newTab) => {
  if (newTab === 'dashboard') loadDashboardData();
  if (newTab === 'users' && users.value.length === 0) fetchUsers();
  if (newTab === 'cars') loadBaseData();
});

watch(carDataMode, (newMode) => {
  if (activeTab.value === 'cars' && newMode === 'delete') {
      loadDeleteList(deleteTarget.value);
  }
});
</script>

<style scoped>
/* --- GLOBAL --- */
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
  content: ''; position: absolute; inset: 0;
  background: rgba(15, 23, 42, 0.92); 
  backdrop-filter: blur(5px); z-index: 0;
}
.container {
  max-width: 1400px; margin: 0 auto; padding: 0 20px;
  position: relative; z-index: 1;
}

/* Header */
.header-row { display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }
.header-row h1 { margin: 0; font-weight: 700; font-size: 28px; }
.admin-badge {
  background: #e74c3c; color: #fff; padding: 4px 10px;
  border-radius: 4px; font-size: 12px; font-weight: 800; letter-spacing: 1px;
}

.admin-layout { display: grid; grid-template-columns: 250px 1fr; gap: 30px; }
@media (max-width: 992px) { .admin-layout { grid-template-columns: 1fr; } }

/* Sidebar */
.admin-sidebar {
  background: rgba(255, 255, 255, 0.05); border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1); padding: 20px; height: fit-content;
}
.admin-nav ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
.admin-nav a {
  display: flex; align-items: center; gap: 12px; padding: 12px 15px;
  color: #bdc3c7; text-decoration: none; border-radius: 8px;
  transition: 0.2s; font-weight: 500; font-size: 14px; cursor: pointer;
}
.admin-nav a:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.admin-nav a.active { background: #e74c3c; color: #fff; font-weight: 600; }

/* Content */
.admin-content {
  background: rgba(30, 30, 30, 0.6); border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1); padding: 30px; min-height: 600px;
}
h2 {
  margin-top: 0; border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 15px; margin-bottom: 25px; font-size: 22px;
}

/* Dashboard Stats */
.stats-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px; margin-bottom: 30px;
}
.stat-card {
  background: rgba(255, 255, 255, 0.05); padding: 20px;
  border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
}
.stat-card h3 { font-size: 13px; color: #aaa; margin-bottom: 5px; text-transform: uppercase; }
.stat-number { font-size: 32px; font-weight: 700; margin: 0; color: #fff; }
.stat-card.blue { border-left: 4px solid #3498db; }
.stat-card.green { border-left: 4px solid #2ecc71; }
.stat-card.gold { border-left: 4px solid #f1c40f; }

/* Dashboard Layout */
.dashboard-split { display: grid; grid-template-columns: 2fr 1fr; gap: 25px; }
@media (max-width: 900px) { .dashboard-split { grid-template-columns: 1fr; } }
.dashboard-column { display: flex; flex-direction: column; gap: 25px; }
.dashboard-box { background: rgba(0,0,0,0.25); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
.dashboard-box h3 { margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px; font-size: 16px; color: #ecf0f1; }

/* Alerts */
.alert-box { border-color: rgba(231, 76, 60, 0.4); background: rgba(231, 76, 60, 0.08); }
.ok-box { border-color: rgba(46, 204, 113, 0.4); background: rgba(46, 204, 113, 0.05); }
.box-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px; }
.box-header h3 { margin: 0; border: none; }
.badge-danger { background: #c0392b; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; color: white; }
.alert-list { list-style: none; padding: 0; margin: 0; }
.alert-list li { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); font-size: 13px; display: flex; justify-content: space-between; align-items: center; }
.alert-list li:last-child { border-bottom: none; }
.btn-xs { padding: 4px 10px; font-size: 10px; background: rgba(255,255,255,0.15); border: none; color: #fff; cursor: pointer; border-radius: 4px; transition: 0.2s; }
.btn-xs:hover { background: #fff; color: #c0392b; }

/* Filter Controls */
.filter-controls { display: flex; gap: 10px; margin-bottom: 15px; }
.filter-pill {
  background: transparent; border: 1px solid #555; color: #bbb; padding: 6px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; transition: 0.2s;
}
.filter-pill:hover { border-color: #fff; color: #fff; }
.filter-pill.active { background: #3498db; border-color: #3498db; color: #fff; }
.filter-pill.verified.active { background: #2ecc71; border-color: #2ecc71; }
.filter-pill.unverified.active { background: #e74c3c; border-color: #e74c3c; }

.avatar-wrapper { position: relative; width: 36px; height: 36px; }
.status-indicator {
  position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; border-radius: 50%; border: 1px solid #1e293b; background: #e74c3c;
}
.status-indicator.verified { background: #2ecc71; }

/* Tables */
.simple-table, .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.simple-table td { padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
.data-table th { text-align: left; padding: 15px; color: #aaa; border-bottom: 1px solid rgba(255,255,255,0.15); font-weight: 600; }
.data-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }

.user-cell { display: flex; align-items: center; gap: 12px; }
.user-cell.clickable { cursor: pointer; transition: opacity 0.2s; }
.user-cell.clickable:hover { opacity: 0.8; }
.mini-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; background: #333; border: 1px solid #555; }
.role-badge { background: #f39c12; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: 8px; text-transform: uppercase; font-weight: 700; }
.actions-cell { text-align: right; }
.btn-icon { border: none; background: rgba(255,255,255,0.1); color: #fff; width: 34px; height: 34px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: 0.2s; }
.btn-icon:hover { background: rgba(255,255,255,0.2); }
.btn-icon.danger:hover { background: #c0392b; }
.no-data { text-align: center; color: #777; padding: 40px; font-style: italic; }

/* Quick Actions */
.quick-actions { display: flex; flex-direction: column; gap: 10px; }
.action-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #ccc; padding: 14px; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; transition: 0.2s; font-size: 13px; font-weight: 500; }
.action-btn:hover { background: rgba(255,255,255,0.1); border-color: #3498db; color: #fff; transform: translateX(5px); }

/* New Users List */
.new-users-list { display: flex; flex-direction: column; gap: 10px; max-height: 200px; overflow-y: auto; padding-right: 5px; }
.new-users-list::-webkit-scrollbar { width: 4px; }
.new-users-list::-webkit-scrollbar-thumb { background: #555; border-radius: 2px; }
.new-user-item { display: flex; align-items: center; gap: 10px; padding: 8px; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); }
.mini-avatar-small { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid #444; }
.new-user-info { display: flex; flex-direction: column; flex-grow: 1; overflow: hidden; }
.nu-name { font-size: 12px; font-weight: 600; color: #ecf0f1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nu-time { font-size: 10px; color: #888; }
.status-dot { width: 8px; height: 8px; background: #e74c3c; border-radius: 50%; display: block; }
.status-dot.verified { background: #2ecc71; box-shadow: 0 0 5px rgba(46, 204, 113, 0.4); }
.no-data-text-small { text-align: center; font-size: 12px; color: #666; padding: 20px 0; font-style: italic; }

/* Car Data Forms */
.mode-switch-container { display: flex; gap: 15px; margin-bottom: 30px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
.mode-btn { flex: 1; padding: 12px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: #ccc; font-weight: 700; cursor: pointer; transition: 0.3s; }
.mode-btn:hover { background: rgba(255,255,255,0.1); }
.mode-btn.add-mode.active { background: rgba(46, 204, 113, 0.15); border-color: #2ecc71; color: #2ecc71; }
.mode-btn.delete-mode.active { background: rgba(231, 76, 60, 0.15); border-color: #e74c3c; color: #e74c3c; }

.add-dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.admin-form-card { background: rgba(255, 255, 255, 0.03); padding: 20px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; }
.admin-form-card h3 { font-size: 14px; text-transform: uppercase; color: #aaa; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
.medium-card { grid-column: span 2; }
.large-card { grid-column: 1 / -1; background: rgba(30, 30, 30, 0.8); border-color: #ffd700; }

.search-bar { display: flex; gap: 10px; margin-bottom: 20px; }
.search-bar input { flex-grow: 1; background: rgba(0, 0, 0, 0.3); border: 1px solid #555; color: #fff; padding: 12px 15px; border-radius: 6px; }
.search-bar.compact input { background: rgba(255, 255, 255, 0.05); font-size: 13px; height: 36px; }

.form-group { margin-bottom: 15px; }
.form-group label { display: block; font-size: 12px; color: #ccc; margin-bottom: 5px; }
input, select { width: 100%; height: 42px; padding: 0 12px; background: rgba(0, 0, 0, 0.3); border: 1px solid #555; color: #fff; border-radius: 6px; box-sizing: border-box; font-size: 14px; margin-bottom: 5px; }
.btn-primary { background: #2980b9; color: #fff; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-weight: 700; text-transform: uppercase; font-size: 13px; transition: 0.2s; }
.btn-primary:hover { background: #3498db; }
.full-width { width: 100%; margin-top: 15px; }
.form-row { display: flex; gap: 20px; }
.form-row .form-group { flex: 1; }
.checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 6px; max-height: 200px; overflow-y: auto; border: 1px solid #444; }
.checkbox-item { display: flex; align-items: center; gap: 8px; }
.checkbox-item label { margin: 0; cursor: pointer; font-size: 13px; }

/* Category Switcher */
.category-pills { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px; margin-bottom: 25px; }
.category-pills button { background: transparent; border: 1px solid #555; color: #ccc; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-size: 13px; transition: 0.2s; white-space: nowrap; }
.category-pills button:hover { border-color: #aaa; color: #fff; }
.category-pills button.active { background: #e74c3c; color: #fff; border-color: #e74c3c; }

/* Loader */
.loading-state { text-align: center; padding: 60px; color: #888; }
.spinner { width: 40px; height: 40px; border: 4px solid #444; border-top-color: #e74c3c; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px auto; }
@keyframes spin { to { transform: rotate(360deg); } }

.header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.btn-refresh { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; transition: 0.2s; }
.btn-refresh:hover { background: rgba(255,255,255,0.1); transform: rotate(180deg); }
.fade-in { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* --- MODAL STYLES --- */
.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(4px);
  z-index: 9999; display: flex; justify-content: center; align-items: center;
}
.modal-window {
  background: #1e293b; border: 1px solid rgba(255,255,255,0.1);
  width: 500px; max-width: 90%; border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; animation: modalIn 0.3s ease;
}
@keyframes modalIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
.modal-header {
  padding: 15px 20px; background: rgba(255,255,255,0.05);
  display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1);
}
.modal-header h3 { margin: 0; font-size: 16px; color: #fff; }
.close-btn { background: none; border: none; color: #aaa; font-size: 24px; cursor: pointer; }
.close-btn:hover { color: #fff; }
.modal-body { padding: 20px; max-height: 400px; overflow-y: auto; }
.modal-footer {
  padding: 15px 20px; border-top: 1px solid rgba(255,255,255,0.1); text-align: right; background: rgba(0,0,0,0.2);
}
.btn-primary.small { padding: 8px 16px; font-size: 12px; }

/* Specific styles for Delete Modal */
.delete-modal { width: 400px; border: 1px solid #e74c3c; }
.text-center { text-align: center; display: flex; flex-direction: column; align-items: center; }
.user-preview {
  display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.05);
  padding: 10px 20px; border-radius: 8px; margin: 10px 0;
}
.btn-secondary {
  background: transparent; border: 1px solid #555; color: #ccc;
  padding: 8px 16px; border-radius: 6px; cursor: pointer; transition: 0.2s;
}
.btn-secondary:hover { border-color: #fff; color: #fff; }
.btn-danger {
  background: #c0392b; border: none; color: #fff;
  padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: 0.2s;
}
.btn-danger:hover { background: #e74c3c; }

/* Profile Styles */
.profile-modal { width: 600px; }
.profile-header-section { display: flex; gap: 20px; align-items: center; }
.profile-big-avatar { width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid #444; }
.profile-main-info h2 { margin: 0 0 5px 0; font-size: 18px; color: #fff; }
.profile-badges { display: flex; gap: 5px; margin-bottom: 8px; }
.p-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; font-weight: 700; background: #333; color: #ccc; }
.p-badge.verified { background: #2ecc71; color: #fff; }
.contact-row { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: #aaa; }
.divider { border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 15px 0; }
.profile-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.detail-item label { display: block; font-size: 10px; color: #777; text-transform: uppercase; margin-bottom: 2px; }
.detail-item span { font-size: 13px; color: #ecf0f1; }
.detail-item.full-width { grid-column: 1 / -1; }

/* Listings Section */
.section-title { margin: 0 0 10px 0; font-size: 14px; color: #ddd; text-transform: uppercase; letter-spacing: 0.5px; }
.listings-list { display: flex; flex-direction: column; gap: 10px; }
.listing-card-row { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 8px; border-radius: 8px; transition: 0.2s; }
.listing-card-row:hover { background: rgba(255,255,255,0.06); }
.car-thumb { width: 60px; height: 45px; object-fit: cover; border-radius: 4px; background: #000; }
.car-info { flex-grow: 1; }
.car-title { font-size: 13px; font-weight: 700; color: #fff; }
.car-year { font-weight: 400; color: #888; margin-left: 4px; }
.car-meta { font-size: 11px; color: #777; margin-bottom: 2px; }
.car-price { font-size: 13px; font-weight: 700; color: #f1c40f; }
.status-pill { font-size: 10px; padding: 3px 8px; border-radius: 10px; font-weight: 600; text-transform: uppercase; }
.status-pill.published { background: rgba(46, 204, 113, 0.2); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.3); }
.status-pill.hidden { background: rgba(255, 255, 255, 0.1); color: #aaa; }
</style>