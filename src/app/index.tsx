import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export default function HomeScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomMeals();
  }, []);

  const fetchRandomMeals = async () => {
    try {
      setLoading(true);
      const results: Meal[] = [];

      for (let i = 0; i < 8; i++) {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/random.php",
        );
        const data = await response.json();
        if (data.meals?.[0]) {
          results.push(data.meals[0]);
        }
      }

      setMeals(results);
    } catch (error) {
      console.log("Errore API:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMeal = ({ item }: { item: Meal }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.strMealThumb }}
        style={styles.image}
        resizeMode='cover'
      />
      <Text style={styles.mealName} numberOfLines={2}>
        {item.strMeal}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Surici</Text>
        <Text style={styles.subtitle}>Ricette casuali del giorno</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#E07A5F' />
          <Text style={styles.loadingText}>Caricamento ricette...</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderMeal}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 15,
    color: "#92400E",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#92400E",
  },
  list: {
    paddingHorizontal: 8,
    paddingBottom: 30,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 140,
  },
  mealName: {
    padding: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
});
