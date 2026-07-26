import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ChiMiFazzuProps {
  onSpin: () => void;
  isSpinning: boolean;
}

export function ChiMiFazzu({ onSpin, isSpinning }: ChiMiFazzuProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Non sai cosa cucinare?</Text>
      <Text style={styles.subtitle}>
        Lascia fare al destino, ci pensa Surici!
      </Text>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isSpinning && styles.buttonDisabled,
        ]}
        onPress={onSpin}
        disabled={isSpinning}
      >
        <Ionicons
          name={isSpinning ? "refresh" : "dice-outline"}
          size={22}
          color='#FFFFFF'
        />
        <Text style={styles.buttonText}>
          {isSpinning ? "Sto cucinando l'idea..." : "CHI MI FAZZU?"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(31, 41, 55, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#E07A5F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
    width: "100%",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonDisabled: {
    backgroundColor: "#A0AEC0",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
