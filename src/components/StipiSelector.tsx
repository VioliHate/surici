import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface StipiSelectorProps {
  selectedArea: string;
  onAreaChange: (area: string) => void;
}

export function StipiSelector({
  selectedArea,
  onAreaChange,
}: StipiSelectorProps) {
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAreas() {
      try {
        const response = await fetch(
          "https://www.themealdb.com/api/json/v1/1/list.php?a=list",
        );
        const data = await response.json();

        // Eliminiamo i duplicati nativi dell'API (es. Congolese) e tipizziamo come stringhe
        const uniqueAreas = Array.from(
          new Set(data.meals.map((m: any) => m.strArea as string)),
        );

        setAreas(uniqueAreas as string[]);
      } catch (err) {
        console.log("Errore caricamento aree:", err);
      } finally {
        setLoading(false);
      }
    }
    loadAreas();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size='small' color='#E07A5F' style={{ margin: 20 }} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Scegli lo Stipo nel Mondo</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedArea}
          onValueChange={(itemValue) => onAreaChange(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label='Seleziona un Paese...' value='' />
          {areas.map((area) => (
            <Picker.Item key={area} label={area} value={area} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(31, 41, 55, 0.08)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },
  picker: {
    height: 50,
    color: "#1F2937",
  },
});
