import { create } from "zustand";

type AppMode = "random" | "frigo";

interface RecipeState {
  mode: AppMode;
  ingredients: string[];
  setMode: (mode: AppMode) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  mode: "random",
  ingredients: [],
  setMode: (mode) => set({ mode }),
  addIngredient: (ingredient) =>
    set((state) => ({
      ingredients: state.ingredients.includes(ingredient.trim().toLowerCase())
        ? state.ingredients
        : [...state.ingredients, ingredient.trim().toLowerCase()],
    })),
  removeIngredient: (ingredient) =>
    set((state) => ({
      ingredients: state.ingredients.filter((i) => i !== ingredient),
    })),
  clearIngredients: () => set({ ingredients: [] }),
}));
