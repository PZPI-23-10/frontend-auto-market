<template>
  <header class="navbar-area">
    <div class="container">
      <nav class="site-navbar">
        <a href="#" class="site-logo">AutoMarket</a>

        <ul :class="{ open: isOpen }">
          <li><a href="#">Главная</a></li>
          <li><a href="#">О нас</a></li>
          <li><a href="#">Контакты</a></li>
          <li><a href="#">Login</a></li>
        </ul>

        <button class="nav-toggler" @click="toggleNav">
          <span></span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
const isOpen = ref(false)

function toggleNav() {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
/* Сброс отступов и базовый стиль */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Open Sans', sans-serif;
}

/* Контейнер */
.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}

/* === NAVBAR === */
.navbar-area {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;

  /* прозрачный фон с блюром */
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);

  transition: background 0.3s ease;
}

.site-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

a.site-logo {
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  color: #fff;
  text-decoration: none;
}

/* Ссылки */
.site-navbar ul {
  display: flex;
  list-style: none;
  gap: 20px;
  transition: all 0.3s ease;
}

.site-navbar ul li a {
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  padding: 10px 15px;
  transition: color 0.3s ease;
}

.site-navbar ul li a:hover {
  color: #ffd700;
}

/* === BURGER MENU === */
.nav-toggler {
  border: none;
  background: transparent;
  cursor: pointer;
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
}

.nav-toggler span,
.nav-toggler span::before,
.nav-toggler span::after {
  content: '';
  width: 28px;
  height: 3px;
  background: #fff;
  display: block;
  border-radius: 3px;
  transition: 0.3s;
}

.nav-toggler span::before {
  transform: translateY(-8px);
}
.nav-toggler span::after {
  transform: translateY(5px);
}

/* === MOBILE === */
@media screen and (max-width: 768px) {
  .nav-toggler {
    display: flex;
  }

  .site-navbar ul {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(6px);
    flex-direction: column;
    align-items: center;
    max-height: 0;
    overflow: hidden;
  }

  .site-navbar ul.open {
    max-height: 400px;
    padding: 10px 0;
  }

  .site-navbar ul li a {
    padding: 15px;
    font-size: 16px;
  }
}
</style>
