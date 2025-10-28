
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue' 
import VerifyEmailView from '@/views/VerifyEmailView.vue' 
import ForgotPasswordView from '@/components/ForgotPasswordView.vue'
import { useAuth } from '@/store/auth' 

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } }, 
  { path: '/verify-email', name: 'verify-email', component: VerifyEmailView, meta: { requiresAuth: true } }, 
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const { token } = useAuth(); 
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !token.value) {
    console.log('Навігація заблокована: потрібна авторизація, токена немає. Перехід на /login.');
    next({ name: 'login' }); 
  } else {
    console.log(`Навігація дозволена до: ${to.path}`);
    next(); 
  }
});

export default router