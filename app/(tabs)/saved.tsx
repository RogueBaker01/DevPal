import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Design tokens
const COLORS = {
  darkBg: '#0F172A',
  primaryBlue: '#2563EB',
  accentCyan: '#22D3EE',
  white: '#FFFFFF',
  inputGray: '#F1F5F9',
  textMuted: '#64748B',
};

// Saved events
const SAVED_EVENTS = [
  { id: '1', title: 'Hackathon Nacional 2024', date: '10 Feb', location: 'Centro de Convenciones' },
  { id: '2', title: 'Conferencia DevOps México', date: '2 Feb', location: 'Auditorio Principal' },
  { id: '3', title: 'Taller React Native', date: '28 Ene', location: 'Startup Campus' },
];

/**
 * Saved/Favorites Screen
 */
export default function SavedScreen() {
  const router = useRouter();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const navigateToNotifications = () => router.push('/notifications');
  const navigateToSettings = () => router.push('/settings');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
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
          
          <Pressable style={styles.iconButton} onPress={navigateToNotifications}>
            <Ionicons name="person-circle" size={28} color="white" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={navigateToSettings}>
            <Ionicons name="notifications" size={24} color="white" />
          </Pressable>
        </View>
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter pills */}
        <View style={styles.filtersContainer}>
          <Pressable style={[styles.filterPill, styles.filterPillActive]}>
            <Text style={styles.filterTextActive}>Hackathons</Text>
          </Pressable>
          <Pressable style={styles.filterPill}>
            <Text style={styles.filterText}>Conferencias</Text>
          </Pressable>
        </View>
        
        {/* Section title */}
        <Text style={styles.sectionTitle}>Próximos eventos</Text>
        
        {/* Event cards */}
        {SAVED_EVENTS.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Pressable
              style={styles.eventCardHeader}
              onPress={() => setExpandedEvent(
                expandedEvent === event.id ? null : event.id
              )}
            >
              <View style={styles.eventCardLeft}>
                <View style={styles.eventIconContainer}>
                  <Image
                    source={require('@/assets/images/devpal-mascot.png')}
                    style={styles.eventIcon}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {event.title}
                </Text>
              </View>
              
              <Pressable style={styles.moreInfoButton}>
                <Text style={styles.moreInfoText}>Más información</Text>
                <Ionicons 
                  name={expandedEvent === event.id ? "chevron-up" : "chevron-down"} 
                  size={16} 
                  color={COLORS.textMuted} 
                />
              </Pressable>
            </Pressable>
            
            {expandedEvent === event.id && (
              <View style={styles.eventExpanded}>
                <View style={styles.eventDetail}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.primaryBlue} />
                  <Text style={styles.eventDetailText}>{event.date}</Text>
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
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
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
    fontWeight: '600',
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
});
