import { Platform } from 'react-native';

// Configure your local IP via EXPO_PUBLIC_LOCAL_IP environment variable
// Example: EXPO_PUBLIC_LOCAL_IP=192.168.1.100 npx expo start
const LOCAL_IP = process.env.EXPO_PUBLIC_LOCAL_IP || 'localhost';

const DEV_API_URL = Platform.select({
    ios: `http://${LOCAL_IP}:8000`,
    android: `http://${LOCAL_IP}:8000`,
    default: 'http://localhost:8000',
});

const PROD_API_URL = 'https://api.devpal.com/api';

export const BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL.replace('/api', '');
export const API_URL = __DEV__ ? `${DEV_API_URL}/api` : PROD_API_URL;

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: (id: string) => `/auth/me/${id}`,
    },
    NOTICIAS: {
        LIST: '/noticias',
        GENERATE: '/noticias/generar',
    },
    EVENTOS: {
        LIST: '/eventos',
        DETAIL: (id: string) => `/eventos/${id}`,
        GENERATE: '/eventos/generar',
        SAVE: (id: string) => `/eventos/${id}/guardar`,
        SAVED: '/eventos/guardados',
        REGISTER: (id: string) => `/eventos/${id}/registrar`,
    },
    DESAFIOS: {
        TODAY: '/desafios/hoy',
        GENERATE: '/desafios/generar',
        HISTORY: '/desafios/historial',
        COMPLETE: (id: string) => `/desafios/${id}/completar`,
        ABANDON: (id: string) => `/desafios/${id}/abandonar`,
        EXECUTE: (id: string) => `/desafios/${id}/ejecutar`,
    },
    CODE_REVIEW: {
        REVIEW: '/code-review',
        HISTORY: '/code-review/historial',
        HINT: '/code-review/pistas/generar',
    }
};
