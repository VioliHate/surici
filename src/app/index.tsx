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
import { FilterSelector } from "../components/FilterSelector"; // Nuovo componente
import { HomeHeader } from "../components/HomeHeader";
import { IngredientSelector } from "../components/IngredientSelector";
import { ModeSelector } from "../components/ModeSelector";
import { RecipeCard } from "../components/RecipeCard";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    mode,
    ingredients,
    selectedCategory,
    selectedArea,
    setMode,
    addIngredient,
    removeIngredient,
    setSelectedCategory,
    setSelectedArea,
  } = useRecipeStore();

  useEffect(() => {
    fetchRecipes();
  }, [mode, ingredients, selectedCategory, selectedArea]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);

      // --- MODALITÀ: RANDOM ---
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

      // --- MODALITÀ: SVUOTA FRIGO ---
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

      // --- NUOVA MODALITÀ: FILTRI AVANZATI (CATEGORIA + AREA) ---
      else if (mode === "filtri") {
        if (!selectedCategory && !selectedArea) {
          // Se nessun filtro è selezionato, mostriamo un set vuoto o iniziale
          setMeals([]);
          setLoading(false);
          return;
        }

        let url = "";
        // Scegliamo l'endpoint principale in base a cosa ha selezionato l'utente
        if (selectedCategory) {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`;
        } else {
          url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!data.meals) {
          setMeals([]);
          setLoading(false);
          return;
        }

        // Se sono stati scelti ENTRAMBI i filtri, dobbiamo fare un controllo incrociato sui dettagli
        if (selectedCategory && selectedArea) {
          const crossFilteredResults: Meal[] = [];
          await Promise.all(
            data.meals.map(async (shortMeal: Meal) => {
              try {
                const detailResponse = await fetch(
                  `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${shortMeal.idMeal}`,
                );
                const detailData = await detailResponse.json();
                const fullMeal = detailData.meals?.[0];

                // Verifichiamo che corrisponda anche al secondo filtro (Area)
                if (fullMeal && fullMeal.strArea === selectedArea) {
                  crossFilteredResults.push(shortMeal);
                }
              } catch (err) {
                console.log("Errore filtri incrociati:", err);
              }
            }),
          );
          setMeals(crossFilteredResults);
        } else {
          // Se ne è stato selezionato solo uno dei due, i dati della prima chiamata bastano già
          setMeals(data.meals);
        }
      }
    } catch (error) {
      console.log("Errore API principale:", error);
    } finally {
      setLoading(false);
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

      {/* Selettore Frigo */}
      {mode === "frigo" && (
        <IngredientSelector
          ingredients={ingredients}
          onAddIngredients={handleAddIngredientsList}
          onRemoveIngredient={removeIngredient}
        />
      )}

      {/* Selettore Filtri avanzati */}
      {mode === "filtri" && (
        <FilterSelector
          selectedCategory={selectedCategory}
          selectedArea={selectedArea}
          onCategoryChange={setSelectedCategory}
          onAreaChange={setSelectedArea}
        />
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='large' color='#E07A5F' />
          <Text style={styles.loadingText}>Surici sta lavorando per te...</Text>
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
      ) : mode === "filtri" && !selectedCategory && !selectedArea ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name='options-outline'
            size={48}
            color='#92400E'
            opacity={0.5}
          />
          <Text style={styles.emptyText}>
            Seleziona una categoria o un'area geografica per filtrare i piatti!
          </Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <RecipeCard item={item} onPress={handleNavigateToDetail} />
          )}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nessuna ricetta trovata con questi filtri.
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
