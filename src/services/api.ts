import axios from "axios";
import { getAuth } from "firebase/auth";


const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach Firebase token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting Firebase token:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const fetchData = async () => {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getItems = async () => {
  try {
    const response = await apiClient.get("/data");
    return response.data;
  } catch (error) {
    console.error("Fetch Items Error:", error);
    throw error;
  }
};

export default apiClient;
