import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, ActivityIndicator, Linking, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { EventsService } from '@/services/eventsService';

// Design tokens
const COLORS = {
  darkBg: '#0F172A',
  primaryBlue: '#2563EB',
  accentCyan: '#22D3EE',
  white: '#FFFFFF',
  inputGray: '#F1F5F9',
  textMuted: '#64748B',
};

export default function EventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isSaved, setIsSaved] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadEventDetails();
      checkSavedStatus();
    }
  }, [id]);

  const checkSavedStatus = async () => {
    try {
      // Basic check: get all saved events and find this one
      // Optimization: create specific endpoint later
      const savedEvents = await EventsService.getSaved();
      const isSavedEvent = savedEvents.some((e: any) => e.id === id);
      setIsSaved(isSavedEvent);
    } catch (error) {
      console.log('Error checking saved status', error);
    }
  };

  const loadEventDetails = async () => {
    try {
      setLoading(true);
      const data = await EventsService.getDetail(id);
      setEvent(data);
    } catch (error) {
      console.error('Error loading event details:', error);
      Alert.alert('Error', 'No se pudo cargar la información del evento.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await EventsService.unsave(event.id);
        setIsSaved(false);
        // Alert.alert('Eliminado', 'Evento eliminado de favoritos');
      } else {
        await EventsService.save(event.id);
        setIsSaved(true);
        Alert.alert('Guardado', 'Evento agregado a favoritos');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      Alert.alert('Error', 'No se pudo actualizar favoritos');
    }
  };

  const handleOpenURL = () => {
    if (event?.url_externa) {
      Linking.openURL(event.url_externa).catch(err =>
        Alert.alert('Error', 'No se pudo abrir el enlace.')
      );
    } else {
      Alert.alert('Aviso', 'Este evento no tiene un sitio web oficial registrado.');
    }
  };

  const handleShare = async () => {
    Alert.alert('Compartir', 'Funcionalidad de compartir próximamente.');
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primaryBlue} />
      </View>
    );
  }

  if (!event) return null;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Hero image with overlay header */}
      <View style={styles.heroContainer}>
        <Image
          source={event.imagen_url ? { uri: event.imagen_url } : { uri: `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800` }}
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
            onPress={toggleSave}
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
            <Text style={styles.badgeText}>{event.categoria}</Text>
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
          Detalles del Evento
        </Text>

        {/* Event card */}
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>
            {event.titulo}
          </Text>

          <View style={styles.eventMeta}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primaryBlue} />
            <Text style={styles.eventMetaText}>
              {event.fecha}
            </Text>
          </View>

          <View style={styles.eventMeta}>
            <Ionicons name="time-outline" size={18} color={COLORS.primaryBlue} />
            <Text style={styles.eventMetaText}>
              {event.hora}
            </Text>
          </View>

          <View style={styles.eventMeta}>
            <Ionicons name="location-outline" size={18} color={COLORS.primaryBlue} />
            <Text style={styles.eventMetaText}>
              {event.ubicacion || 'Ubicación por confirmar'}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>
            Descripción
          </Text>
          <Text style={styles.descriptionText}>
            {event.descripcion || 'Sin descripción disponible.'}
          </Text>
        </View>

        {/* Map preview - Sólo si tiene coordenadas y no es Online */}
        {event.latitud && event.longitud &&
          parseFloat(event.latitud) !== 0 && parseFloat(event.longitud) !== 0 &&
          event.ubicacion?.toLowerCase() !== 'online' && (
            <Pressable
              style={styles.mapCard}
              onPress={() => router.push({ pathname: '/(tabs)/map', params: { id: event.id } })}
            >
              <View style={styles.mapPreview}>
                <Ionicons name="map" size={32} color={COLORS.primaryBlue} />
                <Text style={styles.mapText}>Ver ubicación en mapa</Text>
              </View>
            </Pressable>
          )}
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.secondaryButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color={COLORS.primaryBlue} />
          <Text style={styles.secondaryButtonText}>Compartir</Text>
        </Pressable>

        <Pressable
          style={[styles.primaryButton, !event.url_externa && { backgroundColor: COLORS.textMuted }]}
          onPress={handleOpenURL}
        >
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
