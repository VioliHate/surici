import { create } from "zustand";

type FilterMode = "random" | "frigo" | "filtri";

interface RecipeState {
  mode: FilterMode;
  ingredients: string[];
  selectedCategory: string;
  selectedArea: string;
  setMode: (mode: FilterMode) => void;
  addIngredient: (ing: string) => void;
  removeIngredient: (ing: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedArea: (area: string) => void;
  resetFilters: () => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  mode: "random",
  ingredients: [],
  selectedCategory: "",
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
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedArea: (area) => set({ selectedArea: area }),
  resetFilters: () => set({ selectedCategory: "", selectedArea: "" }),
}));
