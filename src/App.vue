<template>
  <div id="app">
    <Navbar />
    <router-view />
    <ChatWidget />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'; 
import { useAuth } from '@/store/auth';
import Navbar from './components/Navbar.vue'
import ChatWidget from '@/components/chat/ChatWidget.vue';
const { checkVerificationStatus, isAuthenticated } = useAuth();
onMounted(() => {
    if (isAuthenticated.value) {
        checkVerificationStatus(); 
    }
});

</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
