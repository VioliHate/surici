import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type AppMode = "random" | "frigo" | "stipi";

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onModeChange,
}) => {
  return (
    <View style={styles.tabContainer}>
      <Pressable
        style={[
          styles.tabButton,
          currentMode === "random" && styles.tabActiveButton,
        ]}
        onPress={() => onModeChange("random")}
      >
        <Ionicons
          name='shuffle'
          size={18}
          color={currentMode === "random" ? "#FFFFFF" : "#E07A5F"}
        />
        <Text
          style={[
            styles.tabText,
            currentMode === "random" && styles.tabActiveText,
          ]}
        >
          Casuali
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.tabButton,
          currentMode === "frigo" && styles.tabActiveButton,
        ]}
        onPress={() => onModeChange("frigo")}
      >
        <Ionicons
          name='snow-outline'
          size={18}
          color={currentMode === "frigo" ? "#FFFFFF" : "#E07A5F"}
        />
        <Text
          style={[
            styles.tabText,
            currentMode === "frigo" && styles.tabActiveText,
          ]}
        >
          Svuota Frigo
        </Text>
      </Pressable>
      <Pressable
        style={[
          styles.tabButton,
          currentMode === "stipi" && styles.tabActiveButton,
        ]}
        onPress={() => onModeChange("stipi")}
      >
        <Ionicons
          name='options'
          size={20}
          color={currentMode === "stipi" ? "#FFFFFF" : "#92400E"}
        />
        <Text
          style={[
            styles.tabText,
            currentMode === "stipi" && styles.tabActiveText,
          ]}
        >
          Stipi nel Mondo
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginVertical: 12,
    gap: 10,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "rgba(224, 122, 95, 0.12)",
  },
  tabActiveButton: { backgroundColor: "#E07A5F" },
  tabText: { fontSize: 14, fontWeight: "700", color: "#E07A5F" },
  tabActiveText: { color: "#FFFFFF" },
});
