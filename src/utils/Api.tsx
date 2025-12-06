import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URLS from "../config/API_URLS";
import { Alert } from "react-native";

// Axios Instance
const Api = axios.create({
  baseURL: API_URLS.BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// TOKEN INTERCEPTOR (React Native Safe Storage)
Api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("patientToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// NETWORK ERROR HANDLER
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network/Server error:", error);
      Alert.alert(
        "Network Error",
        "Unable to connect to the server. Please check your internet connection and try again."
      );
      return;
    }

    return Promise.reject(error);
  }
);

export default Api;
