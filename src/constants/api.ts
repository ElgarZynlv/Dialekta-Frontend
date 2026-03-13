// Backend URL - uses localhost for iOS simulator
// For physical device, replace with your computer's local IP (e.g., http://192.168.1.x:3001)
export const API_BASE_URL = 'http://127.0.0.1:3001';

export const ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  philosophers: `${API_BASE_URL}/philosophers`,
  chat: `${API_BASE_URL}/chat`,
};
