import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface IngredientSelectorProps {
  ingredients: string[];
  onAddIngredients: (ingredients: string[]) => void;
  onRemoveIngredient: (ingredient: string) => void;
}

export const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  ingredients,
  onAddIngredients,
  onRemoveIngredient,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = () => {
    if (inputText.trim() !== "") {
      const cleaned = inputText
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part !== "");

      onAddIngredients(cleaned);
      setInputText("");
    }
  };

  return (
    <View style={styles.frigoSection}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='Ingredienti in inglese (es: chicken, tomato)...'
          placeholderTextColor='#9CA3AF'
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSubmit}
        />
        <Pressable style={styles.addButton} onPress={handleSubmit}>
          <Ionicons name='add' size={24} color='#FFFFFF' />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagsContainer}
      >
        {ingredients.map((ing) => (
          <View key={ing} style={styles.tag}>
            <Text style={styles.tagText}>{ing}</Text>
            <Pressable onPress={() => onRemoveIngredient(ing)}>
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
  );
};

const styles = StyleSheet.create({
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
});
