import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ChiMiFazzuProps {
  onSpin: () => void;
  isSpinning: boolean;
}

export function ChiMiFazzu({ onSpin, isSpinning }: ChiMiFazzuProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons
          name='help-circle-outline'
          size={80}
          color='#E07A5F'
          style={styles.icon}
        />
        <Text style={styles.title}>Non sai cosa cucinare?</Text>
        <Text style={styles.subtitle}>
          Lascia fare al destino. Premi il bottone e Surici sceglierà un piatto
          pè tià!
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
            size={28}
            color='#FFFFFF'
            style={isSpinning && styles.spinningIcon}
          />
          <Text style={styles.buttonText}>
            {isSpinning ? "Estrazione in corso..." : "CHI MI FAZZU?"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(31, 41, 55, 0.04)",
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#E07A5F",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 50,
    gap: 10,
    width: "100%",
    shadowColor: "#E07A5F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: "#A0AEC0",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  spinningIcon: {},
});
