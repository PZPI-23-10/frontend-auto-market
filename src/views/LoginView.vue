<template>
  <div class="login-container">
    <div class="background">
      <div class="shape blue"></div>
      <div class="shape orange"></div>
    </div>

    <form @submit.prevent="login">
      <h3>Login Here</h3>

      <label for="username">Username</label>
      <input id="username" type="text" placeholder="Email or Phone" v-model="username" />

      <label for="password">Password</label>
      <input id="password" type="password" placeholder="Password" v-model="password" />

      <button type="submit" class="login-btn">Log In</button>

      <div class="social">
        <div class="social-btn google" @click="loginWith('Google')">
          <i class="fab fa-google"></i> Google
        </div>
        <div class="social-btn facebook" @click="loginWith('Facebook')">
          <i class="fab fa-facebook"></i> Facebook
        </div>
      </div>

      <button type="button" class="register-btn" @click="goToRegister">
        Register
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()

/* Змінемо, коли бекенд */
function login() {
  if (username.value && password.value) {
    alert(`Добро пожаловать, ${username.value}!`)
  } else {
    alert('Введите логин и пароль')
  }
}

function loginWith(provider) {
  alert(`Вход через ${provider}`)
}

function goToRegister() {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  background-color: #080710;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* Цветные круги */
.background {
  width: 380px;
  height: 450px;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
}
.shape {
  height: 160px;
  width: 160px;
  position: absolute;
  border-radius: 50%;
}
.shape.blue {
  background: linear-gradient(#1845ad, #23a2f6);
  left: -70px;
  top: -70px;
}
.shape.orange {
  background: linear-gradient(to right, #ff512f, #f09819);
  right: -40px;
  bottom: -70px;
}

/* Форма */
form {
  width: 360px;
  background-color: rgba(255, 255, 255, 0.13);
  position: relative;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(8,7,16,0.6);
  padding: 40px 30px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

form h3 {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 10px;
  color: #fff;
}
label {
  width: 100%;
  font-family: 'Poppins', sans-serif;
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-top: 15px;
  color: #fff;
}
/* Ввод */
input {
  font-family: 'Poppins', sans-serif;
  display: block;
  width: 100%;
  max-width: 340px;
  height: 45px;
  padding: 0 10px;
  border-radius: 3px;
  background-color: rgba(255,255,255,0.07);
  border: none;                
  box-shadow: none;            
  font-size: 14px;
  font-weight: 300;
  margin-top: 8px;
  color: #fff;
}

::placeholder {
  color: #e5e5e5;
}

.login-btn, .register-btn {
  font-family: 'Poppins', sans-serif;
  width: 100%;
  max-width: 360px; /* чтобы ширина совпадала с инпутами */
  padding: 12px 0;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  margin-top: 45px;
}

.login-btn {
  background-color: #ffffff;
  color: #080710;
  transition: 0.3s;
}
.login-btn:hover {
  background-color: #f0f0f0;
}

.register-btn {
  background-color: rgba(255,255,255,0.27);
  color: #fff;
}

.social {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.social-btn {
  font-family: 'Poppins', sans-serif;
  width: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  border-radius: 6px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  transition: 0.3s;
  gap: 6px;
}

.social-btn.google {
  background-color: rgba(255,255,255,0.27);
}
.social-btn.facebook {
  background-color: rgba(255,255,255,0.27);
}

.social-btn i {
  margin-right: 4px;
}
</style>
