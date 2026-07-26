import { Picker } from "@react-native-picker/picker"; // Se usi @react-native-picker/picker
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface FilterSelectorProps {
  selectedCategory: string;
  selectedArea: string;
  onCategoryChange: (category: string) => void;
  onAreaChange: (area: string) => void;
}

export function FilterSelector({
  selectedCategory,
  selectedArea,
  onCategoryChange,
  onAreaChange,
}: FilterSelectorProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilters() {
      try {
        const [catRes, areaRes] = await Promise.all([
          fetch("https://www.themealdb.com/api/json/v1/1/list.php?c=list"),
          fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list"),
        ]);
        const catData = await catRes.json();
        const areaData = await areaRes.json();

        setCategories(catData.meals.map((m: any) => m.strCategory));
        setAreas(areaData.meals.map((m: any) => m.strArea));
      } catch (err) {
        console.log("Errore caricamento filtri:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFilters();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size='small' color='#E07A5F' style={{ margin: 20 }} />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.pickerWrapper}>
        <Text style={styles.label}>Categoria</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => onCategoryChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label='Tutte le Categorie' value='' />
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.pickerWrapper}>
        <Text style={styles.label}>Paese / Area</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedArea}
            onValueChange={(itemValue) => onAreaChange(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label='Tutte le Aree' value='' />
            {areas.map((area) => (
              <Picker.Item key={area} label={area} value={area} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  pickerWrapper: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(31, 41, 55, 0.08)",
    overflow: "hidden",
  },
  picker: {
    height: 44,
    color: "#1F2937",
  },
});
