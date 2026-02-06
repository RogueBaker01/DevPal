import React, { useState } from 'react';
import { View, Text, Pressable, Image, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Design tokens
const COLORS = {
  darkBg: '#0F172A',
  primaryBlue: '#2563EB',
  accentCyan: '#22D3EE',
  white: '#FFFFFF',
  inputGray: '#F1F5F9',
  textMuted: '#64748B',
};

// Interest categories with images based on Figma
const INTERESTS = [
  { 
    id: 'hackathons', 
    title: 'Hackathones', 
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400'
  },
  { 
    id: 'conferencias', 
    title: 'Conferencias', 
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
  },
  { 
    id: 'talleres', 
    title: 'Talleres', 
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400'
  },
  { 
    id: 'concursos', 
    title: 'Concursos', 
    image: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=400'
  },
];

/**
 * Interests Selection Screen (Filtro - actividades)
 * Based on Figma: Blue header with search, image cards in 2x2 grid
 */
export default function InterestsScreen() {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleNext = () => {
    router.push('/(onboarding)/languages');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Blue header */}
      <View style={styles.header}>
        {/* Search bar row */}
        <View style={styles.searchRow}>
          {/* Mascot */}
          <Image
            source={require('@/assets/images/devpal-mascot.png')}
            style={styles.mascotIcon}
            resizeMode="contain"
          />
          
          {/* Search */}
          <View style={styles.searchContainer}>
            <Text style={styles.searchText}>Buscar</Text>
            <Ionicons name="search" size={18} color={COLORS.textMuted} />
          </View>
          
          {/* Icons */}
          <Pressable style={styles.iconButton}>
            <Ionicons name="person-circle" size={28} color="white" />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Ionicons name="notifications" size={24} color="white" />
          </Pressable>
        </View>
        
        {/* Title */}
        <Text style={styles.headerTitle}>
          ¿Cuáles son tus actividades de interés?
        </Text>
      </View>
      
      {/* Cards section - Blue background */}
      <View style={styles.cardsSection}>
        {/* Grid of image cards */}
        <View style={styles.grid}>
          {INTERESTS.map((interest) => {
            const isSelected = selectedInterests.includes(interest.id);
            return (
              <Pressable
                key={interest.id}
                onPress={() => toggleInterest(interest.id)}
                style={[
                  styles.card,
                  isSelected && styles.cardSelected
                ]}
              >
                <Image 
                  source={{ uri: interest.image }}
                  style={styles.cardImage}
                />
                <View style={styles.cardOverlay}>
                  <Text style={styles.cardTitle}>{interest.title}</Text>
                </View>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={14} color="white" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
        
        {/* Custom interest input */}
        <View style={styles.customInputContainer}>
          <TextInput
            placeholder="Otra(escribe aquí tus intereses)"
            placeholderTextColor={COLORS.textMuted}
            value={customInterest}
            onChangeText={setCustomInterest}
            style={styles.customInput}
          />
        </View>
        
        {/* Next button */}
        <Pressable 
          onPress={handleNext}
          style={styles.nextButton}
        >
          <Text style={styles.nextButtonText}>
            Selecciona todas las de tu interés
          </Text>
        </Pressable>
        
        {/* Bottom event preview */}
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
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: COLORS.accentCyan,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: 10,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
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
