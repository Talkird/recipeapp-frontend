import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import Recipe from "@/components/Recipe";
import RecipeSearchBar from "@/components/RecipeSearchBar";
import { RecipeSearchFilterType } from "@/components/RecipeSearchBar.types";
import {
  fetchTipoRecetaOptions,
  fetchIngredienteOptions,
} from "@/utils/ingredientsAndTypes";
import { useRecetaStore } from "@/stores/recipes";
import { Row } from "@/components/ui/Row";
import { View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { ChevronDown } from "lucide-react-native";

export default function Index() {
  const recetas = useRecetaStore((state) => state.recetas);
  const fetchRecetas = useRecetaStore((state) => state.fetchRecetas);
  const fetchByNombre = useRecetaStore((state) => state.fetchByNombre);
  const fetchByTipo = useRecetaStore((state) => state.fetchByTipo);
  const fetchByIngrediente = useRecetaStore(
    (state) => state.fetchByIngrediente
  );
  const fetchSinIngrediente = useRecetaStore(
    (state) => state.fetchSinIngrediente
  );

  const [searchValue, setSearchValue] = React.useState("");
  const [filterType, setFilterType] =
    React.useState<RecipeSearchFilterType>("nombre");
  const [tipoOptions, setTipoOptions] = React.useState<string[]>([]);
  const [ingredienteOptions, setIngredienteOptions] = React.useState<string[]>(
    []
  );
  const [loading, setLoading] = React.useState(false);
  const [criterio, setCriterio] = React.useState<string>("nombre");
  const [orden, setOrden] = React.useState<string>("asc");

  React.useEffect(() => {
    fetchRecetas();
    fetchTipoRecetaOptions().then(setTipoOptions);
    fetchIngredienteOptions().then(setIngredienteOptions);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (filterType === "nombre") {
        if (searchValue.trim())
          await fetchByNombre(searchValue.trim(), criterio, orden);
        else await fetchRecetas();
      } else if (filterType === "tipo") {
        if (searchValue) await fetchByTipo(searchValue, criterio, orden);
      } else if (filterType === "ingrediente") {
        if (searchValue) await fetchByIngrediente(searchValue, criterio, orden);
      } else if (filterType === "sin-ingrediente") {
        if (searchValue)
          await fetchSinIngrediente(searchValue, criterio, orden);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset search value when filter type changes
  React.useEffect(() => {
    setSearchValue("");
  }, [filterType]);

  return (
    <ScrollView
      style={{ flex: 1, marginBottom: 32 }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Column
        style={{
          flex: 1,
          gap: 32,
          justifyContent: "flex-start",
          marginTop: 32,
        }}
      >
        <Row
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Title>Inicio</Title>
        </Row>
        <RecipeSearchBar
          value={searchValue}
          onChange={setSearchValue}
          filterType={filterType}
          onFilterTypeChange={(t) => setFilterType(t as RecipeSearchFilterType)}
          onSearch={handleSearch}
          tipoOptions={tipoOptions}
          ingredienteOptions={ingredienteOptions}
          loading={loading}
        />
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
              onValueChange={setCriterio}
              items={[
                { label: "Usuario", value: "usuario" },
                { label: "Antigüedad", value: "id" },
              ]}
              value={criterio}
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
              placeholder={{ label: "Criterio", value: "usuario" }}
              Icon={() => <ChevronDown size={20} color="#808080" />}
            />
          </View>
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
              onValueChange={setOrden}
              items={[
                { label: "Ascendente", value: "asc" },
                { label: "Descendente", value: "desc" },
              ]}
              value={orden}
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
              placeholder={{ label: "Orden", value: "asc" }}
              Icon={() => <ChevronDown size={20} color="#808080" />}
            />
          </View>
        </Row>
        {recetas.map((receta) => (
          <Recipe
            key={receta.idReceta}
            id={receta.idReceta}
            title={receta.nombreReceta}
            author={receta.usuario}
            cookTime={receta.duracion}
            servings={receta.cantidadPersonas}
            rating={receta.calificacion}
            imageUrl={receta.fotoPrincipal}
          />
        ))}
      </Column>
    </ScrollView>
  );
}
