import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

interface RecipeCardProps {
  item: Meal;
  onPress: (id: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ item, onPress }) => {
  return (
    <Pressable style={styles.card} onPress={() => onPress(item.idMeal)}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.strMealThumb }}
          style={styles.image}
          resizeMode='cover'
        />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.mealName} numberOfLines={2}>
          {item.strMeal}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardActionText}>Vedi ricetta</Text>
          <Ionicons name='arrow-forward' size={14} color='#E07A5F' />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 0.48,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imageContainer: { width: "100%", height: 130, backgroundColor: "#E5E7EB" },
  image: { width: "100%", height: "100%" },
  cardContent: { padding: 12, justifyContent: "space-between", minHeight: 90 },
  mealName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardActionText: { fontSize: 12, fontWeight: "600", color: "#E07A5F" },
});
