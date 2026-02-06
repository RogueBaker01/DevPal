import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
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

// Recent searches
const RECENT_SEARCHES = [
  { id: '1', title: 'Peña de Bernal', subtitle: '21 de Noviembre - 300 personas' },
];

// Suggested searches
const SUGGESTIONS = [
  'Por la mera',
  'Descubre que hay a tu alrededor',
  'Santiago de Querétaro',
];

/**
 * Search Screen (Búsqueda)
 * Fixed: Solid Blue Header matching other screens
 */
export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(true);

  const navigateToNotifications = () => router.push('/notifications');

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* SOLID BLUE Header */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          {/* Mascot */}
          <Image
            source={require('@/assets/images/devpal-mascot.png')}
            style={styles.mascotIcon}
            resizeMode="contain"
          />
          
          {/* Search input - White background */}
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Buscar..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
              </Pressable>
            )}
          </View>
          
          {/* Icons */}
          <Pressable style={styles.iconButton}>
            <Ionicons name="person-circle" size={28} color="white" />
          </Pressable>
          <Pressable style={styles.iconButton} onPress={navigateToNotifications}>
            <Ionicons name="notifications" size={24} color="white" />
          </Pressable>
        </View>

        {/* Search Dropdown - Positioned relative to header */}
        {showDropdown && (
          <View style={styles.dropdown}>
            {/* Recent searches header */}
            <Text style={styles.dropdownHeader}>Búsquedas recientes</Text>
            
            {/* Recent search items */}
            {RECENT_SEARCHES.map((item) => (
              <Pressable 
                key={item.id} 
                style={styles.dropdownItem}
                onPress={() => setSearchQuery(item.title)}
              >
                <View style={styles.dropdownItemIcon}>
                  <Ionicons name="time-outline" size={16} color={COLORS.textMuted} />
                </View>
                <View>
                  <Text style={styles.dropdownItemTitle}>{item.title}</Text>
                  <Text style={styles.dropdownItemSubtitle}>{item.subtitle}</Text>
                </View>
              </Pressable>
            ))}
            
            {/* Suggestions header */}
            <Text style={styles.dropdownHeader}>Sugerencias de búsqueda</Text>
            
            {/* Suggestion items */}
            {SUGGESTIONS.map((suggestion, index) => (
              <Pressable 
                key={index} 
                style={styles.dropdownItem}
                onPress={() => setSearchQuery(suggestion)}
              >
                <View style={styles.dropdownItemIcon}>
                  <Ionicons name="search" size={16} color={COLORS.textMuted} />
                </View>
                <Text style={styles.dropdownItemTitle}>{suggestion}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image - Below header */}
        <View style={styles.heroSection}>
           <Image
            source={{ uri: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800" }}
            style={styles.heroImage}
          />
        </View>

        {/* Filter pills */}
        <View style={[styles.filtersContainer, { marginTop: 20 }]}>
          <Pressable style={[styles.filterPill, styles.filterPillActive]}>
            <Text style={styles.filterTextActive}>Hackathons</Text>
          </Pressable>
          <Pressable style={styles.filterPill}>
            <Text style={styles.filterText}>Conferencias</Text>
          </Pressable>
        </View>
        
        {/* Próximos eventos section */}
        <Text style={styles.sectionTitle}>
          Próximos eventos
        </Text>
        
        {/* Event cards */}
        {mockEvents.map((event) => (
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
                <Text style={styles.eventTitle} numberOfLines={1}>
                  {event.title}
                </Text>
              </View>
              
              <Pressable style={styles.moreInfoButton}>
                <Text style={styles.moreInfoText}>Más información</Text>
                <Ionicons name="chevron-down" size={16} color={COLORS.textMuted} />
              </Pressable>
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
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.primaryBlue,
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 10,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.darkBg,
  },
  iconButton: {
    padding: 4,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
  },
  dropdownHeader: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.inputGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dropdownItemTitle: {
    color: COLORS.darkBg,
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownItemSubtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroSection: {
    height: 160,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
  },
  eventCard: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    marginHorizontal: 20,
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
});
