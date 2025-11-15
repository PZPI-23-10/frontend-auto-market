import { ref, computed } from 'vue';
import axios from 'axios'; 

const userId = ref(localStorage.getItem('userId') || null);
const token = ref(localStorage.getItem('token') || null);
const isVerified = ref(JSON.parse(localStorage.getItem('isVerified') || 'false')); 

const PROFILE_BASE_URL = 'https://backend-auto-market.onrender.com/api/Profile';

export function useAuth() {

  const isAuthenticated = computed(() => !!token.value);

  function setAuthData(newUserId, newToken, verifiedStatus = false) { 
    userId.value = newUserId;
    token.value = newToken;
    isVerified.value = verifiedStatus; 
    localStorage.setItem('userId', newUserId);
    localStorage.setItem('token', newToken);
    localStorage.setItem('isVerified', JSON.stringify(verifiedStatus)); 
    console.log('Auth data set:', { userId: userId.value, token: token.value, isVerified: isVerified.value });
  }

  function clearAuthData() {
    userId.value = null;
    token.value = null;
    isVerified.value = false; 
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    localStorage.removeItem('isVerified'); 
  }

  function updateVerifiedStatus(status) {
      isVerified.value = status;
      localStorage.setItem('isVerified', JSON.stringify(status));
  }

  async function checkVerificationStatus() {
      if (!token.value || !userId.value) return; 
        try {
            const response = await axios.get(PROFILE_BASE_URL, { 
                headers: { 'Authorization': `Bearer ${token.value}` }
            });
          const newStatus = response.data.isVerified || false;
          if (newStatus !== isVerified.value) {
              console.log('Verification status updated from server:', newStatus);
              updateVerifiedStatus(newStatus);
          }
      } catch (error) {
          console.error("Failed to check verification status:", error);
          if (error.response?.status === 401) {
              clearAuthData();
          }
      }
  }

  return {
    userId,
    token,
    isAuthenticated,
    isVerified, 
    setAuthData,
    clearAuthData,
    updateVerifiedStatus, 
    checkVerificationStatus 
  };
}
