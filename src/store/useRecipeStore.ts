import { create } from "zustand";

// Aggiorna il tipo includendo 'chimifazzu'
type AppMode = "random" | "frigo" | "stipi" | "chimifazzu";

interface RecipeState {
  mode: AppMode;
  ingredients: string[];
  selectedArea: string;
  setMode: (mode: AppMode) => void;
  addIngredient: (ing: string) => void;
  removeIngredient: (i: string) => void;
  setSelectedArea: (area: string) => void;
  resetFilters: () => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  mode: "random",
  ingredients: [],
  selectedArea: "",
  setMode: (mode) => set({ mode }),
  addIngredient: (ing) =>
    set((state) => {
      //Bug fix: when using a phone, ingredients often get capitalized and aren't recognized, since the API is case-sensitive.
      const cleanedIng = ing.trim().toLowerCase();

      return {
        ingredients: state.ingredients.includes(cleanedIng)
          ? state.ingredients
          : [...state.ingredients, cleanedIng],
      };
    }),
  removeIngredient: (ing) =>
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i !== ing),
    })),
  setSelectedArea: (area) => set({ selectedArea: area }),
  resetFilters: () => set({ selectedArea: "" }),
}));
