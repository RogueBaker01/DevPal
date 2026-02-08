import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthService } from '@/services/authService';

const { width } = Dimensions.get('window');

// Design tokens
const COLORS = {
  darkBg: '#0F172A',
  primaryBlue: '#2563EB',
  accentCyan: '#22D3EE',
  white: '#FFFFFF',
  inputGray: '#F8FAFC',
  textMuted: '#64748B',
  borderGray: '#E2E8F0',
};

/**
 * Register Screen - Fixed bigger logos
 */
export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Validar campos vacíos
    if (!formData.nombre.trim() || !formData.apellidos.trim() ||
      !formData.email.trim() || !formData.password.trim() ||
      !formData.confirmPassword.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un correo válido');
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar términos aceptados
    if (!acceptedTerms) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Llamar al servicio de registro
      const response = await AuthService.register(
        formData.nombre.trim(),
        formData.apellidos.trim(),
        formData.email.trim(),
        formData.password
      );

      // Si el registro fue exitoso, navegar al onboarding
      if (response.user_id) {
        router.replace('/(onboarding)/interests');
      } else {
        setError('Error al registrar usuario. Intenta de nuevo.');
      }
    } catch (err: any) {
      console.error('Register error:', err);

      // Manejar errores específicos
      if (err.response?.status === 400) {
        setError('El email ya está registrado');
      } else if (err.response?.status === 500) {
        setError('Error del servidor. Intenta más tarde.');
      } else if (err.message?.includes('Network Error')) {
        setError('No se pudo conectar al servidor. Verifica tu conexión.');
      } else {
        setError('Error al registrarse. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Blue header with bubbles and mascot */}
      <View style={styles.header}>
        {/* Decorative bubbles */}
        <View style={styles.bubble1} />
        <View style={styles.bubble2} />
        <View style={styles.bubble3} />

        {/* Mascot - BIGGER */}
        <Image
          source={require('@/assets/images/devpal-mascot.png')}
          style={styles.mascot}
          resizeMode="contain"
        />
      </View>

      {/* White form container */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContent}
        >
          {/* Title */}
          <Text style={styles.title}>
            Empecemos!
          </Text>

          {/* Form inputs */}
          <View style={styles.inputsContainer}>
            <TextInput
              placeholder="Nombre(s)"
              placeholderTextColor={COLORS.textMuted}
              value={formData.nombre}
              onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              style={styles.input}
            />

            <TextInput
              placeholder="Apellidos"
              placeholderTextColor={COLORS.textMuted}
              value={formData.apellidos}
              onChangeText={(text) => setFormData({ ...formData, apellidos: text })}
              style={styles.input}
            />

            <TextInput
              placeholder="Correo"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              style={styles.input}
            />

            <TextInput
              placeholder="Contraseña"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              style={styles.input}
            />

            <TextInput
              placeholder="Confirmar contraseña"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              style={styles.input}
            />
          </View>

          {/* Terms checkbox */}
          <Pressable
            onPress={() => setAcceptedTerms(!acceptedTerms)}
            style={styles.termsContainer}
          >
            <View style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}>
              {acceptedTerms && <Ionicons name="checkmark" size={12} color="white" />}
            </View>
            <Text style={styles.termsText}>
              Acepto los términos y condiciones de{' '}
              <Text style={styles.termsLink}>DevPal</Text>
            </Text>
          </Pressable>

          {/* Register button */}
          <Pressable
            onPress={handleRegister}
            style={styles.registerButton}
          >
            <Text style={styles.registerButtonText}>
              Registrarme
            </Text>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Registrarme con</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons - BIGGER */}
          <View style={styles.socialContainer}>
            <Pressable style={styles.socialButton}>
              <Text style={styles.googleIcon}>G</Text>
            </Pressable>
            <Pressable style={styles.socialButton}>
              <Ionicons name="logo-apple" size={28} color="#000" />
            </Pressable>
          </View>

          {/* Login link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>
              ¿Ya estas registrado?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.loginLinkBold}>
                Iniciar sesión
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlue,
  },
  header: {
    height: 280,
    backgroundColor: COLORS.primaryBlue,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
    position: 'relative',
    overflow: 'hidden',
  },
  bubble1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(30, 64, 175, 0.5)',
    top: -80,
    left: -80,
  },
  bubble2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(30, 64, 175, 0.4)',
    top: -30,
    right: -50,
  },
  bubble3: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    top: 80,
    right: 40,
  },
  mascot: {
    width: 200,
    height: 200,
    zIndex: 10,
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -30,
  },
  formContent: {
    padding: 32,
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primaryBlue,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputsContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.darkBg,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue,
  },
  termsText: {
    color: COLORS.textMuted,
    fontSize: 14,
    flex: 1,
  },
  termsLink: {
    color: COLORS.primaryBlue,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: COLORS.primaryBlue,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.borderGray,
  },
  dividerText: {
    marginHorizontal: 16,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4285F4',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  loginLinkBold: {
    color: COLORS.primaryBlue,
    fontWeight: '700',
    fontSize: 14,
  },
});
