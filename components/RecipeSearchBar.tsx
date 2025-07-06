import { Row } from "./ui/Row";
import { StyleSheet, View } from "react-native";
import { Search, ChevronDown } from "lucide-react-native";
import { TextInput } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { Button } from "./ui/Button";
import {
  RecipeSearchBarProps,
  RecipeSearchFilterType,
} from "./RecipeSearchBar.types";

const filterTypeLabels: Record<RecipeSearchFilterType, string> = {
  nombre: "Nombre",
  tipo: "Tipo",
  ingrediente: "Ingrediente",
  "sin-ingrediente": "Sin ingrediente",
};
function RecipeSearchBar(props: RecipeSearchBarProps) {
  const {
    value,
    onChange,
    filterType,
    onFilterTypeChange,
    onSearch,
    tipoOptions = [],
    ingredienteOptions = [],
    loading = false,
  } = props;

  // Dynamic placeholder based on filter type
  let placeholder = "Buscar recetas";
  if (filterType === "tipo") placeholder = "Buscar por tipo (ej: postre)";
  else if (filterType === "ingrediente")
    placeholder = "Buscar por ingrediente (ej: pollo)";
  else if (filterType === "sin-ingrediente")
    placeholder = "Sin ingrediente (ej: nuez)";

  return (
    <View style={{ width: "100%", alignItems: "center", gap: 8 }}>
      <Row style={styles.searchBar}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={"#808080"}
          style={{
            flex: 1,
            padding: 12,
            fontSize: 16,
            color: "#000",
          }}
          value={value}
          onChangeText={onChange}
          editable={!loading}
          onSubmitEditing={onSearch}
        />
        <Button style={styles.icon} onPress={onSearch}>
          Buscar
        </Button>
      </Row>
      <Row style={{ width: "80%", marginTop: 8, gap: 8 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#808080",
            overflow: "hidden",
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 8,
          }}
        >
          <RNPickerSelect
            onValueChange={onFilterTypeChange}
            items={[
              { label: "Nombre", value: "nombre" },
              { label: "Tipo", value: "tipo" },
              { label: "Ingrediente", value: "ingrediente" },
              { label: "Sin ingrediente", value: "sin-ingrediente" },
            ]}
            value={filterType}
            style={{
              inputIOS: {
                padding: 12,
                fontSize: 16,
                color: "#000",
                width: "100%",
              },
              viewContainer: { width: "100%" },
              placeholder: { color: "#808080" },
              iconContainer: {
                top: 0,
                right: 0,
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                width: 32,
              },
            }}
            doneText="Listo"
            placeholder={{ label: "Filtrar por...", value: "" }}
            Icon={() => <ChevronDown size={20} color="#808080" />}
          />
        </View>
      </Row>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    width: "80%",
    borderRadius: 24,
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 50,
    color: "#808080",
  },
});

export default RecipeSearchBar;
