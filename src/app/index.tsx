import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRecipeStore } from "../store/useRecipeStore";

// Components
import { ChiMiFazzu } from "../components/ChiMiFazzu";
import { HomeHeader } from "../components/HomeHeader";
import { IngredientSelector } from "../components/IngredientSelector";
import { ModeSelector } from "../components/ModeSelector";
import { RecipeCard } from "../components/RecipeCard";
import { StipiSelector } from "../components/StipiSelector";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);

  const {
    mode,
    ingredients,
    selectedArea,
    setMode,
    addIngredient,
    removeIngredient,
    setSelectedArea,
  } = useRecipeStore();

  useEffect(() => {
    if (mode === "chimifazzu") {
      setMeals([]);
      setLoading(false);
    } else {
      fetchRecipes();
    }
  }, [mode, ingredients, selectedArea]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);

      // --- 1. MODALITÀ: CASUALE ---
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
      }

      // --- 2. MODALITÀ: SVUOTA FRIGO ---
      else if (mode === "frigo") {
        if (ingredients.length === 0) {
          setMeals([]);
          setLoading(false);
          return;
        }

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

        if (ingredients.length === 1) {
          setMeals(data.meals);
          setLoading(false);
          return;
        }

        const filteredResults: Meal[] = [];
        await Promise.all(
          data.meals.map(async (shortMeal: Meal) => {
            try {
              const detailResponse = await fetch(
                `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${shortMeal.idMeal}`,
              );
              const detailData = await detailResponse.json();
              const fullMeal = detailData.meals?.[0];

              if (fullMeal) {
                const mealIngredients: string[] = [];
                for (let i = 1; i <= 20; i++) {
                  const ing = fullMeal[`strIngredient${i}`];
                  if (ing && ing.trim() !== "") {
                    mealIngredients.push(ing.trim().toLowerCase());
                  }
                }

                const containsAll = ingredients.every((searchIng) =>
                  mealIngredients.some((mealIng) =>
                    mealIng.includes(searchIng),
                  ),
                );

                if (containsAll) filteredResults.push(shortMeal);
              }
            } catch (err) {
              console.log("Errore filtraggio ricette:", err);
            }
          }),
        );
        setMeals(filteredResults);
      }

      // --- 3. MODALITÀ: STIPI NEL MONDO ---
      else if (mode === "stipi") {
        if (!selectedArea) {
          setMeals([]);
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`,
        );
        const data = await response.json();

        setMeals(data.meals || []);
      }
    } catch (error) {
      console.log("Errore API principale:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- ESTRAZIONE CASUALE JOLLY PER CHI MI FAZZU ---
  const handleChiMiFazzuExtract = async () => {
    try {
      setIsSpinning(true);
      setMeals([]);

      // Ritardo per simulare la slot machine
      await new Promise((resolve) => setTimeout(resolve, 900));

      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php",
      );
      const data = await response.json();

      if (data.meals?.[0]) {
        setMeals([data.meals[0]]);
      }
    } catch (error) {
      console.log("Errore estrazione Chi Mi Fazzu:", error);
    } finally {
      setIsSpinning(false);
    }
  };

  const handleNavigateToDetail = (id: string) => {
    router.push({
      pathname: "/recipe/[id]",
      params: { id },
    });
  };

  const handleAddIngredientsList = (newIngredients: string[]) => {
    newIngredients.forEach((ing) => addIngredient(ing));
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />

      <ModeSelector currentMode={mode} onModeChange={setMode} />

      {/* Sezione Frigo */}
      {mode === "frigo" && (
        <IngredientSelector
          ingredients={ingredients}
          onAddIngredients={handleAddIngredientsList}
          onRemoveIngredient={removeIngredient}
        />
      )}

      {/* Sezione Stipi nel Mondo */}
      {mode === "stipi" && (
        <StipiSelector
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
        />
      )}

      {/* Sezione Chi Mi Fazzu */}
      {mode === "chimifazzu" && (
        <ChiMiFazzu onSpin={handleChiMiFazzuExtract} isSpinning={isSpinning} />
      )}

      {loading || isSpinning ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#E07A5F' />
          <Text style={styles.loadingText}>
            {isSpinning
              ? "Surici sta mescolando il pentolone..."
              : "Surici sta lavorando per te..."}
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
      ) : mode === "stipi" && !selectedArea ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name='earth-outline'
            size={48}
            color='#92400E'
            opacity={0.5}
          />
          <Text style={styles.emptyText}>
            Seleziona uno Stato per aprire il suo stipo e scoprirne le ricette!
          </Text>
        </View>
      ) : mode === "chimifazzu" && meals.length === 0 ? null : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <RecipeCard item={item} onPress={handleNavigateToDetail} />
          )}
          numColumns={mode === "chimifazzu" ? 1 : 2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={mode === "chimifazzu" ? null : styles.row}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nessuna ricetta trovata. Prova a cambiare selezione.
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
});
