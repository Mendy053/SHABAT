import { updateNgrokUrl } from './utils/ngrokDetector';

// Configuration for API endpoints
const API_CONFIG = {
  // Try to get ngrok URL from environment, localStorage, or use localhost
  BASE_URL: updateNgrokUrl() || 'http://localhost:3001',
  
  // API endpoints
  ENDPOINTS: {
    USERS: '/api/users',
    MEAL: '/api/meal',
    MEALS: '/api/meals',
    HEALTH: '/api/health'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to check if we're using ngrok
export const isUsingNgrok = () => {
  const baseUrl = API_CONFIG.BASE_URL;
  return baseUrl.includes('ngrok.io') || baseUrl.includes('ngrok-free.app');
};

// Function to update base URL dynamically
export const updateBaseUrl = (newUrl) => {
  if (newUrl) {
    API_CONFIG.BASE_URL = newUrl;
    localStorage.setItem('ngrokUrl', newUrl);
  }
};

// Export configuration
export default API_CONFIG; 