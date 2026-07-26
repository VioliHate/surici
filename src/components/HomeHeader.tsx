import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const HomeHeader: React.FC = () => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Surici</Text>
        <Ionicons name='restaurant' size={24} color='#E07A5F' />
      </View>
      <Text style={styles.subtitle}>
        Il topo calabrese che trova sempre qualcosa da mangiare
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  titleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#92400E",
    marginTop: 4,
    lineHeight: 18,
    fontWeight: "500",
  },
});
