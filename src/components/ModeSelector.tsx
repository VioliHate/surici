import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type AppMode = "random" | "frigo" | "stipi" | "chimifazzu";

interface ModeSelectorProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  const modesConfig = [
    { id: "random" as AppMode, label: "Casuale", icon: "shuffle-outline" },
    { id: "frigo" as AppMode, label: "Svuota Frigo", icon: "basket-outline" },
    { id: "stipi" as AppMode, label: "Stipi nel Mondo", icon: "earth-outline" },
    {
      id: "chimifazzu" as AppMode,
      label: "Chi mi fazzu",
      icon: "dice-outline",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {modesConfig.map((item) => {
          const isActive = currentMode === item.id;
          return (
            <Pressable
              key={item.id}
              style={[styles.button, isActive && styles.activeButton]}
              onPress={() => onModeChange(item.id)}
            >
              <Ionicons
                name={item.icon as any}
                size={18}
                color={isActive ? "#FFFFFF" : "#92400E"}
              />
              <Text
                style={[styles.buttonText, isActive && styles.activeButtonText]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    height: 46,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(146, 64, 14, 0.15)",
  },
  activeButton: {
    backgroundColor: "#E07A5F",
    borderColor: "#E07A5F",
  },
  buttonText: {
    color: "#92400E",
    fontSize: 14,
    fontWeight: "600",
  },
  activeButtonText: {
    color: "#FFFFFF",
  },
});
