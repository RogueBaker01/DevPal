import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { EventsService } from "@/services/eventsService";
import { BentoCard } from "@/components/BentoCard";
import { ExpandableEventCard } from "@/components/ExpandableEventCard"; // Needs update? We'll see.
import { ActiveHeader } from "@/app/components/ActiveHeader";
import { COLORS as OLD_COLORS, RADIUS, SPACING, TYPOGRAPHY, SHADOWS } from "@/constants/designTokens";

// New Glass Tokens (matching Profile)
const GLASS = {
  bg: 'rgba(30, 41, 59, 0.7)',
  border: 'rgba(255, 255, 255, 0.1)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  accent: '#22D3EE', // Cian
  inputBg: 'rgba(15, 23, 42, 0.6)',
};

// Filter options
const FILTERS = ["Hackathons", "Conferencias", "Talleres", "Todos"];

export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Hackathons");
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  // Backend data state
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const loadEvents = async () => {
    try {
      setLoading(true);

      const categoryMap: Record<string, string | undefined> = {
        "Hackathons": "Hackathon",
        "Conferencias": "Conferencia",
        "Talleres": "Taller",
        "Todos": undefined
      };

      const category = categoryMap[activeFilter];
      const data = await EventsService.getAll(category, 50);
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      // We fetch profile to get unread notifications count
      // In a real app, we might use a context or global store
      const { AuthService } = require('@/services/authService');
      const profile = await AuthService.getProfile();
      if (profile && profile.unread_notifications_count !== undefined) {
        setUnreadNotifications(profile.unread_notifications_count);
      }
    } catch (error) {
      console.log("Error fetching profile for notifications:", error);
    }
  };

  useEffect(() => {
    loadEvents();
    loadUserProfile();
  }, [activeFilter]);

  const navigateToSearch = () => router.push('/search');
  const navigateToNotifications = () => router.push('/notifications');
  const navigateToSettings = () => {
    setShowAccountMenu(false);
    router.push('/settings' as any);
  };
  const handleLogout = () => {
    setShowAccountMenu(false);
    router.replace('/(auth)/welcome');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Decorative Background */}
      <View style={styles.bgGradient} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Header */}
      <ActiveHeader
        unreadNotifications={unreadNotifications}
        onAccountPress={() => setShowAccountMenu(true)}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section - Prominent Bento Card */}
        <View style={styles.heroSection}>
          <Text style={styles.greetingText}>¡Hola, Dev!</Text>
          <Text style={styles.subGreeting}>¿Qué vas a construir hoy?</Text>
        </View>

        {/* Bento Grid - Quick Actions */}
        <View style={styles.bentoGrid}>
          <Pressable
            style={styles.dailyChallengeCard}
            onPress={() => router.push('/challenges')}
          >
            <View style={styles.challengeInfo}>
              <View style={styles.challengeIconBg}>
                <Ionicons name="trophy" size={24} color="#F59E0B" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Desafío Diario</Text>
                <Text style={styles.cardSubtitle}>Gana +50 XP hoy</Text>
              </View>
            </View>
            <View style={styles.arrowBg}>
              <Ionicons name="arrow-forward" size={20} color={GLASS.textPrimary} />
            </View>
          </Pressable>
        </View>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterPill,
                activeFilter === filter && styles.filterPillActive
              ]}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Events section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos eventos</Text>
          <Pressable onPress={() => router.push('/search')}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={GLASS.accent} />
            <Text style={styles.loadingText}>Cargando eventos...</Text>
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-clear-outline" size={48} color={GLASS.textSecondary} />
            <Text style={styles.emptyText}>
              No hay eventos disponibles en esta categoría.
            </Text>
          </View>
        ) : (
          events.map((event) => (
            // We might need to update ExpandableEventCard to accept dark mode props or style it internally
            // For now, let's wrap it in a View that might provide context or just use standard View for now
            <View key={event.id} style={{ marginBottom: 16 }}>
              {/* Custom Dark Card implementation for now to ensure look */}
              <Pressable
                style={styles.eventCard}
                onPress={() => router.push(`/event/${event.id}`)}
              >
                <Image
                  source={{ uri: event.imagen_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800" }}
                  style={styles.eventImage}
                  onError={(e) => {
                    // Fallback using state or direct manipulation is hard in map
                    // simpler approach: event.imagen_url is assumed valid by backend now
                    // but we can try to force a default if it fails (requires component state)
                    // For now, let's rely on backend fix + default source
                  }}
                  defaultSource={{ uri: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" }}
                />
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventCategory}>{event.categoria}</Text>
                    <Text style={styles.eventDate}>{new Date(event.fecha).toLocaleDateString()}</Text>
                  </View>
                  <Text style={styles.eventTitle}>{event.titulo}</Text>
                  <View style={styles.eventFooter}>
                    <View style={styles.locationRow}>
                      <Ionicons name="location-outline" size={14} color={GLASS.textSecondary} />
                      <Text style={styles.locationText} numberOfLines={1}>{event.ubicacion}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>

      {/* Account Dropdown Modal */}
      <Modal
        visible={showAccountMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAccountMenu(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAccountMenu(false)}
        >
          <BlurView intensity={50} tint="dark" style={styles.accountDropdown}>
            <Pressable style={styles.dropdownItem} onPress={navigateToSettings}>
              <Ionicons name="settings-outline" size={20} color={GLASS.textPrimary} />
              <Text style={styles.dropdownItemText}>Configuración</Text>
            </Pressable>
            <View style={styles.dropdownDivider} />
            <Pressable style={styles.dropdownItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={[styles.dropdownItemText, { color: '#EF4444' }]}>
                Cerrar sesión
              </Text>
            </Pressable>
          </BlurView>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  // BACKGROUND
  bgGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
  },
  bgCircle1: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#2563EB',
    opacity: 0.1,
    top: -100,
    right: -100,
  },
  bgCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#22D3EE',
    opacity: 0.08,
    bottom: 200,
    left: -100,
  },
  // HEADER
  headerGlass: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: GLASS.border,
  },
  headerContent: {},
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mascotIcon: {
    width: 40,
    height: 40,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: GLASS.border,
    gap: 10,
  },
  searchText: {
    color: GLASS.textSecondary,
    fontSize: 14,
  },
  iconButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: GLASS.border,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120, // Tab bar space
  },
  heroSection: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: GLASS.textPrimary,
  },
  subGreeting: {
    fontSize: 16,
    color: GLASS.textSecondary,
    marginTop: 4,
  },
  // BENTO GRID
  bentoGrid: {
    marginBottom: 24,
  },
  dailyChallengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)', // Gold/Amber hint
  },
  challengeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  challengeIconBg: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    color: GLASS.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardSubtitle: {
    color: '#F59E0B', // Amber
    fontSize: 14,
    fontWeight: '600',
  },
  arrowBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // FILTERS
  filtersContainer: {
    gap: 12,
    marginBottom: 24,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: GLASS.border,
  },
  filterPillActive: {
    backgroundColor: 'rgba(34, 211, 238, 0.15)',
    borderColor: GLASS.accent,
  },
  filterText: {
    color: GLASS.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: GLASS.accent,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: GLASS.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: GLASS.accent,
    fontSize: 14,
  },
  // EVENT CARD (Custom Dark)
  eventCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS.border,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  eventCategory: {
    color: GLASS.accent,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  eventDate: {
    color: GLASS.textSecondary,
    fontSize: 12,
  },
  eventTitle: {
    color: GLASS.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    color: GLASS.textSecondary,
    fontSize: 13,
  },
  // LOADING / EMPTY
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
    gap: 16,
  },
  loadingText: {
    color: GLASS.textSecondary,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: GLASS.border,
  },
  emptyText: {
    color: GLASS.textSecondary,
    textAlign: 'center',
  },
  // MODAL
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 80,
    paddingRight: 20,
  },
  accountDropdown: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 16,
    padding: 8,
    minWidth: 180,
    borderWidth: 1,
    borderColor: GLASS.border,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  dropdownItemText: {
    fontSize: 14,
    color: GLASS.textPrimary,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: GLASS.border,
    marginVertical: 4,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#0F172A',
  },
});
