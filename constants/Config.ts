import { Platform } from 'react-native';

const AZURE_BACKEND_URL = 'https://devpalbackend-f9ftf7epesfhacer.mexicocentral-01.azurewebsites.net';

const DEV_API_URL = AZURE_BACKEND_URL;

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
