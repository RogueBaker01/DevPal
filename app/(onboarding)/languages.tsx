import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Design tokens
const COLORS = {
  darkBg: '#0F172A',
  primaryBlue: '#2563EB',
  accentCyan: '#22D3EE',
  white: '#FFFFFF',
  textMuted: '#64748B',
};

// Programming languages based on Figma
const LANGUAGES = [
  { id: 'javascript', title: 'JavaScript', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', bgColor: '#F7DF1E' },
  { id: 'python', title: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', bgColor: '#3776AB' },
  { id: 'java', title: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', bgColor: '#ED8B00' },
  { id: 'cpp', title: 'C / C++', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', bgColor: '#00599C' },
];

/**
 * Languages Selection Screen (Filtro - lenguajes)
 * Based on Figma: Logo cards in 2x2 grid
 */
export default function LanguagesScreen() {
  const router = useRouter();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [customLanguage, setCustomLanguage] = useState('');

  const toggleLanguage = (id: string) => {
    setSelectedLanguages(prev => 
      prev.includes(id) 
        ? prev.filter(l => l !== id)
        : [...prev, id]
    );
  };

  const handleComplete = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Blue header */}
      <View style={styles.header}>
        {/* Search bar row */}
        <View style={styles.searchRow}>
          <Image
            source={require('@/assets/images/devpal-mascot.png')}
            style={styles.mascotIcon}
            resizeMode="contain"
          />
          
          <View style={styles.searchContainer}>
            <Text style={styles.searchText}>Buscar</Text>
            <Ionicons name="search" size={18} color={COLORS.textMuted} />
          </View>
          
          <Pressable style={styles.iconButton}>
            <Ionicons name="person-circle" size={28} color="white" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color="white" />
          </Pressable>
        </View>
        
        <Text style={styles.headerTitle}>
          ¿Cuáles son tus lenguajes de interés?
        </Text>
      </View>
      
      {/* Cards section */}
      <View style={styles.cardsSection}>
        {/* Grid of logo cards */}
        <View style={styles.grid}>
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguages.includes(lang.id);
            return (
              <Pressable
                key={lang.id}
                onPress={() => toggleLanguage(lang.id)}
                style={[
                  styles.card,
                  { backgroundColor: COLORS.white },
                  isSelected && styles.cardSelected
                ]}
              >
                {/* Language logo */}
                <View style={styles.logoContainer}>
                  {lang.id === 'javascript' && (
                    <View style={[styles.jsLogo, { backgroundColor: '#F7DF1E' }]}>
                      <Text style={styles.jsText}>JS</Text>
                    </View>
                  )}
                  {lang.id === 'python' && (
                    <Image
                      source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1200px-Python-logo-notext.svg.png' }}
                      style={styles.langLogo}
                      resizeMode="contain"
                    />
                  )}
                  {lang.id === 'java' && (
                    <Image
                      source={{ uri: 'https://www.vectorlogo.zone/logos/java/java-icon.svg' }}
                      style={styles.langLogo}
                      resizeMode="contain"
                    />
                  )}
                  {lang.id === 'cpp' && (
                    <View style={styles.cppLogo}>
                      <Text style={styles.cppText}>C++</Text>
                    </View>
                  )}
                </View>
                
                <Text style={styles.cardTitle}>{lang.title}</Text>
                
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={14} color="white" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
        
        {/* Custom input */}
        <View style={styles.customInputContainer}>
          <TextInput
            placeholder="Otra(escribe aquí tus intereses)"
            placeholderTextColor={COLORS.textMuted}
            value={customLanguage}
            onChangeText={setCustomLanguage}
            style={styles.customInput}
          />
        </View>
        
        {/* Next button */}
        <Pressable 
          onPress={handleComplete}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>
            Selecciona todas los de tu interés
          </Text>
        </Pressable>
        
        {/* Event preview */}
        <View style={styles.eventPreview}>
          <View style={styles.eventPreviewContent}>
            <View style={styles.eventIconContainer}>
              <Image
                source={require('@/assets/images/devpal-mascot.png')}
                style={styles.eventIcon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.eventPreviewTitle}>Hackathon BLOQUE</Text>
          </View>
          <Pressable style={styles.moreInfoButton}>
            <Text style={styles.moreInfoText}>Más información</Text>
            <Ionicons name="chevron-down" size={14} color={COLORS.textMuted} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlue,
  },
  header: {
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  mascotIcon: {
    width: 36,
    height: 36,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  iconButton: {
    padding: 4,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: COLORS.accentCyan,
  },
  logoContainer: {
    marginBottom: 8,
  },
  jsLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  jsText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '900',
  },
  langLogo: {
    width: 50,
    height: 50,
  },
  cppLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#00599C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cppText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cardTitle: {
    color: COLORS.darkBg,
    fontSize: 14,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.accentCyan,
    borderRadius: 10,
    padding: 3,
  },
  customInputContainer: {
    marginTop: 16,
  },
  customInput: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.darkBg,
  },
  nextButton: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  nextButtonText: {
    color: COLORS.primaryBlue,
    fontSize: 14,
    fontWeight: '600',
  },
  eventPreview: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  eventPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIconContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 4,
    marginRight: 10,
  },
  eventIcon: {
    width: 20,
    height: 20,
  },
  eventPreviewTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  moreInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  moreInfoText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
