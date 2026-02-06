import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  Pressable, 
  Image,
  StyleSheet 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { mockEvents } from "@/constants/MockData";

// Design tokens
const COLORS = {
  darkBg: '#0F172A',
  primaryBlue: '#2563EB',
  accentCyan: '#22D3EE',
  white: '#FFFFFF',
  inputGray: '#F1F5F9',
  textMuted: '#64748B',
};

// Filter options based on Figma
const FILTERS = ["Hackathons", "Conferencias"];

/**
 * Home Screen (Casa)
 * Based on Figma: Hero image, filter pills, event cards with dropdown
 */
export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Hackathons");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const navigateToSearch = () => router.push('/search');
  const navigateToNotifications = () => router.push('/notifications');
  const navigateToSettings = () => router.push('/settings');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Hero image section */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800" }}
          style={styles.heroImage}
        />
        
        {/* Header overlay */}
        <View style={styles.headerOverlay}>
          {/* Search bar row */}
          <View style={styles.searchRow}>
            {/* Mascot icon */}
            <Image
              source={require('@/assets/images/devpal-mascot.png')}
              style={styles.mascotIcon}
              resizeMode="contain"
            />
            
            {/* Search input */}
            <Pressable 
              style={styles.searchContainer}
              onPress={navigateToSearch}
            >
              <Text style={styles.searchPlaceholder}>Buscar</Text>
              <Ionicons name="search" size={18} color={COLORS.textMuted} />
            </Pressable>
            
            {/* Icons */}
            <Pressable style={styles.iconButton} onPress={navigateToNotifications}>
              <Ionicons name="person-circle" size={28} color="white" />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={navigateToSettings}>
              <Ionicons name="notifications" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
      
      {/* White content container */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Filter pills */}
        <View style={styles.filtersContainer}>
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
        </View>
        
        {/* Próximos eventos section */}
        <Text style={styles.sectionTitle}>
          Próximos eventos
        </Text>
        
        {/* Event cards - Figma style with dropdown */}
        {mockEvents.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Pressable
              style={styles.eventCardHeader}
              onPress={() => setExpandedEvent(
                expandedEvent === event.id ? null : event.id
              )}
            >
              <View style={styles.eventCardLeft}>
                {/* Event icon */}
                <View style={styles.eventIconContainer}>
                  <Image
                    source={require('@/assets/images/devpal-mascot.png')}
                    style={styles.eventIcon}
                    resizeMode="contain"
                  />
                </View>
                {/* Event title */}
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {event.title}
                </Text>
              </View>
              
              {/* More info button */}
              <Pressable style={styles.moreInfoButton}>
                <Text style={styles.moreInfoText}>Más información</Text>
                <Ionicons 
                  name={expandedEvent === event.id ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color={COLORS.textMuted} 
                />
              </Pressable>
            </Pressable>
            
            {/* Expanded content */}
            {expandedEvent === event.id && (
              <View style={styles.eventExpanded}>
                <View style={styles.eventDetail}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.primaryBlue} />
                  <Text style={styles.eventDetailText}>{event.date}</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Ionicons name="time-outline" size={16} color={COLORS.primaryBlue} />
                  <Text style={styles.eventDetailText}>{event.time}</Text>
                </View>
                <View style={styles.eventDetail}>
                  <Ionicons name="location-outline" size={16} color={COLORS.primaryBlue} />
                  <Text style={styles.eventDetailText}>{event.location}</Text>
                </View>
                <Pressable 
                  style={styles.viewButton}
                  onPress={() => router.push(`/event/${event.id}`)}
                >
                  <Text style={styles.viewButtonText}>Ver evento</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      
      {/* Floating P button */}
      <Pressable style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>P</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  heroSection: {
    height: 220,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  searchPlaceholder: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  iconButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  filterPill: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primaryBlue,
  },
  filterPillActive: {
    backgroundColor: COLORS.primaryBlue,
  },
  filterText: {
    fontWeight: '600',
    color: COLORS.primaryBlue,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  sectionTitle: {
    color: COLORS.darkBg,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  eventCard: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  eventCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventIconContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 6,
    marginRight: 12,
  },
  eventIcon: {
    width: 24,
    height: 24,
  },
  eventTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  moreInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  moreInfoText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  eventExpanded: {
    backgroundColor: COLORS.white,
    padding: 16,
    gap: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eventDetailText: {
    color: COLORS.darkBg,
    fontSize: 14,
  },
  viewButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  viewButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    left: 24,
    backgroundColor: COLORS.primaryBlue,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
});
