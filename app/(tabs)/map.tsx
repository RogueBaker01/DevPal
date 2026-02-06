import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Image, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Design tokens
const COLORS = {
  darkBg: '#0F172A',
  primaryBlue: '#2563EB',
  accentCyan: '#22D3EE',
  white: '#FFFFFF',
  textMuted: '#64748B',
  mapGreen: '#E8F4E8',
};

// Map pins
const MAP_PINS = [
  { id: '1', title: 'Hackathon Nacional 2024', x: 0.25, y: 0.35, date: '10 Feb', location: 'Centro de Convenciones' },
  { id: '2', title: 'Conferencia DevOps', x: 0.65, y: 0.30, date: '2 Feb', location: 'Auditorio Principal' },
  { id: '3', title: 'Taller React Native', x: 0.40, y: 0.55, date: '28 Ene', location: 'Startup Campus' },
  { id: '4', title: 'Feria Tecnológica', x: 0.75, y: 0.60, date: '15 Feb', location: 'Plaza Mayor' },
];

export default function MapScreen() {
  const router = useRouter();
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
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

  const selectedEvent = MAP_PINS.find(p => p.id === selectedPin);

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
      
      {/* Map area */}
      <View style={styles.mapContainer}>
        <View style={styles.mapBackground}>
          {/* Roads */}
          <View style={[styles.road, styles.roadH1]} />
          <View style={[styles.road, styles.roadH2]} />
          <View style={[styles.road, styles.roadH3]} />
          <View style={[styles.road, styles.roadV1]} />
          <View style={[styles.road, styles.roadV2]} />
          <View style={[styles.road, styles.roadV3]} />
          
          {/* Pins */}
          {MAP_PINS.map((pin) => (
            <Pressable
              key={pin.id}
              style={[
                styles.pinWrapper,
                { left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }
              ]}
              onPress={() => setSelectedPin(pin.id)}
            >
              <View style={[
                styles.pin,
                selectedPin === pin.id && styles.pinSelected
              ]}>
                <Ionicons name="location" size={20} color="white" />
              </View>
            </Pressable>
          ))}
        </View>
      </View>
      
      {/* Event modal */}
      {selectedEvent && (
        <View style={styles.eventModal}>
          <View style={styles.eventModalContent}>
            <Image
              source={{ uri: `https://picsum.photos/seed/${selectedEvent.id}/300/150` }}
              style={styles.eventImage}
            />
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
              <View style={styles.eventMeta}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.primaryBlue} />
                <Text style={styles.eventMetaText}>{selectedEvent.date}</Text>
              </View>
              <View style={styles.eventMeta}>
                <Ionicons name="location-outline" size={14} color={COLORS.textMuted} />
                <Text style={styles.eventMetaText}>{selectedEvent.location}</Text>
              </View>
            </View>
            <Pressable style={styles.closeButton} onPress={() => setSelectedPin(null)}>
              <Ionicons name="close" size={20} color={COLORS.textMuted} />
            </Pressable>
          </View>
          <Pressable 
            style={styles.actionButton}
            onPress={() => router.push(`/event/${selectedEvent.id}`)}
          >
            <Text style={styles.actionButtonText}>Página Oficial</Text>
          </Pressable>
        </View>
      )}
      
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
    backgroundColor: COLORS.mapGreen,
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
  mapContainer: {
    flex: 1,
  },
  mapBackground: {
    flex: 1,
    backgroundColor: COLORS.mapGreen,
    position: 'relative',
  },
  road: {
    position: 'absolute',
    backgroundColor: COLORS.white,
  },
  roadH1: { left: 0, right: 0, top: '25%', height: 10 },
  roadH2: { left: 0, right: 0, top: '50%', height: 14 },
  roadH3: { left: 0, right: 0, top: '75%', height: 8 },
  roadV1: { top: 0, bottom: 0, left: '20%', width: 8 },
  roadV2: { top: 0, bottom: 0, left: '50%', width: 12 },
  roadV3: { top: 0, bottom: 0, left: '80%', width: 6 },
  pinWrapper: {
    position: 'absolute',
    transform: [{ translateX: -16 }, { translateY: -32 }],
  },
  pin: {
    backgroundColor: COLORS.primaryBlue,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pinSelected: {
    backgroundColor: COLORS.accentCyan,
    transform: [{ scale: 1.2 }],
  },
  eventModal: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  eventModalContent: {
    flexDirection: 'row',
    padding: 12,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  eventInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  eventTitle: {
    color: COLORS.darkBg,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  eventMetaText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  closeButton: {
    padding: 8,
  },
  actionButton: {
    backgroundColor: COLORS.primaryBlue,
    padding: 14,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
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
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
});
