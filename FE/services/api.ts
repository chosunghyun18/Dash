import axios from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getAccessToken, useAuthStore } from '../stores/authStore';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Version': '1.0.0',
    // 앱 바이너리 버전 게이트용 — 서버가 업데이트 상태(OK/SOFT/FORCE)를 판단
    'X-App-Version': Constants.expoConfig?.version ?? '1.0.0',
    'X-Platform': Platform.OS,
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().signOut();
    }
    return Promise.reject(error);
  }
);
