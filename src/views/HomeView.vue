<template>
  <div class="home-page">
    <section 
      class="hero-section" 
      :style="{ backgroundImage: 'url(' + currentCarImage + ')' }"
    >
      <div class="container hero-container">
        
        <div class="hero-content">
          <span class="hero-subtitle">NEW IN STOCK</span>
          <h1 class="hero-title">Upgrade Your Driving Experience</h1>
          <div class="hero-buttons">
            <a href="#" class="btn btn-primary">Discover More</a>
            <a href="#" class="btn btn-secondary">Meet Horizon GT</a>
          </div>
        </div>

        <div class="hero-form">
          <h2>Find Your Ride</h2>
          <form>
            <div class="form-group">
              <label for="brand">BRAND</label>
              <select id="brand" name="brand">
                <option value="">Brand*</option>
              </select>
            </div>
            <div class="form-group">
              <label for="model">MODEL</label>
              <select id="model" name="model">
                <option value="">Model*</option>
              </select>
            </div>
            <div class="form-group">
              <label for="type">TYPE</label>
              <select id="type" name="type">
                <option value="">Type*</option>
              </select>
            </div>
            <button type="submit" class="btn-submit">Get Started</button>
          </form>
        </div>

      </div>
    </section>
    <section >
        
    </section>
  </div>
</template>
<script setup>
import { ref } from 'vue';

import carImage1 from '@/assets/car-header1.jpg'; // Ваш текущий фон
import carImage2 from '@/assets/car-header2.jpg'; // Если есть другое изображение

// Создайте массив изображений, чтобы потом легко их переключать
const carImages = [
  carImage1,
   carImage2, // Раскомментируйте, если добавите carImage2
  // carImage3, // И так далее
];

const currentCarImage = ref(carImages[0]); 

 setInterval(() => {
  const currentIndex = carImages.indexOf(currentCarImage.value);
  const nextIndex = (currentIndex + 1) % carImages.length;
   currentCarImage.value = carImages[nextIndex];
   }, 5000); // Меняйте изображение каждые 5 секунд

</script>
<style scoped>

.home-page {
  width: 100%;
  margin: 0;
}

.hero-section {
  min-height: 100vh; /* Используем min-height */
background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: white;
  position: relative;
  padding-top: 5px;
  padding-bottom: 5px;
  transition: background-image 0.7s ease-in-out;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); /* лёгкое затемнение */
}

/* Добавлен стиль для .container (как в шапке) */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0px;
  position: relative; /* Чтобы быть над ::before */
  z-index: 1;
}

/* Новый контейнер для разделения на 2 колонки */
.hero-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

/* === Левая часть (Текст) === */
.hero-content {
  position: relative;
  z-index: 1;
  text-align: left; /* Изменено с center на left */
  flex-basis: 55%;
}

.hero-subtitle {
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
}

.hero-content h1, .hero-title { /* Объединяем стили */
  font-size: 56px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 30px;
  line-height: 1.2;
}

.hero-content p {
  /* Этот стиль больше не нужен, т.к. P был заменен кнопками */
  font-size: 20px;
}

.hero-buttons {
  display: flex;
  gap: 15px;
}

.hero-buttons .btn {
  padding: 15px 30px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.btn-primary {
  background: #fff;
  color: #000;
}
.btn-primary:hover {
  background: #eee;
}

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
}
.btn-secondary:hover {
  background: #fff;
  color: #000;
}


.hero-form {
  flex-basis: 27%; /* Уменьшено (было 35%) */
  background: rgba(30, 30, 30, 0.7);
  backdrop-filter: blur(5px);
  padding: 30px; /* Уменьшено (было 30px) */
  border-radius: 8px;
  color: #fff;
  position: relative;
  z-index: 1;
}

.hero-form h2 {
  font-size: 32px;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.form-group select {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #555;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
}

.form-group select option {
  background: #333;
  color: #fff;
}

.btn-submit {
  width: 100%;
  padding: 15px;
  background: #cc0000; /* Красный */
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  text-transform: uppercase;
}

.btn-submit:hover {
  background: #aa0000;
}


/* === МОБИЛЬНАЯ ВЕРСИЯ === */
@media screen and (max-width: 768px) {
  .hero-section {
    padding-top: 100px;
    padding-bottom: 50px;
  }
.container {
    padding: 0 20px; /* Это добавит отступы по бокам на мобильных */
  }
 .hero-container {
    flex-direction: column; /* Ставим в столбик */
    gap: 40px;
  }

  .hero-content {
    flex-basis: auto;
    text-align: center; /* Возвращаем центр на мобильных */
  }

  .hero-content h1, .hero-title {
    font-size: 36px; /* Шрифт поменьше */
  }

  .hero-buttons {
    justify-content: center; /* Кнопки по центру */
  }

  .hero-form {
    flex-basis: auto;
    width: 100%; 
  }
}
</style>