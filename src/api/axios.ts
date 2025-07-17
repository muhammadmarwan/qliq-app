import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants from 'expo-constants';

const baseURL = Constants.expoConfig?.extra?.BACKEND_URL ?? 'http://192.168.8.8:8000/api';

const API = axios.create({
  baseURL,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
