import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MealDetail = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strCategory: string;
  strArea: string;
  [key: string]: string | null;
};

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMealDetail(id);
    }
  }, [id]);

  const fetchMealDetail = async (mealId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
      );
      const data = await response.json();
      if (data.meals?.[0]) {
        setMeal(data.meals[0]);
      }
    } catch (error) {
      console.log("Errore:", error);
    } finally {
      setLoading(false);
    }
  };

  // Estrae gli ingredienti (TheMealDB li mette in strIngredient1, strIngredient2...)
  const getIngredients = () => {
    if (!meal) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`${measure || ""} ${ingredient}`.trim());
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#E07A5F' />
      </SafeAreaView>
    );
  }

  if (!meal) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Ricetta non trovata</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con bottone indietro */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color='#1F2937' />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {meal.strMeal}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: meal.strMealThumb }}
          style={styles.image}
          resizeMode='cover'
        />

        <View style={styles.content}>
          <Text style={styles.title}>{meal.strMeal}</Text>

          <View style={styles.meta}>
            <Text style={styles.metaText}>{meal.strCategory}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{meal.strArea}</Text>
          </View>

          {/* Ingredienti */}
          <Text style={styles.sectionTitle}>Ingredienti</Text>
          {getIngredients().map((item, index) => (
            <Text key={index} style={styles.ingredient}>
              • {item}
            </Text>
          ))}

          {/* Istruzioni */}
          <Text style={styles.sectionTitle}>Preparazione</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF8F0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF8F0",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  image: {
    width: "100%",
    height: 260,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  metaText: {
    fontSize: 14,
    color: "#92400E",
  },
  metaDot: {
    marginHorizontal: 8,
    color: "#92400E",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    marginTop: 8,
  },
  ingredient: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 6,
    lineHeight: 22,
  },
  instructions: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 24,
    marginBottom: 40,
  },
});
