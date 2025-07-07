import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  View,
  Modal,
  TextInput,
} from "react-native";
import {
  Heart,
  Bookmark,
  Calculator,
  Plus,
  Minus,
  ChevronDown,
} from "lucide-react-native";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { useEffect, useState } from "react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import axios from "axios";
import { Image } from "expo-image";
import { primary } from "@/utils/colors";
import { Timer, Users } from "lucide-react-native";
import { Star, StarHalf } from "lucide-react-native";
import { Row } from "@/components/ui/Row";
import { StyleSheet } from "react-native";
import { API_URLS } from "@/lib/constants";
import Comment from "@/components/Comment";
import { useUserStore } from "@/stores/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Comment {
  rating: number;
  text: string;
  author: string;
}

interface Ingredient {
  name: string;
  amount: string;
}

// Types matching backend response for receta detail
interface UnidadDTO {
  idUnidad: number;
  descripcion: string;
}

interface IngredienteDTO {
  idIngrediente: number;
  nombre: string;
}

interface UtilizadoDTO {
  idUtilizado: number;
  ingrediente: IngredienteDTO;
  cantidad: number;
  observaciones?: string;
  idReceta: number;
  unidad?: UnidadDTO;
}

interface MultimediaPasoDTO {
  idContenido: number;
  idPaso: number;
  tipoContenido: string;
  extension: string;
  urlContenido: string;
}

interface PasoDTO {
  idPaso: number;
  idReceta: number;
  nroPaso: number;
  texto: string;
  multimedia?: MultimediaPasoDTO[];
}

interface FotoDTO {
  id: number;
  urlFoto: string;
  extension: string;
}

interface RecetaDTO {
  id: number;
  nombreReceta: string;
  descripcionReceta: string;
  tipoReceta: string;
  porciones: number;
  pasos: PasoDTO[];
  utilizados: UtilizadoDTO[];
  fotos: FotoDTO[];
  usuario: string;
  calificacion: number;
  cantidadPersonas: number;
  duracion: number;
  fotoPrincipal: string;
}

interface CalificacionDTO {
  idCalificacion: number;
  usuarioNickname: string;
  idReceta: number;
  calificacion: number;
  comentarios: string;
}

interface CalificacionRequest {
  idUsuario: number;
  idReceta: number;
  calificacion: number;
  comentarios: string;
}

interface AdjustedIngredient extends UtilizadoDTO {
  adjustedAmount: number;
}

interface SavedAdjustedRecipe {
  id: string;
  originalId: number;
  name: string;
  multiplier: number;
  adjustedDate: string;
  adjustedIngredients: AdjustedIngredient[];
  originalPorciones: number;
  adjustedPorciones: number;
}

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [receta, setReceta] = useState<RecetaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const idUsuario = useUserStore((s) => s.idUsuario);
  const isGuest = useUserStore((s) => s.isGuest);

  useEffect(() => {
    if (id) {
      // Check if this is an adjusted recipe ID (format: originalId_timestamp)
      const idString = Array.isArray(id) ? id[0] : id;
      if (idString?.includes("_")) {
        // This is an adjusted recipe
        loadAdjustedRecipe(idString);
      } else {
        // This is a regular recipe
        setIsViewingAdjustedRecipe(false);
        setAdjustedRecipeData(null);
        axios
          .get(`http://localhost:8080/api/recetas/${id}`)
          .then((res) => setReceta(res.data))
          .finally(() => setLoading(false));
      }
    }
  }, [id]);

  // Load adjusted recipe from local storage
  const loadAdjustedRecipe = async (adjustedId: string) => {
    try {
      const savedRecipes = await AsyncStorage.getItem("savedAdjustedRecipes");
      if (savedRecipes) {
        const recipes: SavedAdjustedRecipe[] = JSON.parse(savedRecipes);
        const adjustedRecipe = recipes.find((r) => r.id === adjustedId);

        if (adjustedRecipe) {
          setAdjustedRecipeData(adjustedRecipe);
          setIsViewingAdjustedRecipe(true);
          setPortionMultiplier(adjustedRecipe.multiplier);
          setAdjustedIngredients(adjustedRecipe.adjustedIngredients);
          setHasAdjustments(true);

          // Load the original recipe data
          axios
            .get(
              `http://localhost:8080/api/recetas/${adjustedRecipe.originalId}`
            )
            .then((res) => setReceta(res.data))
            .finally(() => setLoading(false));
        } else {
          // Adjusted recipe not found, redirect to original
          const originalId = adjustedId.split("_")[0];
          axios
            .get(`http://localhost:8080/api/recetas/${originalId}`)
            .then((res) => setReceta(res.data))
            .finally(() => setLoading(false));
        }
      }
    } catch (error) {
      console.error("Error loading adjusted recipe:", error);
      setLoading(false);
    }
  };

  const [addingFavorite, setAddingFavorite] = useState(false);
  // Rating state
  const [userRating, setUserRating] = useState<number>(0);
  const [userComment, setUserComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [comments, setComments] = useState<CalificacionDTO[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  // Fetch comments for this recipe
  useEffect(() => {
    if (!receta?.id) return;
    setLoadingComments(true);
    axios
      .get(
        `http://localhost:8080/calificaciones/receta/autorizados/${receta.id}`
      )
      .then((res) => setComments(res.data || []))
      .catch(() => setComments([]))
      .finally(() => setLoadingComments(false));
  }, [receta?.id]);

  // Photo gallery state
  const [showPhotoGallery, setShowPhotoGallery] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Proportion adjustment state
  const [portionMultiplier, setPortionMultiplier] = useState(1);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [customPortions, setCustomPortions] = useState("");
  const [adjustedIngredients, setAdjustedIngredients] = useState<
    AdjustedIngredient[]
  >([]);
  const [hasAdjustments, setHasAdjustments] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<number>(-1);
  const [ingredientAmount, setIngredientAmount] = useState("");
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [isViewingAdjustedRecipe, setIsViewingAdjustedRecipe] = useState(false);
  const [adjustedRecipeData, setAdjustedRecipeData] =
    useState<SavedAdjustedRecipe | null>(null);

  // Update adjusted ingredients when multiplier changes
  useEffect(() => {
    if (receta && portionMultiplier !== 1) {
      const adjusted = receta.utilizados.map((ing) => ({
        ...ing,
        adjustedAmount: ing.cantidad * portionMultiplier,
      }));
      setAdjustedIngredients(adjusted);
      setHasAdjustments(true);
    } else {
      setAdjustedIngredients([]);
      setHasAdjustments(false);
    }
  }, [portionMultiplier, receta]);

  // Portion adjustment functions
  const adjustPortions = (multiplier: number) => {
    setPortionMultiplier(multiplier);
    setShowAdjustModal(false);
  };

  const handleCustomPortions = () => {
    const customValue = parseFloat(customPortions);
    if (customValue > 0 && receta) {
      const multiplier = customValue / receta.cantidadPersonas;
      setPortionMultiplier(multiplier);
      setCustomPortions("");
      setShowAdjustModal(false);
    }
  };

  const handleIngredientAdjustment = () => {
    const newAmount = parseFloat(ingredientAmount);
    if (newAmount > 0 && receta && selectedIngredient >= 0) {
      const originalAmount = receta.utilizados[selectedIngredient].cantidad;
      const multiplier = newAmount / originalAmount;
      setPortionMultiplier(multiplier);
      setIngredientAmount("");
      setSelectedIngredient(-1);
      setShowAdjustModal(false);
    }
  };

  const resetPortions = () => {
    setPortionMultiplier(1);
    setHasAdjustments(false);
  };

  // Save adjusted recipe locally
  const saveAdjustedRecipe = async () => {
    if (!receta || !hasAdjustments) return;

    try {
      const savedRecipes = await AsyncStorage.getItem("savedAdjustedRecipes");
      const recipes: SavedAdjustedRecipe[] = savedRecipes
        ? JSON.parse(savedRecipes)
        : [];

      // Remove oldest if we have 10 already
      if (recipes.length >= 10) {
        recipes.shift();
      }

      const newAdjustedRecipe: SavedAdjustedRecipe = {
        id: `${receta.id}_${Date.now()}`,
        originalId: receta.id,
        name: `${receta.nombreReceta} (x${portionMultiplier.toFixed(1)})`,
        multiplier: portionMultiplier,
        adjustedDate: new Date().toISOString(),
        adjustedIngredients,
        originalPorciones: receta.cantidadPersonas,
        adjustedPorciones: Math.round(
          receta.cantidadPersonas * portionMultiplier
        ),
      };

      recipes.push(newAdjustedRecipe);
      await AsyncStorage.setItem(
        "savedAdjustedRecipes",
        JSON.stringify(recipes)
      );

      Alert.alert("¡Guardado!", "Receta ajustada guardada localmente");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la receta ajustada");
    }
  };
  // Submit or update rating
  const handleSubmitRating = async () => {
    if (!idUsuario || !receta) return;
    setSubmittingRating(true);
    try {
      const req: CalificacionRequest = {
        idUsuario,
        idReceta: receta.id,
        calificacion: userRating,
        comentarios: userComment,
      };
      const res = await axios.post(
        `http://localhost:8080/calificaciones/actualizar-calificacion`,
        req,
        { headers: { "Content-Type": "application/json" } }
      );
      // Optionally update average rating in UI
      setReceta((prev) => (prev ? { ...prev, calificacion: res.data } : prev));
      setUserComment("");
      setUserRating(0);
      // Refetch comments
      axios
        .get(
          `http://localhost:8080/calificaciones/receta/autorizados/${receta.id}`
        )
        .then((res) => setComments(res.data || []));
      Alert.alert("¡Gracias!", "Tu calificación fue enviada.");
    } catch (e) {
      Alert.alert("Error", "No se pudo enviar la calificación");
    } finally {
      setSubmittingRating(false);
    }
  };
  const handleAddFavorite = async () => {
    if (!idUsuario || !receta) return;
    setAddingFavorite(true);
    try {
      console.log("Sending recetaId as raw number:", receta.id);
      await axios.post(
        `http://localhost:8080/api/recetas-favoritas/${idUsuario}/agregar`,
        receta.id,
        { headers: { "Content-Type": "application/json" } }
      );
      Alert.alert("Favorito", "Receta agregada a favoritos");
    } catch (e) {
      Alert.alert("Error", "No se pudo agregar a favoritos");
    } finally {
      setAddingFavorite(false);
    }
  };

  if (loading || !receta) {
    return <SmallText>Cargando...</SmallText>;
  }

  return (
    <ScrollView>
      <Image
        source={receta.fotoPrincipal}
        style={{ width: "100%", height: 250 }}
      />
      {!isViewingAdjustedRecipe && !isGuest && (
        <TouchableOpacity
          style={{ position: "absolute", top: 16, left: 16 }}
          onPress={handleAddFavorite}
          disabled={addingFavorite}
        >
          <Heart color={primary} fill={primary} size={32} />
        </TouchableOpacity>
      )}

      {hasAdjustments && !isViewingAdjustedRecipe && !isGuest && (
        <TouchableOpacity
          style={{ position: "absolute", top: 16, left: 60 }}
          onPress={saveAdjustedRecipe}
        >
          <Bookmark color={primary} fill={primary} size={32} />
        </TouchableOpacity>
      )}

      {!isViewingAdjustedRecipe && !isGuest && (
        <TouchableOpacity
          style={{ position: "absolute", top: 16, right: 16 }}
          onPress={() => setShowAdjustModal(true)}
        >
          <Calculator color={primary} fill="white" size={32} />
        </TouchableOpacity>
      )}

      <Column style={{ padding: 16, gap: 32 }}>
        <Title>{receta.nombreReceta}</Title>
        <Row
          style={{
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <SmallText style={{ fontFamily: "DMSans_500Medium" }}>
            Por {receta.usuario}
          </SmallText>
          <Row style={{ gap: 2, alignItems: "center" }}>
            {[...Array(5)].map((_, i) => {
              const rating = receta.calificacion || 0;
              const isSelected = i < Math.floor(rating);
              const isHalf = i === Math.floor(rating) && rating % 1 >= 0.5;
              return isHalf ? (
                <StarHalf key={i} color={primary} fill={primary} size={20} />
              ) : (
                <Star
                  key={i}
                  color={isSelected ? primary : "#D9D9D9"}
                  fill={isSelected ? primary : "none"}
                  size={20}
                />
              );
            })}
          </Row>
          {/* ...existing code... */}
        </Row>

        <Row
          style={{
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Row style={{ gap: 6 }}>
            <Timer style={styles.icon} />
            <SmallText style={styles.iconText}>{receta.duracion}'</SmallText>
          </Row>
          <Row style={{ gap: 6 }}>
            <Users style={styles.icon} />
            <SmallText style={styles.iconText}>
              {hasAdjustments
                ? `${Math.round(
                    receta.cantidadPersonas * portionMultiplier
                  )} personas`
                : `${receta.cantidadPersonas} personas`}
            </SmallText>
            {hasAdjustments && (
              <SmallText
                style={{ ...styles.iconText, color: primary, fontSize: 14 }}
              >
                (x{portionMultiplier.toFixed(1)})
              </SmallText>
            )}
          </Row>
        </Row>

        <SubTitle>{receta.descripcionReceta}</SubTitle>

        {/* Ingredientes con unidad y observaciones */}
        <Column style={{ gap: 12, alignItems: "flex-start", width: "100%" }}>
          <Row
            style={{
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <SubTitle>Ingredientes</SubTitle>
            {hasAdjustments && !isViewingAdjustedRecipe && (
              <TouchableOpacity onPress={resetPortions}>
                <SmallText style={{ color: primary, fontWeight: "bold" }}>
                  Restablecer
                </SmallText>
              </TouchableOpacity>
            )}
            {isViewingAdjustedRecipe && adjustedRecipeData && (
              <SmallText
                style={{ color: primary, fontWeight: "bold", fontSize: 14 }}
              >
                Ajustado x{adjustedRecipeData.multiplier.toFixed(1)}
              </SmallText>
            )}
          </Row>
          {(hasAdjustments ? adjustedIngredients : receta.utilizados).map(
            (ing, idx) => (
              <Row
                key={idx}
                style={{
                  justifyContent: "flex-start",
                  width: "100%",
                  gap: 12,
                  backgroundColor: hasAdjustments ? "#fff4e6" : "#f8f8f8",
                  borderRadius: 8,
                  padding: 8,
                  borderWidth: hasAdjustments ? 1 : 0,
                  borderColor: hasAdjustments ? primary : "transparent",
                }}
              >
                <SmallText
                  style={{ textAlign: "left", flex: 2, fontWeight: "bold" }}
                >
                  {ing.ingrediente?.nombre}
                </SmallText>
                <SmallText
                  style={{
                    textAlign: "left",
                    flex: 1,
                    color: hasAdjustments ? primary : "#000",
                    fontWeight: hasAdjustments ? "bold" : "normal",
                  }}
                >
                  {hasAdjustments
                    ? `${(ing as AdjustedIngredient).adjustedAmount.toFixed(
                        1
                      )} ${ing.unidad?.descripcion || ""}`
                    : `${ing.cantidad} ${ing.unidad?.descripcion || ""}`}
                </SmallText>
                {ing.observaciones && (
                  <SmallText
                    style={{ textAlign: "left", flex: 2, color: "#888" }}
                  >
                    {ing.observaciones}
                  </SmallText>
                )}
              </Row>
            )
          )}
        </Column>

        {/* Procedimiento con multimedia */}
        <Column style={{ alignItems: "flex-start", gap: 16, width: "100%" }}>
          <SubTitle>Procedimiento</SubTitle>
          {receta.pasos.map((paso, idx) => (
            <Column
              key={idx}
              style={{
                gap: 6,
                width: "100%",
                backgroundColor: "#f3f3f3",
                borderRadius: 8,
                padding: 10,
              }}
            >
              <SmallText style={{ fontWeight: "bold", fontSize: 16 }}>
                Paso {paso.nroPaso}:
              </SmallText>
              <SmallText style={{ textAlign: "left", fontSize: 15 }}>
                {paso.texto}
              </SmallText>
              {paso.multimedia && paso.multimedia.length > 0 && (
                <ScrollView horizontal style={{ marginTop: 6 }}>
                  {paso.multimedia.map(
                    (media: MultimediaPasoDTO, mIdx: number) => (
                      <Image
                        key={mIdx}
                        source={media.urlContenido}
                        style={{
                          width: 120,
                          height: 80,
                          borderRadius: 6,
                          marginRight: 8,
                        }}
                      />
                    )
                  )}
                </ScrollView>
              )}
            </Column>
          ))}
        </Column>

        {/* Galería de Fotos Secundarias */}
        {receta.fotos && receta.fotos.length > 1 && (
          <Column style={{ alignItems: "flex-start", gap: 16, width: "100%" }}>
            <SubTitle>📸 Galería de Fotos</SubTitle>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ width: "100%" }}
              contentContainerStyle={{ paddingHorizontal: 8 }}
            >
              {receta.fotos.map((foto, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setSelectedPhotoIndex(idx);
                    setShowPhotoGallery(true);
                  }}
                  style={{
                    marginRight: 12,
                    borderRadius: 12,
                    overflow: "hidden",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <Image
                    source={foto.urlFoto}
                    style={{
                      width: 150,
                      height: 110,
                      borderRadius: 12,
                    }}
                    contentFit="cover"
                  />
                  {idx === 0 && (
                    <View
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        backgroundColor: primary,
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                      }}
                    >
                      <SmallText
                        style={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 10,
                        }}
                      >
                        Principal
                      </SmallText>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <SmallText
              style={{
                textAlign: "center",
                color: "#666",
                fontSize: 12,
                width: "100%",
              }}
            >
              Toca una foto para verla en pantalla completa
            </SmallText>
          </Column>
        )}

        {/* Comentario y calificación debajo de procedimiento - Solo para recetas originales y usuarios autenticados */}
        {!isViewingAdjustedRecipe && !isGuest && (
          <>
            <Column
              style={{
                gap: 12,
                alignItems: "flex-start",
                width: "100%",
                marginTop: 32,
              }}
            >
              <SubTitle>Deja tu comentario</SubTitle>
              <Row style={{ gap: 8 }}>
                {[1, 2, 3, 4, 5].map((val) => {
                  // All stars gray by default, fill up to userRating with primary
                  const isSelected = val <= userRating;
                  return (
                    <TouchableOpacity
                      key={val}
                      onPress={() => setUserRating(val)}
                      disabled={submittingRating}
                      style={{
                        backgroundColor: isSelected ? "#fffbe6" : "transparent",
                        borderRadius: 16,
                        padding: 2,
                      }}
                    >
                      <Star
                        color={isSelected ? primary : "#E0E0E0"}
                        fill={isSelected ? primary : "#E0E0E0"}
                        size={28}
                      />
                    </TouchableOpacity>
                  );
                })}
              </Row>
              <Input
                placeholder="Deja un comentario (opcional)"
                value={userComment}
                onChangeText={setUserComment}
                style={{ width: "100%" }}
              />
              <Button
                onPress={handleSubmitRating}
                disabled={submittingRating || userRating === 0}
              >
                {submittingRating ? "Enviando..." : "Enviar calificación"}
              </Button>
            </Column>

            {/* Sección de comentarios debajo del input */}
            <Column
              style={{ gap: 12, alignItems: "flex-start", width: "100%" }}
            >
              <SubTitle>Comentarios</SubTitle>
              {loadingComments ? (
                <SmallText>Cargando comentarios...</SmallText>
              ) : comments.length === 0 ? (
                <SmallText>No hay comentarios aún.</SmallText>
              ) : (
                comments.map((c) => (
                  <Comment
                    key={c.idCalificacion}
                    rating={c.calificacion}
                    text={c.comentarios}
                    author={c.usuarioNickname}
                  />
                ))
              )}
            </Column>
          </>
        )}

        {/* Información de receta ajustada */}
        {isViewingAdjustedRecipe && adjustedRecipeData && (
          <Column
            style={{
              gap: 12,
              alignItems: "center",
              width: "100%",
              marginTop: 32,
              padding: 16,
              backgroundColor: "#fff4e6",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: primary,
            }}
          >
            <SmallText
              style={{ fontWeight: "bold", fontSize: 16, color: primary }}
            >
              📋 Receta Ajustada
            </SmallText>
            <SmallText style={{ textAlign: "center", color: "#666" }}>
              Esta es una versión guardada con proporciones ajustadas (x
              {adjustedRecipeData.multiplier.toFixed(1)})
            </SmallText>
            <SmallText
              style={{ textAlign: "center", color: "#888", fontSize: 12 }}
            >
              Guardada el{" "}
              {new Date(adjustedRecipeData.adjustedDate).toLocaleDateString()}
            </SmallText>
            <SmallText
              style={{ textAlign: "center", color: "#888", fontSize: 12 }}
            >
              Para comentar o calificar, visitá la receta original
            </SmallText>
          </Column>
        )}

        {/* Mensaje para usuarios invitados */}
        {isGuest && (
          <Column
            style={{
              gap: 12,
              alignItems: "center",
              width: "100%",
              marginTop: 32,
              padding: 16,
              backgroundColor: "#fff4e6",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: primary,
            }}
          >
            <SmallText
              style={{ fontWeight: "bold", fontSize: 16, color: primary }}
            >
              👤 Modo Invitado
            </SmallText>
            <SmallText style={{ textAlign: "center", color: "#666" }}>
              Para ajustar porciones, guardar favoritos y dejar comentarios,
              necesitás crear una cuenta o iniciar sesión.
            </SmallText>
            <TouchableOpacity
              onPress={() => {
                useUserStore.getState().setGuestMode(false);
                router.replace("/login");
              }}
              style={{
                backgroundColor: primary,
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
            >
              <SmallText style={{ color: "white", fontWeight: "bold" }}>
                Iniciar Sesión
              </SmallText>
            </TouchableOpacity>
          </Column>
        )}
      </Column>

      {/* Portion Adjustment Modal */}
      <Modal
        visible={showAdjustModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAdjustModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
            >
              <Column style={{ gap: 16, width: "100%", alignItems: "center" }}>
                <Title style={{ textAlign: "center", marginBottom: 10 }}>
                  Ajustar Porciones
                </Title>

                <SmallText style={{ textAlign: "center", fontSize: 16 }}>
                  Receta original: {receta?.cantidadPersonas} personas
                </SmallText>

                {/* Quick options */}
                <Row style={{ justifyContent: "space-around", width: "100%" }}>
                  <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => adjustPortions(0.5)}
                  >
                    <SmallText style={styles.quickButtonText}>1/2</SmallText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => adjustPortions(1)}
                  >
                    <SmallText style={styles.quickButtonText}>
                      Original
                    </SmallText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.quickButton}
                    onPress={() => adjustPortions(2)}
                  >
                    <SmallText style={styles.quickButtonText}>x2</SmallText>
                  </TouchableOpacity>
                </Row>

                {/* Custom portions */}
                <Column style={{ gap: 8, width: "100%" }}>
                  <SmallText style={{ fontWeight: "bold" }}>
                    Porciones personalizadas:
                  </SmallText>
                  <Row
                    style={{
                      gap: 6,
                      alignItems: "center",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <TextInput
                      style={styles.customInput}
                      placeholder="Ej: 6"
                      value={customPortions}
                      onChangeText={setCustomPortions}
                      keyboardType="numeric"
                    />
                    <SmallText>personas</SmallText>
                    <TouchableOpacity
                      style={styles.smallButton}
                      onPress={handleCustomPortions}
                      disabled={!customPortions}
                    >
                      <SmallText style={styles.smallButtonText}>
                        Aplicar
                      </SmallText>
                    </TouchableOpacity>
                  </Row>
                </Column>

                {/* Individual ingredient adjustment */}
                <Column style={{ gap: 8, width: "100%" }}>
                  <SmallText style={{ fontWeight: "bold" }}>
                    Ajustar por ingrediente:
                  </SmallText>
                  <TouchableOpacity
                    style={styles.ingredientSelector}
                    onPress={() => setShowIngredientModal(true)}
                  >
                    <SmallText style={styles.ingredientSelectorText}>
                      {selectedIngredient >= 0 && receta
                        ? `${
                            receta.utilizados[selectedIngredient].ingrediente
                              ?.nombre
                          } (${
                            receta.utilizados[selectedIngredient].cantidad
                          } ${
                            receta.utilizados[selectedIngredient].unidad
                              ?.descripcion || ""
                          })`
                        : "Selecciona ingrediente..."}
                    </SmallText>
                    <ChevronDown color="#666" size={16} />
                  </TouchableOpacity>
                  {selectedIngredient >= 0 && (
                    <Row
                      style={{
                        gap: 6,
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <TextInput
                        style={styles.customInputSmall}
                        placeholder="Cantidad"
                        value={ingredientAmount}
                        onChangeText={setIngredientAmount}
                        keyboardType="numeric"
                      />
                      <SmallText style={{ fontSize: 12 }}>
                        {receta?.utilizados[selectedIngredient]?.unidad
                          ?.descripcion || ""}
                      </SmallText>
                      <TouchableOpacity
                        style={styles.smallButton}
                        onPress={handleIngredientAdjustment}
                        disabled={!ingredientAmount}
                      >
                        <SmallText style={styles.smallButtonText}>
                          Ajustar
                        </SmallText>
                      </TouchableOpacity>
                    </Row>
                  )}
                </Column>

                <SmallText
                  style={{
                    textAlign: "center",
                    color: "#888",
                    fontSize: 12,
                    paddingHorizontal: 16,
                    lineHeight: 16,
                  }}
                >
                  Todos los ingredientes se ajustarán proporcionalmente
                </SmallText>

                <Button onPress={() => setShowAdjustModal(false)}>
                  Cerrar
                </Button>
              </Column>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Ingredient Selection Modal */}
      <Modal
        visible={showIngredientModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowIngredientModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ingredientModalContent}>
            <SmallText
              style={{ fontWeight: "bold", fontSize: 16, marginBottom: 16 }}
            >
              Selecciona un ingrediente
            </SmallText>
            <ScrollView style={{ maxHeight: 300, width: "100%" }}>
              {receta?.utilizados && receta.utilizados.length > 0 ? (
                receta.utilizados.map((ing, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.ingredientOption,
                      selectedIngredient === idx &&
                        styles.ingredientOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedIngredient(idx);
                      setShowIngredientModal(false);
                    }}
                  >
                    <SmallText
                      style={{
                        ...styles.ingredientOptionText,
                        ...(selectedIngredient === idx &&
                          styles.ingredientOptionTextSelected),
                      }}
                    >
                      {ing.ingrediente?.nombre || "Ingrediente sin nombre"}
                    </SmallText>
                    <SmallText
                      style={{
                        ...styles.ingredientOptionAmount,
                        ...(selectedIngredient === idx &&
                          styles.ingredientOptionAmountSelected),
                      }}
                    >
                      {ing.cantidad} {ing.unidad?.descripcion || "unidad"}
                    </SmallText>
                  </TouchableOpacity>
                ))
              ) : (
                <SmallText
                  style={{
                    textAlign: "center",
                    color: "#666",
                    marginVertical: 20,
                  }}
                >
                  No hay ingredientes disponibles para ajustar
                </SmallText>
              )}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setShowIngredientModal(false)}
            >
              <SmallText style={styles.closeModalButtonText}>Cerrar</SmallText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Photo Gallery Modal */}
      <Modal
        visible={showPhotoGallery}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoGallery(false)}
      >
        <View style={styles.photoGalleryOverlay}>
          <TouchableOpacity
            style={styles.closePhotoButton}
            onPress={() => setShowPhotoGallery(false)}
          >
            <SmallText style={styles.closePhotoButtonText}>✕</SmallText>
          </TouchableOpacity>

          {receta?.fotos && receta.fotos.length > 0 && (
            <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                  const index = Math.round(
                    event.nativeEvent.contentOffset.x /
                      event.nativeEvent.layoutMeasurement.width
                  );
                  setSelectedPhotoIndex(index);
                }}
                contentOffset={{ x: selectedPhotoIndex * 350, y: 0 }}
                style={{ width: "100%" }}
              >
                {receta.fotos.map((foto, idx) => (
                  <View
                    key={idx}
                    style={{
                      width: 350,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={foto.urlFoto}
                      style={{
                        width: "95%",
                        height: "60%",
                        borderRadius: 12,
                      }}
                      contentFit="contain"
                    />
                  </View>
                ))}
              </ScrollView>

              {/* Photo indicators */}
              <View style={styles.photoIndicators}>
                {receta.fotos.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.photoIndicator,
                      idx === selectedPhotoIndex && styles.photoIndicatorActive,
                    ]}
                  />
                ))}
              </View>

              {/* Photo counter */}
              <View style={styles.photoCounter}>
                <SmallText style={styles.photoCounterText}>
                  {selectedPhotoIndex + 1} de {receta.fotos.length}
                  {selectedPhotoIndex === 0 && " (Principal)"}
                </SmallText>
              </View>
            </>
          )}
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: 75,
    borderRadius: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    flexDirection: "row",

    justifyContent: "space-between",
    padding: 0,

    backgroundColor: "#FFFFFF",
  },
  image: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: 75,
    height: 75,
    alignSelf: "flex-start",
    marginLeft: 0,
    marginRight: 0,
  },
  iconText: {
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
    fontSize: 18,
    color: "#000000",
    opacity: 0.8,
  },
  icon: {
    width: 16,
    height: 16,
    color: "#000000",
    opacity: 0.9,
  },
  star: {
    width: 20,
    height: 20,
    color: primary,
  },
  starEmpty: {
    width: 20,
    height: 20,
    color: "#D9D9D9",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    maxHeight: "90%",
    alignItems: "center",
  },
  quickButton: {
    backgroundColor: primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 70,
    alignItems: "center",
  },
  quickButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  customInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    width: 70,
    textAlign: "center",
    fontSize: 14,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  pickerStyle: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
  },
  smallButton: {
    backgroundColor: primary,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  smallButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  customInputSmall: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: 60,
    textAlign: "center",
    fontSize: 12,
  },
  ingredientSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "white",
  },
  ingredientSelectorText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  ingredientModalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "90%",
    maxWidth: 350,
    maxHeight: "80%",
    alignItems: "center",
  },
  ingredientOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    width: "100%",
  },
  ingredientOptionSelected: {
    backgroundColor: "#fff4e6",
    borderRadius: 8,
    borderBottomColor: primary,
  },
  ingredientOptionText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    fontWeight: "500",
  },
  ingredientOptionTextSelected: {
    color: primary,
    fontWeight: "bold",
  },
  ingredientOptionAmount: {
    fontSize: 12,
    color: "#666",
  },
  ingredientOptionAmountSelected: {
    color: primary,
    fontWeight: "bold",
  },
  closeModalButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: "center",
  },
  closeModalButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  photoGalleryOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  closePhotoButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  closePhotoButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  photoIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 100,
    width: "100%",
    gap: 8,
  },
  photoIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  photoIndicatorActive: {
    backgroundColor: primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  photoCounter: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  photoCounterText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});
