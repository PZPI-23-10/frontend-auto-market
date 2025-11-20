<template>
  <div class="news-view">
    <div class="container">
      <div class="news-header">
        <h1>{{ $t('news.title') }}</h1>
        <p>{{ $t('news.subtitle') }}</p>
      </div>

      <div class="news-grid">
        <article v-for="item in newsList" :key="item.id" class="news-card">
          <div class="image-wrapper">
            <img :src="item.image" :alt="item.title" loading="lazy" />
            <span class="category-tag">{{ item.category }}</span>
          </div>
          <div class="card-content">
            <div class="meta">
              <span class="date">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {{ item.date }}
              </span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <button class="read-more">
              {{ $t('news.readMore') }} 
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </article>
      </div>

      <div class="pagination">
        <button class="btn-load-more">{{ $t('news.loadMore') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Моковые данные (заглушки)
const newsList = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80',
    category: 'Technology',
    date: '20.11.2025',
    title: 'Tesla представляє нову батарею',
    description: 'Революційна технологія дозволить проїжджати до 1000 км на одному заряді. Це змінює правила гри на ринку електрокарів.'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
    category: 'Reviews',
    date: '18.11.2025',
    title: 'Огляд нового BMW M5 2026',
    description: 'Гібридна потужність та класичний комфорт. Ми протестували новинку на треку і готові поділитися враженнями.'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
    category: 'Market',
    date: '15.11.2025',
    title: 'Ціни на вживані авто падають',
    description: 'Аналітики прогнозують зниження цін на вторинному ринку на 15% до кінця року через насичення ринку.'
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    category: 'Classic',
    date: '01.11.2025',
    title: 'Як обрати ретро-автомобіль',
    description: 'Поради експертів щодо купівлі та реставрації класичних маслкарів 60-х років.'
  }
]);
</script>

<style scoped>
.news-view {
  padding-top: 120px; /* Отступ под фиксированный хедер */
  padding-bottom: 60px;
  background-color: #1a1a1a; /* Темный фон как в теме */
  min-height: 100vh;
  color: #fff;
}

.news-header {
  text-align: center;
  margin-bottom: 50px;
}

.news-header h1 {
  font-size: 3rem;
  margin-bottom: 10px;
  color: #fff;
}

.news-header p {
  color: #ccc;
  font-size: 1.2rem;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
}

.news-card {
  background: #2a2a2a;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #333;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  border-color: #cc0000; /* Красный акцент при наведении */
}

.image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .image-wrapper img {
  transform: scale(1.05);
}

.category-tag {
  position: absolute;
  top: 15px;
  right: 15px;
  background-color: #cc0000;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 200px);
}

.meta {
  display: flex;
  align-items: center;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.meta .date {
  display: flex;
  align-items: center;
  gap: 5px;
}

.news-card h3 {
  font-size: 1.4rem;
  margin-bottom: 10px;
  line-height: 1.4;
  color: #fff;
}

.news-card p {
  color: #bbb;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1; /* Прижимает кнопку к низу */
}

.read-more {
  background: none;
  border: none;
  color: #cc0000;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  font-size: 1rem;
  transition: gap 0.2s ease;
}

.read-more:hover {
  gap: 12px;
  color: #ff4d4d;
}

.pagination {
  margin-top: 50px;
  text-align: center;
}

.btn-load-more {
  background-color: transparent;
  border: 2px solid #cc0000;
  color: #fff;
  padding: 12px 40px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-load-more:hover {
  background-color: #cc0000;
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
  .news-header h1 {
    font-size: 2rem;
  }
}
</style>