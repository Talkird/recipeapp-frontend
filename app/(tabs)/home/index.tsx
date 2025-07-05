import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import Recipe from "@/components/Recipe";
import SearchBar from "@/components/SearchBar";
import { useRecetaStore } from "@/stores/recipes";
export default function Index() {
  const recetas = useRecetaStore((state) => state.recetas);
  const fetchRecetas = useRecetaStore((state) => state.fetchRecetas);

  useEffect(() => {
    fetchRecetas();
  }, []);

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
        <SearchBar />

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
