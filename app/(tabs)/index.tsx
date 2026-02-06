import React, { useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  Pressable, 
  Image,
  StyleSheet,
  Modal
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

// Filter options
const FILTERS = ["Hackathons", "Conferencias"];

/**
 * Home Screen (Casa)
 * Fixed: Blue header, working dropdowns, correct icon navigation, account dropdown
 */
export default function HomeScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("Hackathons");
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
      
      {/* BLUE Header - solid blue background */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          {/* Mascot */}
          <Image
            source={require('@/assets/images/devpal-mascot.png')}
            style={styles.mascotIcon}
            resizeMode="contain"
          />
          
          {/* Search input */}
          <Pressable style={styles.searchContainer} onPress={navigateToSearch}>
            <Text style={styles.searchText}>Buscar</Text>
            <Ionicons name="search" size={18} color={COLORS.primaryBlue} />
          </Pressable>
          
          {/* Account icon - opens dropdown */}
          <Pressable 
            style={styles.iconButton} 
            onPress={() => setShowAccountMenu(true)}
          >
            <Ionicons name="person-circle" size={28} color="white" />
          </Pressable>
          
          {/* Notifications icon - goes to notifications */}
          <Pressable style={styles.iconButton} onPress={navigateToNotifications}>
            <Ionicons name="notifications" size={24} color="white" />
          </Pressable>
        </View>
      </View>
      
      {/* Hero image */}
      <View style={styles.heroSection}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800" }}
          style={styles.heroImage}
        />
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
        <Text style={styles.sectionTitle}>Próximos eventos</Text>
        
        {/* Event cards with WORKING dropdowns */}
        {mockEvents.map((event) => {
          const isExpanded = expandedEvent === event.id;
          return (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventCardHeader}>
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
                
                {/* More info button - CLICKABLE */}
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
              
              {/* Dropdown content */}
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
                  <Pressable 
                    style={styles.viewButton}
                    onPress={() => router.push(`/event/${event.id}`)}
                  >
                    <Text style={styles.viewButtonText}>Ver evento</Text>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
      
      {/* Floating P button */}
      <Pressable style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>P</Text>
      </Pressable>
      
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
              <Text style={[styles.dropdownItemText, { color: '#EF4444' }]}>
                Cerrar sesión
              </Text>
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
  // SOLID BLUE HEADER
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
  heroSection: {
    height: 160,
  },
  heroImage: {
    width: '100%',
    height: '100%',
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
  viewButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
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
  // Account Dropdown Modal
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
