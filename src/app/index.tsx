import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
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
  const router = useRouter();

  useEffect(() => {
    fetchRandomMeals();
  }, []);

  const fetchRandomMeals = async () => {
    try {
      setLoading(true);
      const results: Meal[] = [];

      // Recupera 8 ricette casuali per modellare i dati
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
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: "/recipe/[id]",
          params: { id: item.idMeal },
        })
      }
    >
      {/* Immagine con overlay sfumato simulato dal box */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.strMealThumb }}
          style={styles.image}
          resizeMode='cover'
        />
      </View>

      {/* Info Card con altezza minima controllata per evitare rotture di layout */}
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Brand */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Surici</Text>
          <Ionicons
            name='restaurant'
            size={24}
            color='#E07A5F'
            style={styles.headerIcon}
          />
        </View>
        <Text style={styles.subtitle}>
          Il topo calabrese che trova sempre qualcosa da mangiare
        </Text>
      </View>

      {/* Stato di caricamento */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#E07A5F' />
          <Text style={styles.loadingText}>Sto cercando ricette...</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={renderMeal}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  headerIcon: {
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#92400E",
    marginTop: 6,
    lineHeight: 20,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#92400E",
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 30,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    flex: 0.48, // Distribuisce le due colonne in modo pulito ed equo
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
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 130,
    backgroundColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(31, 41, 55, 0.65)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  cardBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  cardContent: {
    padding: 12,
    justifyContent: "space-between",
    minHeight: 90, // Evita che titoli corti o lunghi sballino le altezze delle card affiancate
  },
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
  cardActionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#E07A5F",
  },
});
