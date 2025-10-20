<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Вход в аккаунт</h2>

      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="example@mail.com"
            class="border w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 mb-1">Пароль</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Введите пароль"
            class="border w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          class="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Войти
        </button>

        <p class="mt-4 text-center text-gray-600 text-sm">
          Нет аккаунта?
          <router-link to="/register" class="text-blue-600 hover:underline">Зарегистрироваться</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function login() {
  if (email.value && password.value) {
    alert(`Добро пожаловать, ${email.value}!`)
  } else {
    alert('Введите email и пароль')
  }
}
</script>
