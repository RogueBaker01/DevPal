import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/Config';

// Crear instancia de axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 segundos timeout para operaciones de IA lentas
});

// Interceptor para agregar token (si existiera en el futuro)
api.interceptors.request.use(
    async (config) => {
        // Aunque ahora no usamos JWT, es buena práctica dejar esto preparado
        // const token = await AsyncStorage.getItem('userToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejo de errores global
api.interceptors.response.use(
    (response) => {
        // Log exitoso para debugging (solo en desarrollo)
        if (__DEV__) {
            console.log('API Response:', response.config.method?.toUpperCase(), response.config.url);
        }
        return response;
    },
    (error) => {
        // Manejo de errores comunes
        if (error.response) {
            // El servidor respondió con un status code fuera del rango 2xx
            console.error('API Error:', {
                status: error.response.status,
                url: error.config?.url,
                data: error.response.data
            });

            // Errores específicos
            if (error.response.status === 401) {
                console.error('No autorizado - Verifica tus credenciales');
            } else if (error.response.status === 404) {
                console.error('Endpoint no encontrado - Verifica la URL');
            } else if (error.response.status === 500) {
                console.error('Error del servidor - Revisa los logs del backend');
            } else if (error.response.status === 503) {
                console.error('Servicio no disponible - ¿Está corriendo el backend?');
            }
        } else if (error.request) {
            // La petición fue hecha pero no hubo respuesta
            console.error('Network Error - No se pudo conectar al backend');
            console.error('Detalles del error:', {
                message: error.message,
                baseURL: API_URL,
            });
            console.error('');
            console.error('SOLUCIONES POSIBLES:');
            console.error('  1. ¿Está corriendo el backend? (uvicorn app.main:app --reload --host 0.0.0.0)');
            console.error('  2. ¿La IP en Config.ts es correcta?');
            console.error('  3. ¿Tu dispositivo está en la misma red WiFi?');
            console.error('  4. ¿El firewall está bloqueando el puerto 8000?');
            console.error('');

            // Error específico de timeout
            if (error.code === 'ECONNABORTED') {
                console.error('Timeout - El servidor tardó demasiado en responder');
            }
            // Error de conexión rechazada
            if (error.message.includes('Network Error') || error.message.includes('ECONNREFUSED')) {
                console.error('Conexión rechazada - Backend no disponible en:', API_URL);
            }
        } else {
            // Algo pasó al configurar la petición
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
