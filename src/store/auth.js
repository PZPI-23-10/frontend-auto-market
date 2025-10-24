import { ref, computed } from 'vue'

const userId = ref(localStorage.getItem('userId'))
const token = ref(localStorage.getItem('token')) 

const isLoggedIn = computed(() => !!userId.value)

function setAuthData(id, authToken) {
  if (id && authToken) {
    userId.value = id
    localStorage.setItem('userId', id)
    
    token.value = authToken
    localStorage.setItem('token', authToken)
  }
}

function clearAuthData() {
  userId.value = null
  localStorage.removeItem('userId')
  
  token.value = null
  localStorage.removeItem('token') 
}


export function useAuth() {
  return {
    userId,
    token, 
    isLoggedIn,
    setAuthData, 
    clearAuthData 
  }
}