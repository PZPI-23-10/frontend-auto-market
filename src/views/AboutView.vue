<template>
  <div class="about-view">
    
    <section class="about-hero">
      <div class="container">
        <div class="hero-text">
          <h1>{{ t('about.title') }}</h1>
          <p>{{ t('about.subtitle') }}</p>
        </div>
      </div>
    </section>

    <section class="mission-section">
      <div class="container mission-container">
        <div class="mission-content">
          <h2>{{ t('about.mission.title') }}</h2>
          <p>{{ t('about.mission.text1') }}</p>
          <p>{{ t('about.mission.text2') }}</p>
          <router-link to="/listings" class="btn-link">
            {{ t('about.mission.cta') }} →
          </router-link>
        </div>
        <div class="mission-image">
          <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80" alt="Our Mission" />
        </div>
      </div>
    </section>

    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3>10+</h3>
            <p>{{ t('about.stats.years') }}</p>
          </div>
          <div class="stat-card">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
            </div>
            <h3>15k+</h3>
            <p>{{ t('about.stats.customers') }}</p>
          </div>
          <div class="stat-card">
            <div class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3>50k+</h3>
            <p>{{ t('about.stats.cars') }}</p>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Фейковые данные команды (можно заменить на свои фото из assets)
const teamMembers = ref([
  { id: 1, name: 'Олексій Коваленко', role: 'CEO & Founder', photo: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, name: 'Марія Бондар', role: 'Head of Sales', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 3, name: 'Дмитро Шевченко', role: 'Lead Mechanic', photo: 'https://randomuser.me/api/portraits/men/85.jpg' },
  { id: 4, name: 'Анна Литвин', role: 'Customer Support', photo: 'https://randomuser.me/api/portraits/women/65.jpg' }
]);
</script>

<style scoped>
.about-view {
  background-color: #121212;
  color: #fff;
  min-height: 100vh;
}

/* HERO */
.about-hero {
  height: 60vh;
  background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-top: 80px;
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.hero-text p {
  font-size: 1.2rem;
  color: #ccc;
  max-width: 600px;
  margin: 0 auto;
}

/* SECTIONS COMMON */
.mission-section, .stats-section, .team-section {
  padding: 80px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  font-size: 2.2rem;
  margin-bottom: 30px;
  color: #fff;
}

/* MISSION */
.mission-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  align-items: center;
}

.mission-content p {
  line-height: 1.7;
  color: #bbb;
  margin-bottom: 20px;
  font-size: 1.05rem;
}

.btn-link {
  color: #cc0000;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: color 0.3s;
}
.btn-link:hover {
  color: #ff4d4d;
}

.mission-image img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.1);
}

/* STATS */
.stats-section {
  background-color: #1a1a1a;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  text-align: center;
}

.stat-card {
  padding: 30px;
}

.stat-card .icon {
  color: #cc0000;
  margin-bottom: 15px;
}

.stat-card h3 {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
}

.stat-card p {
  color: #888;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

/* TEAM */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
}

.team-card {
  background: #1f1f1f;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  border: 1px solid #333;
  transition: transform 0.3s ease;
}

.team-card:hover {
  transform: translateY(-10px);
  border-color: #cc0000;
}

.team-card img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #cc0000;
  margin-bottom: 15px;
}

.team-card h3 {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: #fff;
}

.team-card span {
  color: #888;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hero-text h1 { font-size: 2.5rem; }
  .mission-container { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr; }
}
</style>