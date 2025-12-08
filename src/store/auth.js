import { ref, computed } from 'vue';
import axios from 'axios'; 

const userId = ref(localStorage.getItem('userId') || null);
const token = ref(localStorage.getItem('token') || null);
// Добавляем хранение ролей (массив строк)
const userRoles = ref(JSON.parse(localStorage.getItem('userRoles') || '[]'));
const isVerified = ref(JSON.parse(localStorage.getItem('isVerified') || 'false')); 

const PROFILE_BASE_URL = 'https://backend-auto-market-wih5h.ondigitalocean.app/api/Profile';

export function useAuth() {

  const isAuthenticated = computed(() => !!token.value);
  
  // Вычисляемое свойство: является ли юзер админом
  const isAdmin = computed(() => {
    return isAuthenticated.value && userRoles.value.includes('Admin');
  });

  function setAuthData(newUserId, newToken, verifiedStatus = false) { 
    userId.value = newUserId;
    token.value = newToken;
    isVerified.value = verifiedStatus; 
    
    localStorage.setItem('userId', newUserId);
    localStorage.setItem('token', newToken);
    localStorage.setItem('isVerified', JSON.stringify(verifiedStatus)); 
    
    // При логине мы пока не знаем ролей, если их не передали, 
    // но они подтянутся через checkVerificationStatus
    console.log('Auth data set:', { userId: userId.value, token: token.value });
  }

  function clearAuthData() {
    userId.value = null;
    token.value = null;
    isVerified.value = false;
    userRoles.value = []; // Очищаем роли
    
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('isVerified'); 
    localStorage.removeItem('userRoles'); // Удаляем из хранилища
  }

  function updateVerifiedStatus(status) {
      isVerified.value = status;
      localStorage.setItem('isVerified', JSON.stringify(status));
  }

  async function checkVerificationStatus() {
      // Проверяем, есть ли токен и ID пользователя
      if (!token.value || !userId.value) return; 

        try {
            // ВАЖНО: Добавляем params с userId
            const response = await axios.get(PROFILE_BASE_URL, { 
                headers: { 'Authorization': `Bearer ${token.value}` },
                params: { userId: userId.value } 
            });
          
          const data = response.data;
          
          console.log("Данные профиля с сервера:", data); 

          const newStatus = data.isVerified || false;
          if (newStatus !== isVerified.value) {
              updateVerifiedStatus(newStatus);
          }

          if (data.roles && Array.isArray(data.roles)) {
              userRoles.value = data.roles;
              localStorage.setItem('userRoles', JSON.stringify(data.roles));
              console.log('Роли обновлены:', userRoles.value); 
          }

      } catch (error) {
          console.error("Ошибка проверки профиля:", error);
      }
  }
  return {
    userId,
    token,
    isAuthenticated,
    isVerified, 
    userRoles, 
    isAdmin,   
    setAuthData,
    clearAuthData,
    updateVerifiedStatus, 
    checkVerificationStatus 
  };
}