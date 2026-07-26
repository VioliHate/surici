import { create } from "zustand";

type AppMode = "random" | "frigo" | "stipi";

interface RecipeState {
  mode: AppMode;
  ingredients: string[];
  selectedArea: string; // Teniamo solo l'area dello "stipo"
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
    set((state) => ({
      ingredients: state.ingredients.includes(ing)
        ? state.ingredients
        : [...state.ingredients, ing],
    })),
  removeIngredient: (ing) =>
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i !== ing),
    })),
  setSelectedArea: (area) => set({ selectedArea: area }),
  resetFilters: () => set({ selectedArea: "" }),
}));
