import { useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, Alert } from "react-native";
import { Heart } from "lucide-react-native";
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
import Comment from "@/components/Comment";
import { useUserStore } from "@/stores/user";

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
  url: string;
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

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [receta, setReceta] = useState<RecetaDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8080/api/recetas/${id}`)
        .then((res) => setReceta(res.data))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const idUsuario = useUserStore((s) => s.idUsuario);
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
      <TouchableOpacity
        style={{ position: "absolute", top: 16, left: 16 }}
        onPress={handleAddFavorite}
        disabled={addingFavorite}
      >
        <Heart color={primary} fill={primary} size={32} />
      </TouchableOpacity>

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
              {receta.cantidadPersonas} personas
            </SmallText>
          </Row>
        </Row>

        <SubTitle>{receta.descripcionReceta}</SubTitle>

        {/* Ingredientes con unidad y observaciones */}
        <Column style={{ gap: 12, alignItems: "flex-start", width: "100%" }}>
          <SubTitle>Ingredientes</SubTitle>
          {receta.utilizados.map((ing, idx) => (
            <Row
              key={idx}
              style={{
                justifyContent: "flex-start",
                width: "100%",
                gap: 12,
                backgroundColor: "#f8f8f8",
                borderRadius: 8,
                padding: 8,
              }}
            >
              <SmallText
                style={{ textAlign: "left", flex: 2, fontWeight: "bold" }}
              >
                {ing.ingrediente?.nombre}
              </SmallText>
              <SmallText style={{ textAlign: "left", flex: 1 }}>
                {ing.cantidad} {ing.unidad?.descripcion || ""}
              </SmallText>
              {ing.observaciones && (
                <SmallText
                  style={{ textAlign: "left", flex: 2, color: "#888" }}
                >
                  {ing.observaciones}
                </SmallText>
              )}
            </Row>
          ))}
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

        {/* Comentario y calificación debajo de procedimiento */}
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
        <Column style={{ gap: 12, alignItems: "flex-start", width: "100%" }}>
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
      </Column>
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
});
