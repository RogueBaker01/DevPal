/**
 * Haptic Feedback Utility
 * Wrapper para expo-haptics con fallback seguro
 */

import * as Haptics from 'expo-haptics';

export class HapticManager {
    /**
     * Feedback ligero - Para interacciones menores (hover, selección)
     */
    static light() {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
            console.warn('Haptics not available:', error);
        }
    }

    /**
     * Feedback medio - Para acciones estándar (botones, cambios de estado)
     */
    static medium() {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (error) {
            console.warn('Haptics not available:', error);
        }
    }

    /**
     * Feedback pesado - Para acciones importantes (confirmaciones, errores)
     */
    static heavy() {
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        } catch (error) {
            console.warn('Haptics not available:', error);
        }
    }

    /**
     * Selección - Para cambios en pickers o filtros
     */
    static selection() {
        try {
            Haptics.selectionAsync();
        } catch (error) {
            console.warn('Haptics not available:', error);
        }
    }

    /**
     * Éxito - Feedback positivo
     */
    static success() {
        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.warn('Haptics not available:', error);
        }
    }

    /**
     * Advertencia - Feedback de warning
     */
    static warning() {
        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } catch (error) {
            console.warn('Haptics not available:', error);
        }
    }

    /**
     * Error - Feedback negativo
     */
    static error() {
        try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } catch (error) {
            console.warn('Haptics not available:', error);
        }
    }
}
