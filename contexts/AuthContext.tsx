import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { AuthStorage } from '@/utils/AuthStorage';
import { useRouter, useSegments } from 'expo-router';
import api from '@/services/api';
import { ENDPOINTS } from '@/constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'onboarding_completed';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    userId: string | null;
    needsOnboarding: boolean;
    signIn: (userData: any, rememberMe?: boolean, isNewUser?: boolean) => Promise<void>;
    signOut: () => Promise<void>;
    checkAuth: () => Promise<void>;
    completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const isLoggingOutRef = useRef(false);
    const router = useRouter();
    const segments = useSegments();

    const checkAuth = useCallback(async () => {
        // Evitar checkAuth durante el logout
        if (isLoggingOutRef.current) {
            console.log('Skipping auth check - logout in progress');
            return;
        }
        
        console.log('checkAuth RUNNING...');
        
        try {
            const hasSession = await AuthStorage.hasActiveSession();
            const storedUserId = await AuthStorage.getUserId();
            
            console.log('Auth check result:', { hasSession, storedUserId, isLoggingOut: isLoggingOutRef.current });
            
            // Verificar de nuevo por si acaso se inició logout durante las llamadas async
            if (isLoggingOutRef.current) {
                console.log('Logout started during check, aborting');
                return;
            }
            
            if (hasSession && storedUserId) {
                // Validar que el usuario exista en el backend
                try {
                    await api.get(ENDPOINTS.AUTH.ME(storedUserId));
                    console.log('User validated in backend');
                    setIsAuthenticated(true);
                    setUserId(storedUserId);
                    
                    // Verificar si completó onboarding
                    const onboardingCompleted = await AsyncStorage.getItem(`${ONBOARDING_KEY}_${storedUserId}`);
                    setNeedsOnboarding(onboardingCompleted !== 'true');
                    console.log('Onboarding status:', onboardingCompleted !== 'true' ? 'needed' : 'completed');
                } catch (error: any) {
                    if (error.response?.status === 404) {
                        // Usuario no existe en backend, limpiar sesión local
                        console.log('User not found in backend, clearing session');
                        await AuthStorage.clearSession();
                        setIsAuthenticated(false);
                        setUserId(null);
                    } else {
                        // Otro error (network, etc) - mantener sesión local
                        console.log('Could not validate user, keeping local session');
                        setIsAuthenticated(true);
                        setUserId(storedUserId);
                        
                        const onboardingCompleted = await AsyncStorage.getItem(`${ONBOARDING_KEY}_${storedUserId}`);
                        setNeedsOnboarding(onboardingCompleted !== 'true');
                    }
                }
            } else {
                setIsAuthenticated(false);
                setUserId(null);
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            setIsAuthenticated(false);
            setUserId(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Verificar auth al inicio
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Navegación reactiva basada en estado de autenticación
    useEffect(() => {
        const handleNavigation = async () => {
            console.log('Navigation effect:', { 
                isLoading, 
                isLoggingOut: isLoggingOutRef.current, 
                isAuthenticated, 
                needsOnboarding,
                segments: segments.join('/') 
            });
            
            // No navegar durante logout o mientras carga
            if (isLoading || isLoggingOutRef.current) {
                console.log('Skipping navigation - loading or logging out');
                return;
            }

            const inAuthGroup = segments[0] === '(auth)';
            const inOnboardingGroup = segments[0] === '(onboarding)';

            if (isAuthenticated && needsOnboarding && !inOnboardingGroup) {
                // Usuario autenticado que necesita onboarding -> ir a onboarding
                console.log('Needs onboarding, navigating to interests');
                router.replace('/(onboarding)/interests');
            } else if (isAuthenticated && !needsOnboarding && (inAuthGroup || inOnboardingGroup)) {
                // Doble verificación: confirmar que realmente hay sesión en storage
                const reallyHasSession = await AuthStorage.hasActiveSession();
                if (!reallyHasSession) {
                    console.log('State says authenticated but no session in storage! Correcting...');
                    setIsAuthenticated(false);
                    setUserId(null);
                    return;
                }
                console.log('NAVIGATING TO TABS - isAuthenticated:', isAuthenticated);
                router.replace('/(tabs)');
            } else if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
                // Usuario no autenticado y no en auth/onboarding -> ir a welcome
                console.log('Not authenticated, navigating to auth');
                router.replace('/(auth)/welcome');
            } else {
                console.log('No navigation needed');
            }
        };
        
        handleNavigation();
    }, [isAuthenticated, isLoading, needsOnboarding, segments]);

    const signIn = async (userData: any, rememberMe: boolean = true, isNewUser: boolean = false) => {
        await AuthStorage.saveSession(userData, rememberMe);
        setIsAuthenticated(true);
        setUserId(userData.user_id);
        
        // Si es usuario nuevo, necesita onboarding
        if (isNewUser) {
            setNeedsOnboarding(true);
        } else {
            // Verificar si ya completó onboarding
            const onboardingCompleted = await AsyncStorage.getItem(`${ONBOARDING_KEY}_${userData.user_id}`);
            setNeedsOnboarding(onboardingCompleted !== 'true');
        }
    };

    const completeOnboarding = async () => {
        if (userId) {
            await AsyncStorage.setItem(`${ONBOARDING_KEY}_${userId}`, 'true');
            setNeedsOnboarding(false);
            console.log('Onboarding completed');
        }
    };

    const signOut = async () => {
        console.log('Signing out...');
        
        // Bloquear checkAuth y navegación durante el logout
        isLoggingOutRef.current = true;
        
        try {
            // PRIMERO limpiar storage antes de cambiar estados
            await AuthStorage.clearSession();
            console.log('Session cleared from storage');
            
            // Verificar que realmente se limpió
            const stillHasSession = await AuthStorage.hasActiveSession();
            console.log('Session after clear:', stillHasSession ? 'STILL EXISTS!' : 'cleared');
        } catch (error) {
            console.error('Error clearing session:', error);
        }
        
        // DESPUÉS actualizar estados
        setIsAuthenticated(false);
        setUserId(null);
        setNeedsOnboarding(false);
        
        console.log('State updated, navigating to welcome...');
        
        // Navegar explícitamente
        router.replace('/(auth)/welcome');
        
        // Mantener el bloqueo por más tiempo para evitar re-verificación
        setTimeout(() => {
            isLoggingOutRef.current = false;
            console.log('Logout lock released');
        }, 2000);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            isLoading,
            userId,
            needsOnboarding,
            signIn,
            signOut,
            checkAuth,
            completeOnboarding,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
