import ChubbyButton from "@/components/ChubbyButton";
import Colors from "@/constants/Colors";
import { userProfile } from "@/constants/MockData";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={require("@/assets/images/devpal-mascot.png")}
            style={styles.mascotImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.name}>{userProfile.name}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>✨ Nivel {userProfile.level}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🔥 {userProfile.streak}</Text>
          <Text style={styles.statLabel}>Racha (días)</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🎯 {userProfile.eventsAttended}</Text>
          <Text style={styles.statLabel}>Eventos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>⭐ {userProfile.level}</Text>
          <Text style={styles.statLabel}>Nivel</Text>
        </View>
      </View>

      {/* Interests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Tus Intereses</Text>
        <View style={styles.interestsContainer}>
          {userProfile.interests.map((interest, index) => (
            <View key={index} style={styles.interestChip}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <ChubbyButton
          title="⚙️ Configuración"
          onPress={() => console.log("Settings")}
          variant="secondary"
          fullWidth
        />
        <ChubbyButton
          title="📊 Ver Estadísticas"
          onPress={() => console.log("Stats")}
          variant="primary"
          fullWidth
        />
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.default,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: Colors.blue.primary,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: Colors.cyan.bright,
    overflow: "hidden",
  },
  mascotImage: {
    width: 100,
    height: 100,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: Colors.purple.vibrant,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  statCard: {
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    minWidth: 100,
    shadowColor: Colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestChip: {
    backgroundColor: Colors.cyan.bright,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.white,
  },
  bottomSpacer: {
    height: 40,
  },
});
