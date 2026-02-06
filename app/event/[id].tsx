import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { mockEvents } from '@/constants/MockData';

// Design tokens
const COLORS = {
  darkBg: '#0F172A',
  primaryBlue: '#2563EB',
  accentCyan: '#22D3EE',
  white: '#FFFFFF',
  inputGray: '#F1F5F9',
  textMuted: '#64748B',
};

/**
 * Event Details Screen (Información)
 * Based on Figma: Full event details with image, info, and action buttons
 */
export default function EventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSaved, setIsSaved] = useState(false);

  // Find event by id or use first event
  const event = mockEvents.find(e => e.id === id) || mockEvents[0];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Hero image with overlay header */}
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800` }}
          style={styles.heroImage}
        />
        
        {/* Gradient overlay */}
        <View style={styles.heroOverlay} />
        
        {/* Header buttons */}
        <View style={styles.headerButtons}>
          <Pressable 
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          
          <Pressable 
            onPress={() => setIsSaved(!isSaved)}
            style={styles.headerButton}
          >
            <Ionicons 
              name={isSaved ? "heart" : "heart-outline"} 
              size={24} 
              color={isSaved ? "#EF4444" : "white"} 
            />
          </Pressable>
        </View>
        
        {/* Category badges */}
        <View style={styles.badgesContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Hackathons</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Conferencias</Text>
          </View>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title section */}
        <Text style={styles.title}>
          Próximos eventos
        </Text>
        
        {/* Event card */}
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>
            {event.title}
          </Text>
          
          <View style={styles.eventMeta}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primaryBlue} />
            <Text style={styles.eventMetaText}>
              {event.date}
            </Text>
          </View>
          
          <View style={styles.eventMeta}>
            <Ionicons name="time-outline" size={18} color={COLORS.primaryBlue} />
            <Text style={styles.eventMetaText}>
              {event.time}
            </Text>
          </View>
          
          <View style={styles.eventMeta}>
            <Ionicons name="location-outline" size={18} color={COLORS.primaryBlue} />
            <Text style={styles.eventMetaText}>
              {event.location}
            </Text>
          </View>
        </View>
        
        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>
            Descripción
          </Text>
          <Text style={styles.descriptionText}>
            Únete a este increíble evento donde podrás conectar con otros desarrolladores, 
            aprender nuevas tecnologías y competir por premios increíbles. 
            No te pierdas esta oportunidad única de crecer profesionalmente.
          </Text>
        </View>
        
        {/* Map preview */}
        <View style={styles.mapCard}>
          <View style={styles.mapPreview}>
            <Ionicons name="map" size={32} color={COLORS.primaryBlue} />
            <Text style={styles.mapText}>Ver ubicación</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.secondaryButton}>
          <Ionicons name="share-outline" size={20} color={COLORS.primaryBlue} />
          <Text style={styles.secondaryButtonText}>Compartir</Text>
        </Pressable>
        
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Página Oficial</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  heroContainer: {
    height: 240,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerButtons: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 8,
  },
  badgesContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    color: COLORS.darkBg,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: COLORS.inputGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  eventTitle: {
    color: COLORS.primaryBlue,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventMetaText: {
    color: COLORS.darkBg,
    fontSize: 16,
    marginLeft: 12,
  },
  descriptionCard: {
    backgroundColor: COLORS.inputGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  descriptionTitle: {
    color: COLORS.darkBg,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  descriptionText: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  mapCard: {
    backgroundColor: COLORS.inputGray,
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPreview: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F4E8',
  },
  mapText: {
    color: COLORS.primaryBlue,
    fontWeight: '600',
    marginTop: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primaryBlue,
    borderRadius: 28,
    paddingVertical: 14,
    gap: 8,
  },
  secondaryButtonText: {
    color: COLORS.primaryBlue,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 28,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
