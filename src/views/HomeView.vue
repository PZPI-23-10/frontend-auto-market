<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <h1>Найди свой автомобиль</h1>
        <p>Лучшие предложения рядом с тобой</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  height: 100vh;
  margin: 0;
}

.hero-section {
  height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4); /* лёгкое затемнение */
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: bold;
}

.hero-content p {
  font-size: 20px;
}
</style>
