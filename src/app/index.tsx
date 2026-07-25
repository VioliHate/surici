import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecipeStore } from "../store/useRecipeStore"; // sistema il path in base al tuo progetto

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");

  // Stato globale di Zustand
  const { mode, ingredients, setMode, addIngredient, removeIngredient } =
    useRecipeStore();

  // Ricarica le ricette quando cambia la modalità o la lista degli ingredienti
  useEffect(() => {
    fetchRecipes();
  }, [mode, ingredients]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);

      if (mode === "random") {
        const results: Meal[] = [];
        for (let i = 0; i < 8; i++) {
          const response = await fetch(
            "https://www.themealdb.com/api/json/v1/1/random.php",
          );
          const data = await response.json();
          if (data.meals?.[0]) results.push(data.meals[0]);
        }
        setMeals(results);
      } else {
        // MODALITÀ SVUOTA FRIGO CON FILTRO AVANZATO
        if (ingredients.length === 0) {
          setMeals([]);
          setLoading(false);
          return;
        }

        // 1. Cerca le ricette basandoti sul primo ingrediente inserito
        const mainIngredient = ingredients[0];
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?i=${mainIngredient}`,
        );
        const data = await response.json();

        if (!data.meals) {
          setMeals([]);
          setLoading(false);
          return;
        }

        // Se hai inserito solo un ingrediente, mostra direttamente i risultati dell'API
        if (ingredients.length === 1) {
          setMeals(data.meals);
          setLoading(false);
          return;
        }

        // 2. Se ci sono più ingredienti, recupera i dettagli di ogni ricetta per filtrarla
        const filteredResults: Meal[] = [];

        // Eseguiamo i controlli in parallelo per non rallentare troppo l'app
        await Promise.all(
          data.meals.map(async (shortMeal: Meal) => {
            try {
              const detailResponse = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${shortMeal.idMeal}`,
              );
              const detailData = await detailResponse.json();
              const fullMeal = detailData.meals?.[0];

              if (fullMeal) {
                // Estrai tutti gli ingredienti effettivi di questa ricetta
                const mealIngredients: string[] = [];
                for (let i = 1; i <= 20; i++) {
                  const ing = fullMeal[`strIngredient${i}`];
                  if (ing && ing.trim() !== "") {
                    mealIngredients.push(ing.trim().toLowerCase());
                  }
                }

                // Controlla se questa ricetta contiene TUTTI gli ingredienti cercati dall'utente
                const containsAll = ingredients.every((searchIng) =>
                  mealIngredients.some((mealIng) =>
                    mealIng.includes(searchIng),
                  ),
                );

                if (containsAll) {
                  filteredResults.push(shortMeal);
                }
              }
            } catch (err) {
              console.log(
                "Errore nel recupero del dettaglio durante il filtraggio:",
                err,
              );
            }
          }),
        );

        setMeals(filteredResults);
      }
    } catch (error) {
      console.log("Errore API:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = () => {
    if (inputText.trim() !== "") {
      const parts = inputText.split(",");
      parts.forEach((part) => {
        const cleanIngredient = part.trim();
        if (cleanIngredient !== "") {
          addIngredient(cleanIngredient);
        }
      });
      setInputText("");
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Brand */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Surici</Text>
          <Ionicons name='restaurant' size={24} color='#E07A5F' />
        </View>
        <Text style={styles.subtitle}>
          Il topo calabrese che trova sempre qualcosa da mangiare
        </Text>
      </View>

      {/* Selettore Modalità (Tab Toggle) */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[
            styles.tabButton,
            mode === "random" && styles.tabActiveButton,
          ]}
          onPress={() => setMode("random")}
        >
          <Ionicons
            name='shuffle'
            size={18}
            color={mode === "random" ? "#FFFFFF" : "#E07A5F"}
          />
          <Text
            style={[styles.tabText, mode === "random" && styles.tabActiveText]}
          >
            Casuali
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabButton, mode === "frigo" && styles.tabActiveButton]}
          onPress={() => setMode("frigo")}
        >
          <Ionicons
            name='snow-outline'
            size={18}
            color={mode === "frigo" ? "#FFFFFF" : "#E07A5F"}
          />
          <Text
            style={[styles.tabText, mode === "frigo" && styles.tabActiveText]}
          >
            Svuota Frigo
          </Text>
        </Pressable>
      </View>

      {/* Sezione di Input Ingredienti (visibile solo in modalità Svuota Frigo) */}
      {mode === "frigo" && (
        <View style={styles.frigoSection}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='Inserisci ingrediente in inglese (es: chicken, tomato)...'
              placeholderTextColor='#9CA3AF'
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleAddIngredient}
            />
            <Pressable style={styles.addButton} onPress={handleAddIngredient}>
              <Ionicons name='add' size={24} color='#FFFFFF' />
            </Pressable>
          </View>

          {/* Lista orizzontale dei tag ingredienti inseriti */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsContainer}
          >
            {ingredients.map((ing) => (
              <View key={ing} style={styles.tag}>
                <Text style={styles.tagText}>{ing}</Text>
                <Pressable onPress={() => removeIngredient(ing)}>
                  <Ionicons
                    name='close-circle'
                    size={16}
                    color='#92400E'
                    style={{ marginLeft: 4 }}
                  />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Contenuto Principale: Caricamento o Lista */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#E07A5F' />
          <Text style={styles.loadingText}>
            Surici sta cercando nel frigo...
          </Text>
        </View>
      ) : mode === "frigo" && ingredients.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name='basket-outline'
            size={48}
            color='#92400E'
            opacity={0.5}
          />
          <Text style={styles.emptyText}>
            Metti almeno un ingrediente per stanare le ricette!
          </Text>
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nessuna ricetta trovata. Prova un altro ingrediente.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  titleContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#92400E",
    marginTop: 4,
    lineHeight: 18,
    fontWeight: "500",
  },
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
  frigoSection: { paddingHorizontal: 20, marginBottom: 12 },
  inputContainer: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#1F2937",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  addButton: {
    backgroundColor: "#E07A5F",
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  tagsContainer: { flexDirection: "row", marginTop: 10 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  tagText: { fontSize: 13, fontWeight: "600", color: "#92400E" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#92400E", fontWeight: "600" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 40,
    gap: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#92400E",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 22,
  },
  list: { paddingHorizontal: 12, paddingBottom: 30 },
  row: { justifyContent: "space-between" },
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
