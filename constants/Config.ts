/**
 * Configuración de la API
 * 
 * IMPORTANTE: Para que el frontend se conecte al backend, necesitas configurar la IP correcta
 * 
 * ========================================
 * CÓMO OBTENER TU IP LOCAL:
 * ========================================
 * 
 * Windows:
 *   1. Abre PowerShell o CMD
 *   2. Ejecuta: ipconfig
 *   3. Busca "IPv4 Address" en tu adaptador WiFi o Ethernet
 *   4. Ejemplo: 192.168.1.100
 * 
 * Mac/Linux:
 *   1. Abre Terminal
 *   2. Ejecuta: ifconfig (Mac) o ip addr (Linux)
 *   3. Busca tu IP en la interfaz activa (generalmente empieza con 192.168.x.x)
 * 
 * ========================================
 * CONFIGURACIÓN POR DISPOSITIVO:
 * ========================================
 * 
 * Android Emulator:
 *   - Usa: '10.0.2.2' (IP especial que apunta al host desde el emulador)
 *   - Esta es la IP mágica de Android Emulator para localhost
 * 
 * iOS Simulator:
 *   - Usa: 'localhost' o tu IP local (ej: '192.168.1.100')
 * 
 * Dispositivo Físico (Android/iOS):
 *   - Usa tu IP LOCAL de la red WiFi (ej: '192.168.1.100')
 *   - IMPORTANTE: El dispositivo DEBE estar en la MISMA red WiFi que tu computadora
 *   - El backend debe estar corriendo con --host 0.0.0.0 (no 127.0.0.1)
 * 
 * ========================================
 */
import { Platform } from 'react-native';

// ⚠️ CONFIGURA ESTO: Pon aquí la IP de tu máquina
// Para obtenerla, sigue las instrucciones de arriba
const LOCAL_IP = '192.168.2.1'; // CAMBIA ESTO por tu IP (usa ipconfig en Windows)

// Para Android Emulator específicamente, puedes descomentar esto:
// const USE_ANDROID_EMULATOR = true;

const DEV_API_URL = Platform.select({
    ios: `http://${LOCAL_IP}:8000`,
    android: `http://${LOCAL_IP}:8000`, // Si usas emulador Android, cambia LOCAL_IP por '10.0.2.2'
    default: 'http://localhost:8000',
});

const PROD_API_URL = 'https://api.devpal.com/api';

// La URL base que se usará (incluye el prefijo /api que es donde están los routers del backend)
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
