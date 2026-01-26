import EventCard from "@/components/EventCard";
import Colors from "@/constants/Colors";
import { mockEvents, userProfile } from "@/constants/MockData";
import React, { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

// Cross-platform map component
import MapView, { MapMarker } from "@/components/MapView";

const { height } = Dimensions.get("window");

export default function HomeScreen() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Center on Mexico City
  const initialRegion = {
    latitude: 19.4326,
    longitude: -99.1332,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {/* Header with Streak */}
      <View style={styles.header}>
        <View style={styles.streakContainer}>
          <Text style={styles.headerTitle}>🔥 {userProfile.streak} días</Text>
          <Text style={styles.headerSubtitle}>¡Sigue así!</Text>
        </View>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {mockEvents.map((event) => {
            // Distribute markers around the center
            const offset = 0.02;
            // Deterministic random position based on ID for consistency
            const seed = parseInt(event.id) || 1;
            const lat = initialRegion.latitude + Math.sin(seed) * offset;
            const lng = initialRegion.longitude + Math.cos(seed) * offset;

            return (
              <MapMarker
                key={event.id}
                coordinate={{ latitude: lat, longitude: lng }}
                onPress={() => setSelectedEvent(event.id)}
              >
                <View
                  style={[
                    styles.markerContainer,
                    {
                      backgroundColor:
                        event.category === "workshop"
                          ? Colors.cyan.bright
                          : event.category === "meetup"
                            ? Colors.purple.vibrant
                            : Colors.blue.primary,
                    },
                  ]}
                >
                  <Text style={styles.markerIcon}>
                    {event.category === "workshop"
                      ? "🔧"
                      : event.category === "meetup"
                        ? "👥"
                        : "🎤"}
                  </Text>
                </View>
              </MapMarker>
            );
          })}
        </MapView>
      </View>

      {/* Events List Section */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>📍 Cerca de ti</Text>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {mockEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => console.log("Event pressed:", event.id)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  header: {
    backgroundColor: Colors.blue.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  streakContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: Colors.cyan.bright,
    fontSize: 14,
    fontWeight: "600",
  },
  mapContainer: {
    height: height * 0.35,
    backgroundColor: Colors.gray[200],
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: Colors.white,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerIcon: {
    fontSize: 18,
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
});
