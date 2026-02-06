import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";

// Design tokens
const COLORS = {
  darkBg: '#0F172A',
  primaryBlue: '#2563EB',
  accentCyan: '#22D3EE',
  textMuted: '#64748B',
  white: '#FFFFFF',
};

/**
 * Tab Layout - Floating dark blue tab bar
 * Based on Figma: Rounded pill navigation with 4 tabs
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.accentCyan,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.darkBg,
          borderRadius: 28,
          marginHorizontal: 16,
          marginBottom: 24,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          position: "absolute",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconBg : undefined}>
              <Image
                source={require("@/assets/images/devpal-mascot.png")}
                style={styles.mascotIcon}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Favoritos",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "star" : "star-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.mapIconContainer}>
              <View style={[styles.mapStripe, { backgroundColor: color }]} />
              <View style={[styles.mapStripe, { backgroundColor: color }]} />
              <View style={[styles.mapStripe, { backgroundColor: color }]} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Portafolio",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "document-text" : "document-text-outline"} 
              size={22} 
              color={color} 
            />
          ),
        }}
      />
      {/* Hidden screens */}
      <Tabs.Screen
        name="chat"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  mascotIcon: {
    width: 28,
    height: 28,
  },
  activeIconBg: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: 16,
    padding: 4,
  },
  mapIconContainer: {
    width: 22,
    height: 22,
    justifyContent: 'space-between',
  },
  mapStripe: {
    width: '100%',
    height: 5,
    borderRadius: 2,
  },
});
