import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Image, Modal } from "react-native";
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
  { id: '1', title: 'Hackathon Nacional 2024', date: '10 Feb 2024', status: 'Ganador', time: '9:00 AM', location: 'Centro de Convenciones' },
  { id: '2', title: 'Conferencia DevOps México', date: '2 Feb 2024', status: 'Asistido', time: '10:00 AM', location: 'Auditorio Principal' },
  { id: '3', title: 'Taller React Native', date: '28 Ene 2024', status: 'Completado', time: '2:00 PM', location: 'Startup Campus' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const navigateToSearch = () => router.push('/search');
  const navigateToNotifications = () => router.push('/notifications');
  const navigateToSettings = () => {
    setShowAccountMenu(false);
    router.push('/settings');
  };
  const handleLogout = () => {
    setShowAccountMenu(false);
    router.replace('/(auth)/welcome');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* SOLID BLUE Header */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <Image
            source={require('@/assets/images/devpal-mascot.png')}
            style={styles.mascotIcon}
            resizeMode="contain"
          />
          
          <Pressable style={styles.searchContainer} onPress={navigateToSearch}>
            <Text style={styles.searchText}>Buscar</Text>
            <Ionicons name="search" size={18} color={COLORS.primaryBlue} />
          </Pressable>
          
          <Pressable style={styles.iconButton} onPress={() => setShowAccountMenu(true)}>
            <Ionicons name="person-circle" size={28} color="white" />
          </Pressable>
          
          <Pressable style={styles.iconButton} onPress={navigateToNotifications}>
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
          <Image source={{ uri: USER_PROFILE.avatar }} style={styles.avatar} />
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
        
        {PORTFOLIO_EVENTS.map((event) => {
          const isExpanded = expandedEvent === event.id;
          return (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventCardHeader}>
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
                  </View>
                </View>
                
                <Pressable 
                  style={styles.moreInfoButton}
                  onPress={() => setExpandedEvent(isExpanded ? null : event.id)}
                >
                  <Text style={styles.moreInfoText}>Más información</Text>
                  <Ionicons 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color={COLORS.textMuted} 
                  />
                </Pressable>
              </View>
              
              {isExpanded && (
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
                  <View style={styles.statusRow}>
                    <Text style={styles.statusLabel}>Estado:</Text>
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
                  </View>
                </View>
              )}
            </View>
          );
        })}
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
          <View style={styles.accountDropdown}>
            <Pressable style={styles.dropdownItem} onPress={navigateToSettings}>
              <Ionicons name="settings-outline" size={20} color={COLORS.darkBg} />
              <Text style={styles.dropdownItemText}>Configuración</Text>
            </Pressable>
            <View style={styles.dropdownDivider} />
            <Pressable style={styles.dropdownItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={[styles.dropdownItemText, { color: '#EF4444' }]}>Cerrar sesión</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
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
    paddingVertical: 10,
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
  moreInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
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
    gap: 10,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  eventDetailText: {
    color: COLORS.darkBg,
    fontSize: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  statusLabel: {
    color: COLORS.darkBg,
    fontSize: 14,
  },
  statusBadge: {
    backgroundColor: COLORS.primaryBlue,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeHighlight: {
    backgroundColor: COLORS.accentCyan,
  },
  statusText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextHighlight: {
    color: COLORS.darkBg,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 100,
    paddingRight: 16,
  },
  accountDropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.darkBg,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: COLORS.inputGray,
    marginHorizontal: 16,
  },
});
