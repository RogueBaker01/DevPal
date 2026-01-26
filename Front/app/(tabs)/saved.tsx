import EventCard from "@/components/EventCard";
import Colors from "@/constants/Colors";
import { mockEvents } from "@/constants/MockData";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SavedScreen() {
  // Filter for saved events (for demo, we'll show all)
  const savedEvents = mockEvents;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Próximos</Text>
          {savedEvents.slice(0, 3).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => console.log("Event pressed:", event.id)}
            />
          ))}
        </View>

        {/* Past Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ Pasados</Text>
          {savedEvents.slice(3).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => console.log("Event pressed:", event.id)}
            />
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});
