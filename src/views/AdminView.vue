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
                  Dashboard & Alerts
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
                  Car Data (Brands/Models)
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
                <p class="stat-number">1,245</p>
              </div>
              <div class="stat-card">
                <h3>New Listings (24h)</h3>
                <p class="stat-number">+34</p>
              </div>
              <div class="stat-card warning">
                <h3>Suspicious Activity</h3>
                <p class="stat-number">3</p>
              </div>
            </div>

            <h3 class="section-title">⚠️ Security Alerts</h3>
            <div class="alerts-list">
              <div class="alert-item">
                <div class="alert-icon">🚫</div>
                <div class="alert-info">
                  <strong>User ID: 455 (Spam Bot?)</strong>
                  <p>Created 50 listings in 10 minutes.</p>
                </div>
                <button class="btn-small btn-danger">Investigate</button>
              </div>
              <div class="alert-item">
                <div class="alert-icon">⚠️</div>
                <div class="alert-info">
                  <strong>Multiple Failed Logins</strong>
                  <p>IP 192.168.1.1 tried admin access 10 times.</p>
                </div>
                <button class="btn-small btn-secondary">Block IP</button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'users'" class="tab-pane">
            <h2>User Management</h2>
            
            <div class="search-bar">
              <input type="text" placeholder="Search by email, name or ID..." v-model="userSearch">
              <button class="btn-primary">Search</button>
            </div>

            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in mockUsers" :key="u.id">
                  <td>#{{ u.id }}</td>
                  <td>{{ u.name }}</td>
                  <td>{{ u.email }}</td>
                  <td>
                    <span class="status-badge" :class="u.status">{{ u.status }}</span>
                  </td>
                  <td class="actions-cell">
                    <button class="btn-icon warning" title="Suspend" @click="suspendUser(u.id)">
                      ⏸
                    </button>
                    <button class="btn-icon danger" title="Delete" @click="deleteUser(u.id)">
                      🗑
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="activeTab === 'cars'" class="tab-pane">
            <h2>Manage Vehicle Data</h2>
            
            <div class="forms-grid">
              <div class="admin-form-card">
                <h3>Add New Brand</h3>
                <form @submit.prevent="addBrand">
                  <div class="form-group">
                    <label>Brand Name</label>
                    <input type="text" placeholder="e.g. Rivian">
                  </div>
                  <div class="form-group">
                    <label>Vehicle Type</label>
                    <select>
                      <option>Passenger Car</option>
                      <option>Truck</option>
                      <option>Moto</option>
                    </select>
                  </div>
                  <button class="btn-primary full-width">Add Brand</button>
                </form>
              </div>

              <div class="admin-form-card">
                <h3>Add New Model</h3>
                <form @submit.prevent="addModel">
                  <div class="form-group">
                    <label>Select Brand</label>
                    <select>
                      <option>Audi</option>
                      <option>BMW</option>
                    </select>
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
            <h2>Generate Reports</h2>
            
            <div class="report-controls">
              <div class="form-group">
                <label>Report Type</label>
                <select>
                  <option>New Users Registration</option>
                  <option>Listings Activity</option>
                  <option>Financial Report (Premium)</option>
                </select>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>From</label>
                  <input type="date">
                </div>
                <div class="form-group">
                  <label>To</label>
                  <input type="date">
                </div>
              </div>

              <button class="btn-primary" @click="generateReport">Generate PDF/CSV</button>
            </div>

            <div class="report-placeholder">
              <p>Select parameters above to generate data...</p>
            </div>
          </div>

        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();
const activeTab = ref('dashboard');
const userSearch = ref('');

// Мок для користувачів
const mockUsers = ref([
  { id: 101, name: 'Alex Driver', email: 'alex@test.com', status: 'active' },
  { id: 102, name: 'Spam Bot 3000', email: 'bot@scam.net', status: 'suspended' },
  { id: 103, name: 'Maria Carey', email: 'maria@sing.com', status: 'active' },
]);

function suspendUser(id) {
  if(confirm(`Suspend user #${id}?`)) {
    toast.info("User suspended (Simulation)");
  }
}

function deleteUser(id) {
  if(confirm(`DELETE user #${id}? This cannot be undone.`)) {
    toast.error("User deleted (Simulation)");
    mockUsers.value = mockUsers.value.filter(u => u.id !== id);
  }
}

function addBrand() {
  toast.success("Brand added (Simulation)");
}

function addModel() {
  toast.success("Model added (Simulation)");
}

function generateReport() {
  toast.success("Report generated and downloaded.");
}
</script>

<style scoped>
/* --- ГЛОБАЛЬНИЙ ФОН (ТЕМНИЙ ГРАДІЄНТ) --- */
.admin-view {
  min-height: 100vh;
  
  background: linear-gradient(109.6deg, rgb(36, 45, 57) 11.2%, rgb(16, 37, 60) 51.2%, rgb(0, 0, 0) 98.6%);  padding-top: 100px; /* Відступ під хедер */
  padding-bottom: 40px;
  font-family: 'Open Sans', sans-serif;
  color: #ecf0f1;
}

.container {
  max-width: 1400px; /* Ширше для адмінки */
  margin: 0 auto;
  padding: 0 20px;
}

/* Заголовок */
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

/* МАКЕТ */
.admin-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}
@media (max-width: 992px) {
  .admin-layout { grid-template-columns: 1fr; }
}

/* САЙДБАР */
.admin-sidebar {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
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
.admin-nav a:hover {
  background: rgba(255, 255, 255, 0.05); 
  color: #fff; 
}
.admin-nav a.active { 
  background: #2980b9; 
  color: #fff; 
}

/* КОНТЕНТ */
.admin-content {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  min-height: 500px;
}

h2 { margin-top: 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; margin-bottom: 25px; }
h3 { margin-top: 0; font-size: 18px; color: #ecf0f1; }

/* STATS CARDS */
.stats-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px;
}
.stat-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
}
.stat-card h3 { font-size: 14px; color: #bdc3c7; margin-bottom: 5px; }
.stat-number { font-size: 28px; font-weight: 700; margin: 0; color: #fff; }
.stat-card.warning .stat-number { color: #e74c3c; }

/* ALERTS */
.alerts-list { display: flex; flex-direction: column; gap: 15px; }
.alert-item {
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  padding: 15px; border-radius: 8px;
  display: flex; align-items: center; gap: 15px;
}
.alert-icon { font-size: 24px; }
.alert-info { flex-grow: 1; }
.alert-info strong { display: block; color: #e74c3c; }
.alert-info p { margin: 5px 0 0; font-size: 13px; color: #ccc; }

/* TABLES */
.search-bar { display: flex; gap: 10px; margin-bottom: 20px; }
.search-bar input { flex-grow: 1; }

.data-table {
  width: 100%; border-collapse: collapse;
  font-size: 14px;
}
.data-table th { text-align: left; padding: 12px; color: #95a5a6; border-bottom: 1px solid rgba(255,255,255,0.1); }
.data-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
.status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; text-transform: uppercase; font-weight: 700; }
.status-badge.active { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
.status-badge.suspended { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }

.actions-cell { display: flex; gap: 5px; }
.btn-icon {
  border: none; background: rgba(255,255,255,0.1); color: #fff;
  width: 30px; height: 30px; border-radius: 4px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.btn-icon.warning:hover { background: #f39c12; }
.btn-icon.danger:hover { background: #c0392b; }

/* FORMS */
.forms-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
@media (max-width: 768px) { .forms-grid { grid-template-columns: 1fr; } }

.admin-form-card {
  background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);
}
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-size: 13px; color: #bdc3c7; }
.form-group input, .form-group select {
  width: 100%; height: 40px; padding: 0 10px; background: rgba(0,0,0,0.2);
  border: 1px solid #555; color: #fff; border-radius: 4px;
  box-sizing: border-box;
}
.form-group select option { background: #333; }

.btn-primary {
  background: #2980b9; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; font-weight: 600;
}
.btn-primary:hover { background: #3498db; }
.btn-small { padding: 5px 10px; font-size: 12px; border-radius: 4px; border: none; cursor: pointer; color: #fff; }
.btn-danger { background: #c0392b; }
.full-width { width: 100%; }

/* REPORTS */
.report-controls { display: grid; gap: 15px; max-width: 500px; }
.report-placeholder {
  margin-top: 30px; padding: 40px; text-align: center; border: 2px dashed rgba(255,255,255,0.1); color: #7f8c8d; border-radius: 8px;
}
.form-row { display: flex; gap: 15px; }
</style>