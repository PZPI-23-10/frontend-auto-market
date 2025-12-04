<template>
  <header class="navbar-area">
    <div class="container">
      <nav class="site-navbar">
        <a href="/" class="site-logo">
          <img src="@/assets/Logo/logo.png" alt="AutoMarket Logo" class="logo-img" />
        </a>

        <ul :class="{ open: isOpen }" class="main-nav">
          
          <li v-if="!isAuthPage" class="navbar-dropdown">
            <a href="#">
             
              <span>{{ $t('nav.whoWeAre') }}</span>
            </a>
            <ul class="dropdown-content">
              <li>
                <router-link to="/about">{{ $t('nav.aboutUs') }}</router-link>
              </li>
              <li><a href="#">{{ $t('nav.contactUs') }}</a></li>
              <li><a href="#">{{ $t('nav.reviews') }}</a></li>
            </ul>
          </li>
          
          <li v-if="!isAuthPage" class="navbar-dropdown">
            <router-link to="/news"> 
              <span>{{ $t('nav.news') }}</span>
            </router-link>
          </li>
          
          <li v-if="!isAuthPage" class="navbar-dropdown">
            <a href="#">
              <span>{{ $t('nav.shop') }}</span>
            </a>
            <ul class="dropdown-content">
              <li>
                <router-link :to="{ path: '/listings' }">{{ $t('nav.allCars') }}</router-link>
              </li>
              <li>
                <router-link :to="{ path: '/listings', query: { fuel: 'Електро' } }">{{ $t('nav.electric') }}</router-link>
              </li>
              <li>
                <router-link :to="{ path: '/listings', query: { fuel: 'Гібрид' } }">{{ $t('nav.hybrid') }}</router-link>
              </li>
              <li>
                <router-link :to="{ path: '/listings', query: { type: 'sport' } }">{{ $t('nav.sport') }}</router-link>
              </li>
            </ul>
          </li>

          <li class="navbar-dropdown lang-mobile">
            <a href="#">
              <span>{{ $t('nav.language') }}</span>
            </a>
            <ul class="dropdown-content">
              <li><a href="#" @click.prevent="changeLanguage('ua')">Українська</a></li>
              <li><a href="#" @click.prevent="changeLanguage('en')">English</a></li>
            </ul>
          </li>

          <li v-if="!isLoggedIn" class="login-mobile">
            <router-link to="/login">
              <span>{{ $t('nav.login') }}</span>
            </router-link>
          </li>
          
          <template v-if="isLoggedIn">
            <li v-if="isAdmin" class="login-mobile">
               <router-link to="/admin" style="color: #d9534f;">
                 <span>{{ $t('nav.admin') }}</span>
               </router-link>
            </li>
            <li class="login-mobile">
              <router-link to="/profile">
                <span>{{ $t('nav.myProfile') }}</span>
              </router-link>
            </li>
            <li class="login-mobile">
              <router-link to="/favorites">
                <span>{{ $t('nav.favorites') }}</span>
              </router-link>
            </li>
            <li class="login-mobile">
              <a href="#" @click.prevent="handleLogout">
                <span>{{ $t('nav.logout') }}</span>
              </a>
            </li>
          </template>
        </ul>
        
        <div class="navbar-right">
          <ul class="user-nav">
            
            <li v-if="isLoggedIn" class="nav-icon-btn">
              <router-link to="/favorites" class="heart-toggle" :title="$t('nav.favorites')">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </router-link>
            </li>

            <li class="navbar-dropdown lang-desktop">
              <a href="#" class="lang-toggle" :title="$t('nav.language')">
                <img src="@/assets/Logo/world.png" alt="Language" class="world-img" />
              </a>
              <ul class="dropdown-content dropdown-right">
                <li><a href="#" @click.prevent="changeLanguage('ua')">Українська</a></li>
                <li><a href="#" @click.prevent="changeLanguage('en')">English</a></li>
              </ul>
            </li>

            <li v-if="!isLoggedIn" class="login-desktop">
              <router-link to="/login">
                <span>{{ $t('nav.login') }}</span>
              </router-link>
            </li>
            
            <li v-if="isLoggedIn" class="navbar-dropdown lang-desktop">
                <a href="#" class="lang-toggle" style="padding: 10px 15px;">
                  <span>{{ $t('nav.profile') }}</span> 
                </a>
                <ul class="dropdown-content dropdown-right">
                 <li v-if="isAdmin">
                    <router-link to="/admin" style="color: #d9534f; font-weight: bold;">
                        {{ $t('nav.admin') }} 
                    </router-link>
                </li>
                  <li><router-link to="/profile">{{ $t('nav.settings') }}</router-link></li>
                  <li><a href="#" @click.prevent="handleLogout">{{ $t('nav.logout') }}</a></li>
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
import { useI18n } from 'vue-i18n'
// Импортируем наш стор
import { useAuth } from '@/store/auth' 

const isOpen = ref(false)
const route = useRoute()
const router = useRouter()
const { locale } = useI18n()

// 1. Достаем isAdmin. Теперь он сам знает, админ ты или нет.
const { isAuthenticated: isLoggedIn, isAdmin, clearAuthData, checkVerificationStatus } = useAuth()

// 2. Запускаем проверку при загрузке меню (на случай, если пользователь нажал F5)
checkVerificationStatus();

function handleLogout() {
  clearAuthData() 
  router.push('/')
}

function toggleNav() {
  isOpen.value = !isOpen.value
}

const hideNavPaths = ['/login', '/register'] 
const isAuthPage = computed(() => {
  return hideNavPaths.includes(route.path)
})

function changeLanguage(lang) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>
<style scoped>

.logo-img {
  width: auto;      
  
  height: 80px;    
  object-fit: contain; 
  
  margin-top: 5px;    
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
.site-navbar ul {
  display: flex;
  list-style: none;
  gap: 20px;
  transition: all 0.3s ease;
  margin: 0;
  padding: 0;
}
.site-navbar ul li a {
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  padding: 10px 15px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}
.nav-icon {
  width: 20px;    
  height: 20px;
  flex-shrink: 0; 
}

.nav-icon.svg-icon {
  stroke: #fff;
  fill: none;
  transition: stroke 0.3s ease;
}

.nav-icon.img-icon {
  margin: 0; 
}

.site-navbar ul li a:hover .svg-icon {
  stroke: #ffd700;
}
.site-navbar ul li a:hover {
  color: #ffd700;
}
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

/* * НОВІ СТИЛІ ДЛЯ ІКОНКИ "СЕРДЕЧКО"
 */
.heart-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  /* (Вирівнюємо так само, як посилання "Профіль") */
  padding: 10px 15px; 
}
.heart-toggle svg {
  width: 24px;
  height: 24px;
  stroke: #fff;
  fill: none; /* <--- Важливо, щоб воно не було залите */
  transition: all 0.3s ease;
}
.heart-toggle:hover svg {
  stroke: #ffd700; /* Жовта обводка при наведенні */
}
/* Можна додати клас .active, якщо сторінка /favorites,
   і зробити його заповненим:
.router-link-active svg {
  fill: #ffd700;
  stroke: #ffd700;
} 
*/

/* * КІНЕЦЬ НОВИХ СТИЛІВ
 */

@media screen and (min-width: 769px) {
  .navbar-dropdown {
    position: relative;
  }
  .site-navbar ul.main-nav {
    position: absolute;
    left:   58%;
    transform: translateX(-50%);
  }
  .user-nav {
    display: flex;
    align-items: center;
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
  .site-navbar .main-nav .dropdown-content {
    backdrop-filter: blur(6px);
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.6s ease;
    border-radius: 5px;
  }
  .site-navbar .user-nav .dropdown-content {
    backdrop-filter: blur(6px);
    position: absolute;
    top: 100%;
    right: 0;
    left: auto;
    transform: none;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.6s ease;
    border-radius: 5px;
  }
  .site-navbar .user-nav a.lang-toggle {
    padding: 10px 0;
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

@media screen and (max-width: 768px) {
  .nav-toggler {
    display: flex;
  }
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