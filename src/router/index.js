import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views/ProfileView.vue'
import VerifyEmailView from '@/views/VerifyEmailView.vue'
import CreateListingView from '@/views/CreateListingView.vue' 
import ListingsView from '@/views/ListingsView.vue'
import ListingDetailView from '@/views/ListingDetailView.vue'
import ForgotPasswordView from '@/components/ForgotPasswordView.vue'
import NewsView from '../views/NewsView.vue'
import AboutView from '../views/AboutView.vue'
import { useAuth } from '@/store/auth'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: LoginView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/listings', name: 'listings', component: ListingsView },
  { path: '/listing/:id', name: 'listing-detail', component: ListingDetailView, props: true },

  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
  { path: '/verify-email', name: 'verify-email', component: VerifyEmailView, meta: { requiresAuth: true } },

  { path: '/create-listing', name: 'create-listing', component: CreateListingView, meta: { requiresAuth: true } },
  {
    path: '/listing/edit/:id',
    name: 'edit-listing',
    component: CreateListingView, 
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/news',
    name: 'news',
    component: NewsView
  },
  { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
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