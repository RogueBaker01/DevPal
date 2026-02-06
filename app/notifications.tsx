import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Design tokens
const COLORS = {
  darkBg: '#0F172A',
  primaryBlue: '#2563EB',
  accentCyan: '#22D3EE',
  white: '#FFFFFF',
  inputGray: '#F1F5F9',
  textMuted: '#64748B',
};

// Sample notifications
const NOTIFICATIONS = [
  { id: '1', title: 'Nuevo evento disponible', message: 'Hackathon 2024 ya está abierto para inscripción', time: 'Hace 5 min', unread: true },
  { id: '2', title: 'Recordatorio', message: 'Conferencia DevOps comienza mañana', time: 'Hace 1 hora', unread: true },
  { id: '3', title: 'Inscripción confirmada', message: 'Tu inscripción al Taller React Native fue exitosa', time: 'Ayer', unread: false },
];

/**
 * Notifications Screen
 */
export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {NOTIFICATIONS.map((notification) => (
          <Pressable
            key={notification.id}
            style={[
              styles.notificationCard,
              notification.unread && styles.notificationUnread
            ]}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="notifications" size={20} color="white" />
            </View>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationMessage}>{notification.message}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
            {notification.unread && <View style={styles.unreadDot} />}
          </Pressable>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  scrollContent: {
    padding: 20,
  },
  notificationCard: {
    backgroundColor: COLORS.inputGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationUnread: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  iconContainer: {
    backgroundColor: COLORS.primaryBlue,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: COLORS.darkBg,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accentCyan,
    marginLeft: 8,
  },
});
