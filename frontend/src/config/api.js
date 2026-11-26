/**
 * API Configuration
 * Configure different API endpoints based on environment
 */

const API_CONFIG = {
  // Local development
  local: {
    baseURL: 'http://localhost:5001/api',
    timeout: 10000,
  },
  // iOS Simulator (uses host machine IP)
  iosSimulator: {
    baseURL: 'http://10.0.2.2:5001/api', // Android emulator default
    timeout: 10000,
  },
  // Railway Production
  railway: {
    baseURL: 'https://chandacollectionapp-production.up.railway.app/api',
    timeout: 15000,
  },
  // Add your actual Railway backend URL here
  // Get it from: Railway dashboard → Your service → Settings → Public URL
  railwayProduction: {
    baseURL: 'https://your-railway-backend-url.railway.app/api',
    timeout: 15000,
  },
};

/**
 * Get API config based on environment
 * Update the ENVIRONMENT variable below to switch between local/railway
 */
const ENVIRONMENT = __DEV__ ? 'local' : 'railwayProduction';

// For testing with Railway from iOS simulator
// const ENVIRONMENT = 'railwayProduction';

export const API_BASE_URL = API_CONFIG[ENVIRONMENT]?.baseURL || API_CONFIG.local.baseURL;
export const API_TIMEOUT = API_CONFIG[ENVIRONMENT]?.timeout || 10000;

export default API_CONFIG;
