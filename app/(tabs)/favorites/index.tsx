import React, { useEffect, useState } from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import FavoriteRecipe from "@/components/FavoriteRecipe";
import Recipe from "@/components/Recipe";
import { useRouter } from "expo-router";
import { ScrollView, Button } from "react-native";
import { Row } from "@/components/ui/Row";
import { primary } from "@/utils/colors";
import { SmallText } from "@/components/ui/SmallText";

export default function Index() {
  const router = useRouter();
  const idUsuario = useUserStore((s) => s.idUsuario);
  const [favoritas, setFavoritas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"favoritos" | "mias" | "guardadas">(
    "favoritos"
  );
  // Placeholder for user's own recipes and saved recipes
  const [ownRecipes, setOwnRecipes] = useState<any[]>([]); // To be fetched from backend
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]); // To be fetched from backend
  // Fetch saved recipes for "Guardadas" tab
  useEffect(() => {
    if (!idUsuario) return;
    axios
      .get(`http://localhost:8080/api/recetas-guardadas/${idUsuario}`)
      .then((res) => {
        setSavedRecipes(res.data.recetas || res.data || []);
      })
      .catch(() => setSavedRecipes([]));
  }, [idUsuario]);

  const handleRemoveFavorite = async (recetaId: number) => {
    if (!idUsuario) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/recetas-favoritas/${idUsuario}/eliminar`,
        {
          data: recetaId,
          headers: { "Content-Type": "application/json" },
        }
      );
      setFavoritas((prev: any[]) =>
        prev.filter((r) => (r.idReceta || r.id) !== recetaId)
      );
    } catch (e) {
      alert("No se pudo eliminar de favoritos");
    }
  };

  // Fetch user's favorite recipes
  useEffect(() => {
    if (!idUsuario) return;
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/recetas-favoritas/${idUsuario}`)
      .then((res) => {
        setFavoritas(res.data.recetas || []);
      })
      .catch(() => setFavoritas([]))
      .finally(() => setLoading(false));
  }, [idUsuario]);

  // Fetch user's own created recipes for "Mis Recetas" tab using getRecetasByUsuarioId
  useEffect(() => {
    if (!idUsuario) return;
    axios
      .get(`http://localhost:8080/api/recetas/usuario/${idUsuario}`)
      .then((res) => {
        setOwnRecipes(res.data || []);
      })
      .catch(() => setOwnRecipes([]));
  }, [idUsuario]);

  return (
    <Column
      style={{
        flex: 1,
        gap: 32,
        justifyContent: "flex-start",
        marginTop: 32,
      }}
    >
      <Title>Recetas</Title>
      <Row style={{ gap: 12, marginBottom: 8 }}>
        <Button
          title="Favoritos"
          onPress={() => setTab("favoritos")}
          color={tab === "favoritos" ? primary : "#ccc"}
        />
        <Button
          title="Mis Recetas"
          onPress={() => setTab("mias")}
          color={tab === "mias" ? primary : "#ccc"}
        />
        <Button
          title="Guardadas"
          onPress={() => setTab("guardadas")}
          color={tab === "guardadas" ? primary : "#ccc"}
        />
      </Row>
      {tab === "favoritos" && (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 0,
            paddingTop: 8,
            justifyContent: "flex-start",
            alignItems: "stretch",
          }}
        >
          <Column
            style={{
              flex: 0,
              gap: 32,
              justifyContent: "flex-start",
              alignItems: "stretch",
            }}
          >
            {loading ? (
              <SmallText>Cargando...</SmallText>
            ) : favoritas.length === 0 ? (
              <SmallText>No tienes recetas guardadas.</SmallText>
            ) : (
              favoritas.map((receta: any) => (
                <FavoriteRecipe
                  key={receta.idReceta || receta.id}
                  id={receta.idReceta || receta.id}
                  title={receta.nombreReceta}
                  rating={receta.calificacion}
                  author={receta.usuario?.nickname || receta.usuario || ""}
                  cookTime={receta.duracion}
                  servings={receta.cantidadPersonas}
                  imageUrl={receta.fotoPrincipal}
                  onRemove={handleRemoveFavorite}
                  onPress={() =>
                    router.push(`/home/recipe/${receta.idReceta || receta.id}`)
                  }
                />
              ))
            )}
          </Column>
        </ScrollView>
      )}
      {tab === "mias" && (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 0,
            paddingTop: 8,
            justifyContent: "flex-start",
            alignItems: "stretch",
          }}
        >
          <Column
            style={{
              flex: 0,
              gap: 32,
              justifyContent: "flex-start",
              alignItems: "stretch",
            }}
          >
            {ownRecipes.length === 0 ? (
              <SmallText>No has creado recetas aún.</SmallText>
            ) : (
              ownRecipes.map((receta: any) => (
                <Recipe
                  key={receta.idReceta || receta.id}
                  id={receta.idReceta || receta.id}
                  title={receta.nombreReceta}
                  rating={receta.calificacion}
                  cookTime={receta.duracion}
                  servings={receta.cantidadPersonas}
                  imageUrl={receta.fotoPrincipal}
                  style={{ width: "90%", alignSelf: "center" }}
                />
              ))
            )}
          </Column>
        </ScrollView>
      )}
      {tab === "guardadas" && (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 0,
            paddingTop: 8,
            justifyContent: "flex-start",
            alignItems: "stretch",
          }}
        >
          <Column
            style={{
              flex: 0,
              gap: 32,
              justifyContent: "flex-start",
              alignItems: "stretch",
            }}
          >
            {savedRecipes.length === 0 ? (
              <SmallText>No tienes recetas guardadas.</SmallText>
            ) : (
              savedRecipes.map((receta: any) => (
                <FavoriteRecipe
                  key={receta.idReceta || receta.id}
                  id={receta.idReceta || receta.id}
                  title={receta.nombreReceta}
                  rating={receta.calificacion}
                  author={receta.usuario?.nickname || receta.usuario || ""}
                  cookTime={receta.duracion}
                  servings={receta.cantidadPersonas}
                  imageUrl={receta.fotoPrincipal}
                  onRemove={() => {}}
                  onPress={() =>
                    router.push(`/home/recipe/${receta.idReceta || receta.id}`)
                  }
                />
              ))
            )}
          </Column>
        </ScrollView>
      )}
    </Column>
  );
}
