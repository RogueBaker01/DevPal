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
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

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
 * Login Screen - Fixed bigger logos
 */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    router.replace('/(tabs)');
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
            Bienvenido de regreso!
          </Text>
          
          {/* Form inputs */}
          <View style={styles.inputsContainer}>
            <TextInput
              placeholder="Correo"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
          </View>
          
          {/* Remember me + Forgot password row */}
          <View style={styles.optionsRow}>
            <Pressable 
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.rememberContainer}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <Text style={styles.rememberText}>Recuerdame</Text>
            </Pressable>
            
            <Pressable>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Pressable>
          </View>
          
          {/* Login button */}
          <Pressable 
            onPress={handleLogin}
            style={styles.loginButton}
          >
            <Text style={styles.loginButtonText}>
              Iniciar sesión
            </Text>
          </Pressable>
          
          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Iniciar sesión con</Text>
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
          
          {/* Register link */}
          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerLinkText}>
              ¿No estas registrado?{' '}
            </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerLinkBold}>
                Registrarme
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
    height: 320,
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
    top: 100,
    right: 40,
  },
  mascot: {
    width: 220,
    height: 220,
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
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primaryBlue,
    textAlign: 'center',
    marginBottom: 32,
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
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primaryBlue,
    borderColor: COLORS.primaryBlue,
  },
  rememberText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  forgotText: {
    color: COLORS.primaryBlue,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: COLORS.primaryBlue,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
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
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerLinkText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  registerLinkBold: {
    color: COLORS.primaryBlue,
    fontWeight: '700',
    fontSize: 14,
  },
});
