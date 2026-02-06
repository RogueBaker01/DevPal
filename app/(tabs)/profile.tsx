import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, TextInput, StyleSheet, Image } from "react-native";
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

// User profile data
const USER_PROFILE = {
  name: 'Juan García',
  email: 'juan@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  events: 12,
  certificates: 5,
  achievements: 3,
};

// Portfolio events
const PORTFOLIO_EVENTS = [
  { id: '1', title: 'Hackathon Nacional 2024', date: '10 Feb 2024', status: 'Ganador' },
  { id: '2', title: 'Conferencia DevOps México', date: '2 Feb 2024', status: 'Asistido' },
  { id: '3', title: 'Taller React Native', date: '28 Ene 2024', status: 'Completado' },
];

/**
 * Profile/Portfolio Screen
 */
export default function ProfileScreen() {
  const router = useRouter();

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
        {/* Profile card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: USER_PROFILE.avatar }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{USER_PROFILE.name}</Text>
            <Text style={styles.profileEmail}>{USER_PROFILE.email}</Text>
          </View>
          <Pressable onPress={navigateToSettings}>
            <Ionicons name="settings-outline" size={24} color={COLORS.textMuted} />
          </Pressable>
        </View>
        
        {/* Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{USER_PROFILE.events}</Text>
            <Text style={styles.statLabel}>Eventos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{USER_PROFILE.certificates}</Text>
            <Text style={styles.statLabel}>Certificados</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{USER_PROFILE.achievements}</Text>
            <Text style={styles.statLabel}>Logros</Text>
          </View>
        </View>
        
        {/* Portfolio section */}
        <Text style={styles.sectionTitle}>Mi Portafolio</Text>
        
        {PORTFOLIO_EVENTS.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Pressable style={styles.eventCardHeader}>
              <View style={styles.eventCardLeft}>
                <View style={styles.eventIconContainer}>
                  <Image
                    source={require('@/assets/images/devpal-mascot.png')}
                    style={styles.eventIcon}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
              </View>
              
              <View style={[
                styles.statusBadge,
                event.status === 'Ganador' && styles.statusBadgeHighlight
              ]}>
                <Text style={[
                  styles.statusText,
                  event.status === 'Ganador' && styles.statusTextHighlight
                ]}>
                  {event.status}
                </Text>
              </View>
            </Pressable>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputGray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    color: COLORS.darkBg,
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statNumber: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
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
    padding: 14,
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
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },
  eventDate: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  statusBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeHighlight: {
    backgroundColor: COLORS.accentCyan,
  },
  statusText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextHighlight: {
    color: COLORS.darkBg,
  },
});
