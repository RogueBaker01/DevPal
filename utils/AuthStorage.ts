import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AuthStorage - Manejo seguro de sesión de usuario
 * Usa SecureStore para datos sensibles y AsyncStorage para metadatos
 */

const KEYS = {
    USER_ID: 'user_id',
    USER_EMAIL: 'user_email',
    USER_INFO: 'user_info',
    REMEMBER_ME: 'remember_me',
};

export const AuthStorage = {
    /**
     * Guardar sesión completa del usuario
     */
    saveSession: async (userData: any, rememberMe: boolean = true) => {
        try {
            // Guardar userId de forma segura
            await SecureStore.setItemAsync(KEYS.USER_ID, userData.user_id);

            // Guardar email si "Recuérdame" está activo
            if (rememberMe && userData.email) {
                await SecureStore.setItemAsync(KEYS.USER_EMAIL, userData.email);
            }

            // Guardar información completa del usuario
            await AsyncStorage.setItem(KEYS.USER_INFO, JSON.stringify(userData));

            // Guardar preferencia de "Recuérdame"
            await AsyncStorage.setItem(KEYS.REMEMBER_ME, rememberMe.toString());

            console.log('✅ Sesión guardada exitosamente');
        } catch (error) {
            console.error('Error saving session:', error);
            throw error;
        }
    },

    /**
     * Obtener userId guardado
     */
    getUserId: async (): Promise<string | null> => {
        try {
            return await SecureStore.getItemAsync(KEYS.USER_ID);
        } catch (error) {
            console.error('Error getting userId:', error);
            return null;
        }
    },

    /**
     * Obtener email guardado (si existe)
     */
    getUserEmail: async (): Promise<string | null> => {
        try {
            return await SecureStore.getItemAsync(KEYS.USER_EMAIL);
        } catch (error) {
            console.error('Error getting email:', error);
            return null;
        }
    },

    /**
     * Obtener información completa del usuario
     */
    getUserInfo: async () => {
        try {
            const userInfoStr = await AsyncStorage.getItem(KEYS.USER_INFO);
            return userInfoStr ? JSON.parse(userInfoStr) : null;
        } catch (error) {
            console.error('Error getting user info:', error);
            return null;
        }
    },

    /**
     * Verificar si hay sesión activa
     */
    hasActiveSession: async (): Promise<boolean> => {
        try {
            const userId = await AuthStorage.getUserId();
            return userId !== null;
        } catch (error) {
            return false;
        }
    },

    /**
     * Verificar si "Recuérdame" está activo
     */
    shouldRemember: async (): Promise<boolean> => {
        try {
            const remember = await AsyncStorage.getItem(KEYS.REMEMBER_ME);
            return remember === 'true';
        } catch (error) {
            return false;
        }
    },

    /**
     * Cerrar sesión (eliminar todos los datos)
     */
    clearSession: async () => {
        try {
            // Eliminar datos seguros
            await SecureStore.deleteItemAsync(KEYS.USER_ID);
            await SecureStore.deleteItemAsync(KEYS.USER_EMAIL);

            // Eliminar datos de AsyncStorage
            await AsyncStorage.removeItem(KEYS.USER_INFO);
            await AsyncStorage.removeItem(KEYS.REMEMBER_ME);

            console.log('✅ Sesión cerrada exitosamente');
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    },
};
