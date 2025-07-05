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

  React.useEffect(() => {
    fetchRecetas();
    fetchTipoRecetaOptions().then(setTipoOptions);
    fetchIngredienteOptions().then(setIngredienteOptions);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (filterType === "nombre") {
        if (searchValue.trim()) await fetchByNombre(searchValue.trim());
        else await fetchRecetas();
      } else if (filterType === "tipo") {
        if (searchValue) await fetchByTipo(searchValue);
      } else if (filterType === "ingrediente") {
        if (searchValue) await fetchByIngrediente(searchValue);
      } else if (filterType === "sin-ingrediente") {
        if (searchValue) await fetchSinIngrediente(searchValue);
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
        <Title>Inicio</Title>
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
