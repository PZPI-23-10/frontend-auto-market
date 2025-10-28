<template>
  <header class="navbar-area">
    <div class="container">
      <nav class="site-navbar">
        <a href="/" class="site-logo">
          <img src="@/assets/Logo/logo.png" alt="AutoMarket Logo" class="logo-img" />
        </a>

        <ul :class="{ open: isOpen }" class="main-nav">
          
          <li v-if="!isAuthPage" class="navbar-dropdown">
            <a href="#">Хто Ми Такі</a>
            <ul class="dropdown-content">
              <li><a href="#">Про нас</a></li>
              <li><a href="#">Зв'яжіться з нами</a></li>
              <li><a href="#">Відгуки</a></li>
            </ul>
          </li>
          
          <li v-if="!isAuthPage" class="navbar-dropdown">
            <a href="#">Новини</a>
          </li>
          
          <li v-if="!isAuthPage" class="navbar-dropdown"><a href="#">Магазин</a>
            <ul class="dropdown-content">
              <li><a href="#">Усі машини</a></li>
              <li><a href="#">Електричні</a></li>
              <li><a href="#">Гибріди</a></li>
              <li><a href="#">Спортивні машини</a></li>
            </ul>
          </li>
          
          <li class="navbar-dropdown lang-mobile">
            <a href="#">Мова</a>
            <ul class="dropdown-content">
              <li><a href="#" @click.prevent="changeLanguage('ua')">Українська</a></li>
              <li><a href="#" @click.prevent="changeLanguage('en')">English</a></li>
            </ul>
          </li>

          <li v-if="!isLoggedIn" class="login-mobile">
            <router-link to="/login">Увійти</router-link>
          </li>
          <template v-if="isLoggedIn">
            <li class="login-mobile">
              <router-link to="/profile">Мій Профіль</router-link>
            </li>
            <li class="login-mobile">
              <a href="#" @click.prevent="handleLogout">Вийти</a>
            </li>
          </template>
          </ul>
        
        <div class="navbar-right">
          <ul class="user-nav">
            
            <li class="navbar-dropdown lang-desktop">
              <a href="#" class="lang-toggle">
                <img src="@/assets/Logo/world.png" alt="Language" class="world-img" />
              </a>
              <ul class="dropdown-content dropdown-right">
                <li><a href="#" @click.prevent="changeLanguage('ua')">Українська</a></li>
                <li><a href="#" @click.prevent="changeLanguage('en')">English</a></li>
              </ul>
            </li>

            <li v-if="!isLoggedIn" class="login-desktop">
              <router-link to="/login">Увійти</router-link>
            </li>
            
            <li v-if="isLoggedIn" class="navbar-dropdown lang-desktop">
              <a href="#" class="lang-toggle" style="padding: 10px 15px;">
                <span>Профіль</span> 
              </a>
              <ul class="dropdown-content dropdown-right">
                <li><router-link to="/profile">Налаштування</router-link></li>
                <li><a href="#" @click.prevent="handleLogout">Вийти</a></li>
              </ul>
            </li>
            </ul>
          <button class="nav-toggler" @click="toggleNav">
            <span></span>
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/store/auth'

const isOpen = ref(false)
const route = useRoute()
const router = useRouter()

const { isAuthenticated: isLoggedIn, isVerified, clearAuthData } = useAuth()

function handleLogout() {
  clearAuthData() 
  router.push('/')
}

function toggleNav() {
  isOpen.value = !isOpen.value
}

// Пути, на которых прячем меню
const hideNavPaths = ['/login', '/register'] 
const isAuthPage = computed(() => {
  return hideNavPaths.includes(route.path)
})

function changeLanguage(lang) {
  alert(`Выбрана мова: ${lang}`)
}
</script>

<style scoped>
.logo-img {
  width: 140px; 
  margin-top:20px ; 
  height: auto; 
}
.world-img {
  width: 30px; 
  margin-right:10px ; 
  height: auto; 
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: 'Open Sans', sans-serif;
}

.container {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar-area {
  position: absolute    ;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);
  transition: background 0.3s ease;
}

.site-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  position: relative;
}

/* === ОБЩИЕ СТИЛИ ДЛЯ ВСЕХ СПИСКОВ === */
.site-navbar ul {
  display: flex;
  list-style: none;
  gap: 20px;
  transition: all 0.3s ease;
  margin: 0; /* Добавлен сброс */
  padding: 0; /* Добавлен сброс */
}

.site-navbar ul li a {
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  padding: 10px 15px;
  transition: color 0.3s ease;
  display: block; /* Добавлено для предсказуемости */
}

.site-navbar ul li a:hover {
  color: #ffd700;
}

/* Контейнер для правых элементов */
.navbar-right {
  display: flex;
  align-items: center;
}

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

/* === ОБЩИЕ СТИЛИ ВЫПАДАЮЩЕГО СПИСКА === */
.site-navbar .dropdown-content {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  min-width: 100px;
  padding: 0;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 0;
}

.site-navbar .dropdown-content li {
  margin: 0;
  padding: 0;
  line-height: 1; 
}

.site-navbar .dropdown-content li a {
  display: block;
  padding: 10px 20px;
  color: #fff;
  text-decoration: none;
  line-height: normal;
  white-space: nowrap;
}

.site-navbar .dropdown-content li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffd700;
}

/* === ДЕСКТОП ВЕРСИЯ === */
@media screen and (min-width: 769px) {
  .navbar-dropdown {
    position: relative;
  }
  
  /* 1. ЦЕНТРИРУЕМ ОСНОВНОЕ МЕНЮ */
  .site-navbar ul.main-nav {
    position: absolute;
    left:  58%;
    transform: translateX(-50%);
  }

  /* 2. ПОКАЗЫВАЕМ ПРАВЫЕ ЭЛЕМЕНТЫ */
  .user-nav {
    display: flex;
    align-items: center; /* <-- ВОТ ИСПРАВЛЕНИЕ, которое выравнивает "Увійти" */
  }
  .login-desktop {
    display: block;
  }
  .login-mobile {
    display: none;
  }
  .lang-desktop {
    display: block;
  }
  .lang-mobile {
    display: none;
  }

  /* 3. СТИЛИ ДЛЯ ЦЕНТРАЛЬНЫХ ВЫПАДАЮЩИХ СПИСКОВ */
  .site-navbar .main-nav .dropdown-content {
    backdrop-filter: blur(6px);
    position: absolute;
    top: 100%;
    left: 50%; /* Центрируем */
    transform: translateX(-50%); /* Центрируем */
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.6s ease;
    border-radius: 5px;
  }

  /* 4. СТИЛИ ДЛЯ ПРАВЫХ ВЫПАДАЮЩИХ СПИСКОВ (ЯЗЫК) */
  .site-navbar .user-nav .dropdown-content {
    backdrop-filter: blur(6px);
    position: absolute;
    top: 100%;
    right: 0; /* Выравниваем по правому краю */
    left: auto; /* Сбрасываем left */
    transform: none; /* Сбрасываем transform */
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.6s ease;
    border-radius: 5px;
  }

  /* 5. Убираем лишний отступ у иконки языка */
  .site-navbar .user-nav a.lang-toggle {
    padding: 10px 0; /* Убираем боковые отступы */
  }


  .site-navbar .dropdown-content li {
    border-top: 1px solid #444;
  }

  .site-navbar .dropdown-content li:first-child {
    border-top: none;
  }

  .navbar-dropdown:hover .dropdown-content {
    max-height: 500px;
  }
}

/* === МОБИЛЬНАЯ ВЕРСИЯ === */
@media screen and (max-width: 768px) {
  .nav-toggler {
    display: flex;
  }

  /* 1. СКРЫВАЕМ ПРАВЫЕ ЭЛЕМЕНТЫ */
  .user-nav {
    display: none;
  }
  .login-desktop {
    display: none;
  }
  .login-mobile {
    display: block;
  }
  .lang-desktop {
    display: none;
  }
  .lang-mobile {
    display: block;
  }

  /* 2. СТИЛИЗУЕМ МОБИЛЬНОЕ МЕНЮ (теперь это .main-nav) */
  .site-navbar ul.main-nav {
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
    gap: 0;
    transition: max-height 1s ease;
  }
  .site-navbar ul.main-nav.open {
    max-height: 500px;
    padding: 10px 0;
  }
  .site-navbar ul.main-nav li a {
    padding: 15px;
    font-size: 16px;
  }

  /* 3. СТИЛИ ДЛЯ ВЫПАДАЮЩИХ СПИСКОВ В МОБ. ВЕРСИИ */
  .site-navbar .dropdown-content {
    position: static;
    width: 100%;
    height: auto !important;
    backdrop-filter: none;
    align-items: stretch;
  }

  .site-navbar .dropdown-content li {
    border-top: none;
    width: 100%;
  }

  .site-navbar .dropdown-content li a {
    padding: 12px 20px;
    width: 100%;
    text-align: center; 
    line-height: normal;
    font-size: 15px; 
    padding-left: 0; 
  }
}
</style>