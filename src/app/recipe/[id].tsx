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

  const getIngredients = () => {
    if (!meal) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : "",
        });
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
        <Text style={styles.errorText}>Ricetta non trovata</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superiore personalizzata */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name='arrow-back' size={24} color='#1F2937' />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {meal.strMeal}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Contenitore Immagine con angoli arrotondati e ombra */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: meal.strMealThumb }}
            style={styles.image}
            resizeMode='cover'
          />
        </View>

        <View style={styles.content}>
          {/* Titolo Principale */}
          <Text style={styles.title}>{meal.strMeal}</Text>

          {/* Badge per Categoria e Provenienza */}
          <View style={styles.metaContainer}>
            <View style={styles.badge}>
              <Ionicons
                name='restaurant-outline'
                size={14}
                color='#E07A5F'
                style={styles.badgeIcon}
              />
              <Text style={styles.badgeText}>{meal.strCategory}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons
                name='earth-outline'
                size={14}
                color='#E07A5F'
                style={styles.badgeIcon}
              />
              <Text style={styles.badgeText}>{meal.strArea}</Text>
            </View>
          </View>

          {/* Sezione Ingredienti dentro una scheda pulita */}
          <Text style={styles.sectionTitle}>Ingredienti</Text>
          <View style={styles.card}>
            {getIngredients().map((item, index) => (
              <View key={index} style={styles.ingredientRow}>
                <Ionicons
                  name='checkmark-circle'
                  size={18}
                  color='#E07A5F'
                  style={styles.checkIcon}
                />
                <Text style={styles.ingredientText}>
                  <Text style={styles.ingredientMeasure}>{item.measure} </Text>
                  {item.name}
                </Text>
              </View>
            ))}
          </View>

          {/* Sezione Preparazione */}
          <Text style={styles.sectionTitle}>Preparazione</Text>
          <View style={styles.card}>
            <Text style={styles.instructions}>{meal.strInstructions}</Text>
          </View>
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
  errorText: {
    fontSize: 16,
    color: "#92400E",
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFF8F0",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(31, 41, 55, 0.05)",
  },
  backButton: {
    padding: 6,
    marginRight: 8,
    borderRadius: 50,
    backgroundColor: "rgba(31, 41, 55, 0.05)",
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  imageContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 280,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1F2937",
    lineHeight: 32,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(224, 122, 95, 0.12)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400E",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(31, 41, 55, 0.03)",
  },
  checkIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  ingredientText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  ingredientMeasure: {
    fontWeight: "700",
    color: "#E07A5F",
  },
  instructions: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 25,
  },
});
