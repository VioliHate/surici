import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

interface JollyRecipeCardProps {
  item: Meal;
  onPress: (id: string) => void;
}

export function JollyRecipeCard({ item, onPress }: JollyRecipeCardProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => onPress(item.idMeal)}
      >
        <Image source={{ uri: item.strMealThumb }} style={styles.image} />

        <View style={styles.infoContainer}>
          <View style={styles.badge}>
            <Ionicons name='sparkles' size={14} color='#FFF' />
            <Text style={styles.badgeText}>Piatto Jolly</Text>
          </View>

          <Text style={styles.title} numberOfLines={2}>
            {item.strMeal}
          </Text>

          <Text style={styles.tapText}>Tocca per vedere la ricetta →</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    width: "100%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: "85%", // Più stretta e centrata rispetto alla lista standard
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(31, 41, 55, 0.04)",
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 16,
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E07A5F",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
    marginBottom: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  tapText: {
    fontSize: 13,
    color: "#92400E",
    fontWeight: "600",
  },
});
