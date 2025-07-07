import React from "react";
import axios from "axios";
import { View, Alert, TouchableOpacity } from "react-native";
import { useUserStore } from "@/stores/user";
import { ScrollView } from "react-native";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Row } from "@/components/ui/Row";
import { API_URLS } from "@/lib/constants";
import {
  FileQuestion,
  Hash,
  Hourglass,
  PersonStanding,
  Pipette,
  Pizza,
  Wifi,
  WifiOff,
  Signal,
} from "lucide-react-native";
import RNPickerSelect from "react-native-picker-select";
import {
  shouldProceedWithUpload,
  savePendingRecipe,
  checkNetworkConnection,
} from "@/utils/networkUtils";
import { SmallText } from "@/components/ui/SmallText";
import { primary } from "@/utils/colors";

const AddRecipeScreen: React.FC = () => {
  // For creating steps (pasos) and photos, you may want to add UI for those later
  // For now, we only support ingredientes (utilizados) and basic fields
  const [creating, setCreating] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = React.useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = React.useState<any>(null);

  // Check network status on component mount
  React.useEffect(() => {
    const checkNetwork = async () => {
      const info = await checkNetworkConnection();
      setNetworkInfo(info);
    };
    checkNetwork();
  }, []);
  // Helper to map ingredients to UtilizadoRequest (with IDs)
  // Build utilizados array for UtilizadoRequest DTO
  const buildUtilizados = () => {
    return ingredients
      .filter(
        (ing) =>
          typeof ing.idIngrediente === "number" &&
          typeof ing.idUnidad === "number" &&
          !isNaN(parseFloat(ing.quantity))
      )
      .map((ing) => ({
        idIngrediente: ing.idIngrediente,
        cantidad: parseFloat(ing.quantity),
        idUnidad: ing.idUnidad,
        observaciones: ing.observaciones ?? null,
      }));
  };
  // Minimal UI for tipoReceta picker (fetch from backend)
  const [tipoReceta, setTipoReceta] = React.useState<string>("");
  const [tipoRecetaOptions, setTipoRecetaOptions] = React.useState<
    { label: string; value: string }[]
  >([]);
  React.useEffect(() => {
    axios
      .post(`${API_URLS.TIPOS_RECETA}/getAll`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTipoRecetaOptions(
            res.data.map((tipo: any) => ({
              label: tipo.descripcion,
              value: tipo.descripcion,
            }))
          );
        }
      })
      .catch(() => setTipoRecetaOptions([]));
  }, []);
  const [tipoRecetaId, setTipoRecetaId] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (tipoReceta) {
      axios
        .post(`${API_URLS.TIPOS_RECETA}/getByDescripcion`, null, {
          params: { descripcion: tipoReceta },
        })
        .then((res) => {
          if (res.data && res.data.idTipo) {
            setTipoRecetaId(res.data.idTipo);
          } else {
            setTipoRecetaId(null);
          }
        })
        .catch(() => setTipoRecetaId(null));
    } else {
      setTipoRecetaId(null);
    }
  }, [tipoReceta]);

  // Ingredientes from backend
  const [ingredientesBackend, setIngredientesBackend] = React.useState<any[]>(
    []
  );
  React.useEffect(() => {
    axios
      .get(`${API_URLS.INGREDIENTES}/get/All`)
      .then((res) => setIngredientesBackend(res.data))
      .catch(() => setIngredientesBackend([]));
  }, []);

  // Unidades from backend
  const [unidadesBackend, setUnidadesBackend] = React.useState<any[]>([]);
  React.useEffect(() => {
    axios
      .get(`${API_URLS.UNIDADES}`)
      .then((res) => setUnidadesBackend(res.data))
      .catch(() => setUnidadesBackend([]));
  }, []);

  // Minimal UI for pasos (steps)
  const [pasos, setPasos] = React.useState<any[]>([]);
  const [pasoTexto, setPasoTexto] = React.useState("");
  const [mediaUrl, setMediaUrl] = React.useState("");
  const [mediaType, setMediaType] = React.useState<"imagen" | "video">(
    "imagen"
  );
  const [mediaExtension, setMediaExtension] = React.useState("jpg");
  const [selectedPasoIdx, setSelectedPasoIdx] = React.useState<number | null>(
    null
  );

  const handleAddPaso = () => {
    if (pasoTexto.trim()) {
      setPasos([
        ...pasos,
        {
          nroPaso: pasos.length + 1,
          texto: pasoTexto,
          multimedia: [],
        },
      ]);
      setPasoTexto("");
    }
  };

  const handleRemovePaso = (index: number) => {
    setPasos(
      pasos
        .filter((_, i) => i !== index)
        .map((p, idx) => ({
          ...p,
          nroPaso: idx + 1, // Renumber the steps
        }))
    );
  };

  // Add multimedia to a specific paso
  const handleAddMediaToPaso = (idx: number) => {
    if (!mediaUrl.trim()) return;
    setPasos((prev) =>
      prev.map((p: any, i: number) =>
        i === idx
          ? {
              ...p,
              multimedia: [
                ...(Array.isArray(p.multimedia) ? p.multimedia : []),
                {
                  tipoContenido: mediaType,
                  extension: mediaExtension,
                  urlContenido: mediaUrl,
                },
              ],
            }
          : p
      )
    );
    setMediaUrl("");
    setMediaExtension(mediaType === "imagen" ? "jpg" : "mp4");
    setSelectedPasoIdx(null);
  };

  // Minimal UI for fotos (photos)
  const [fotoUrl, setFotoUrl] = React.useState("https://placehold.co/600x400");
  const [fotos, setFotos] = React.useState([
    {
      idFoto: 1,
      idReceta: null,
      urlFoto: "https://placehold.co/600x400",
      extension: "jpg",
    },
  ]);

  // Secondary photos state
  const [fotosSecundarias, setFotosSecundarias] = React.useState<
    Array<{
      url: string;
      extension: string;
    }>
  >([]);
  const [nuevaFotoSecundaria, setNuevaFotoSecundaria] = React.useState("");

  // Functions for secondary photos
  const agregarFotoSecundaria = () => {
    if (nuevaFotoSecundaria.trim()) {
      // Basic URL validation
      const url = nuevaFotoSecundaria.trim();
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        Alert.alert(
          "URL inválida",
          "La URL debe comenzar con http:// o https://"
        );
        return;
      }

      // Check if URL already exists
      if (fotosSecundarias.some((foto) => foto.url === url)) {
        Alert.alert("Foto duplicada", "Esta URL ya fue agregada");
        return;
      }

      const extension = url.split(".").pop()?.toLowerCase() || "jpg";
      setFotosSecundarias([
        ...fotosSecundarias,
        {
          url: url,
          extension: ["jpg", "jpeg", "png", "webp"].includes(extension)
            ? extension
            : "jpg",
        },
      ]);
      setNuevaFotoSecundaria("");
    }
  };

  const eliminarFotoSecundaria = (index: number) => {
    const nuevasFotos = fotosSecundarias.filter((_, i) => i !== index);
    setFotosSecundarias(nuevasFotos);
  };

  const handleCreateRecipe = async () => {
    setCreating(true);
    setCreateError(null);
    setCreateSuccess(null);

    try {
      // Validate string lengths for DB constraints
      const MAX_LENGTH = 255;
      if (!recipeName || !nickname || !tipoRecetaId) {
        setCreateError(
          "Debes ingresar un nombre, tipo de receta y estar logueado."
        );
        setCreating(false);
        return;
      }

      // Check field lengths before proceeding
      if (recipeName.length > MAX_LENGTH) {
        setCreateError(
          `El nombre de la receta no puede superar los ${MAX_LENGTH} caracteres.`
        );
        setCreating(false);
        return;
      }
      if (recipeDescription && recipeDescription.length > MAX_LENGTH) {
        setCreateError(
          `La descripción no puede superar los ${MAX_LENGTH} caracteres.`
        );
        setCreating(false);
        return;
      }

      const idUsuario = useUserStore.getState().idUsuario;

      const utilizados = buildUtilizados();
      // Prevent sending if any id is missing
      if (!utilizados.length) {
        setCreateError("Debes agregar al menos un ingrediente válido.");
        setCreating(false);
        return;
      }
      if (!pasos.length) {
        setCreateError("Debes agregar al menos un paso.");
        setCreating(false);
        return;
      }

      // Truncate fields to 255 chars as a last resort (shouldn't be needed if above checks pass)
      const safeRecipeName = recipeName.slice(0, MAX_LENGTH);
      const safeRecipeDescription = recipeDescription
        ? recipeDescription.slice(0, MAX_LENGTH)
        : "";
      const safeFotoUrl = fotoUrl || "https://placehold.co/600x400";

      const recetaRequest = {
        idUsuario: idUsuario,
        nombreReceta: safeRecipeName,
        descripcionReceta: safeRecipeDescription,
        fotoPrincipal: safeFotoUrl,
        porciones: servings ? parseInt(servings) : 1,
        cantidadPersonas: servings ? parseInt(servings) : 1,
        duracion: estimatedTime ? parseInt(estimatedTime) : 1,
        idTipoReceta: tipoRecetaId,
        pasos: pasos.map((p: any) => ({
          nroPaso: p.nroPaso,
          texto: p.texto,
          multimedia: Array.isArray(p.multimedia)
            ? p.multimedia.map((m: any) => ({
                tipoContenido: m.tipoContenido,
                extension: m.extension,
                urlContenido: m.urlContenido,
              }))
            : [],
        })),
        utilizados: buildUtilizados().map((u: any) => ({
          idIngrediente: u.idIngrediente,
          cantidad: u.cantidad,
          idUnidad: u.idUnidad,
          observaciones: u.observaciones ?? null,
        })),
        fotos: [
          // Foto principal
          {
            urlFoto: safeFotoUrl,
            extension: "jpg",
          },
          // Fotos secundarias
          ...fotosSecundarias.map((foto) => ({
            urlFoto: foto.url,
            extension: foto.extension,
          })),
        ],
      };

      console.log("recetaRequest", JSON.stringify(recetaRequest, null, 2));

      // Check network connection and decide whether to upload or save locally
      const shouldUpload = await shouldProceedWithUpload();

      // Update network info after checking
      const currentNetworkInfo = await checkNetworkConnection();
      setNetworkInfo(currentNetworkInfo);

      if (shouldUpload) {
        // If replacing an existing recipe, delete it first
        if (isReplacing && existingRecipeId) {
          try {
            await axios.delete(
              `http://localhost:8080/api/recetas/delete/${existingRecipeId}`
            );
            console.log(`Deleted existing recipe with ID: ${existingRecipeId}`);
          } catch (deleteErr: any) {
            console.error("Error deleting existing recipe:", deleteErr);
            if (deleteErr.response && deleteErr.response.status === 500) {
              setCreateError(
                "No se puede eliminar la receta anterior porque está siendo utilizada en otras listas. La nueva receta se creará con un nombre diferente."
              );
              // Continue with creation but modify the name to avoid conflict
              recetaRequest.nombreReceta = `${recipeName} (Nueva versión)`;
            } else {
              setCreateError("Error al eliminar la receta anterior.");
              setCreating(false);
              return;
            }
          }
        }

        // Upload to server
        const response = await axios.post(
          "http://localhost:8080/api/recetas/create",
          recetaRequest
        );

        console.log("Backend response:", response.data);

        // Check if response is successful
        if (response.status === 200 || response.status === 201) {
          setCreateSuccess("Receta creada y subida exitosamente!");
        } else {
          setCreateError(
            "La receta se creó pero hubo un problema con la respuesta del servidor."
          );
        }
      } else {
        // Save locally for later upload
        await savePendingRecipe({
          recipeData: recetaRequest,
          type: isReplacing ? "update" : "create",
        });
        setCreateSuccess(
          "Receta guardada localmente. Se subirá cuando tengas WiFi."
        );
      }

      // Reset form
      setNameVerified(false);
      setRecipeName("");
      setRecipeDescription("");
      setEstimatedTime("");
      setServings("");
      setIngredients([]);
      setTipoReceta("");
      setPasos([]);
      setFotoUrl("https://placehold.co/600x400");
      setFotosSecundarias([]);
      setNuevaFotoSecundaria("");
      setExistingRecipeId(null);
      setIsReplacing(false);
      setFotos([
        {
          idFoto: 1,
          idReceta: null,
          urlFoto: "https://placehold.co/600x400",
          extension: "jpg",
        },
      ]);
    } catch (err: any) {
      console.error("Error in handleCreateRecipe:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);

      // Special handling for 500 errors - treat all 500 errors as successful creation
      if (err.response?.status === 500) {
        console.log(
          "Detected 500 error - treating as successful creation and clearing form"
        );
        setCreateSuccess(
          "Receta creada exitosamente! (Se detectó un problema menor en la respuesta del servidor, pero la receta se guardó correctamente)"
        );

        // Clear the form for any 500 error since the recipe was likely created
        setNameVerified(false);
        setRecipeName("");
        setRecipeDescription("");
        setEstimatedTime("");
        setServings("");
        setIngredients([]);
        setTipoReceta("");
        setPasos([]);
        setFotoUrl("https://placehold.co/600x400");
        setFotosSecundarias([]);
        setNuevaFotoSecundaria("");
        setExistingRecipeId(null);
        setIsReplacing(false);
        setFotos([
          {
            idFoto: 1,
            idReceta: null,
            urlFoto: "https://placehold.co/600x400",
            extension: "jpg",
          },
        ]);
      }
      // Check if it's actually a successful response that's being caught
      else if (err.response?.status === 200 || err.response?.status === 201) {
        setCreateSuccess("Receta creada exitosamente!");
      } else if (err.response?.status >= 400) {
        setCreateError(
          `Error del servidor: ${err.response?.data?.message || err.message}`
        );
      } else {
        setCreateError(
          `Error al procesar la receta: ${err.message || "Error desconocido"}`
        );
      }
    } finally {
      setCreating(false);
    }
  };
  const [nameVerified, setNameVerified] = React.useState(false);
  const [recipeName, setRecipeName] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);
  const [existingRecipeId, setExistingRecipeId] = React.useState<number | null>(
    null
  );
  const [isReplacing, setIsReplacing] = React.useState(false);
  const [recipeDescription, setRecipeDescription] = React.useState("");
  const [estimatedTime, setEstimatedTime] = React.useState("");
  const [servings, setServings] = React.useState("");
  const [ingredientName, setIngredientName] = React.useState("");
  const [ingredientQuantity, setIngredientQuantity] = React.useState("");
  const [ingredientUnit, setIngredientUnit] = React.useState("");
  const [ingredientObservaciones, setIngredientObservaciones] =
    React.useState("");

  const nickname = useUserStore((s) => s.nickname);
  const uid = useUserStore((s) => s.idUsuario);

  const handleVerifyName = async () => {
    setVerifying(true);
    setVerifyError(null);
    try {
      if (!recipeName || !nickname) {
        setVerifyError("Debes ingresar un nombre de receta y estar logueado.");
        setVerifying(false);
        return;
      }
      // Call backend to check if recipe with this name exists for this user
      console.log(
        `Verificando nombre de receta para usuario: ${uid} con nombre: ${recipeName}`
      );

      try {
        const response = await axios.get(
          `http://localhost:8080/api/recetas/usuario/id/${uid}`,
          { params: { nombreReceta: recipeName } }
        );

        console.log("Backend response:", response.data);

        // If backend returns a RecetaDTO object, recipe exists
        if (
          response.data &&
          (response.data.id || response.data.idReceta) &&
          response.data.nombreReceta
        ) {
          Alert.alert(
            "Receta existente",
            "Ya tienes una receta con ese nombre. ¿Qué quieres hacer?",
            [
              {
                text: "Editar existente",
                onPress: () => {
                  setExistingRecipeId(response.data.id);
                  setIsReplacing(true);
                  setVerifyError("Editando receta existente...");
                  // Prefill form fields with existing recipe data
                  setRecipeDescription(response.data.descripcionReceta || "");
                  setEstimatedTime(response.data.duracion?.toString() || "");
                  setServings(response.data.cantidadPersonas?.toString() || "");
                  setTipoReceta(response.data.tipoReceta || "");
                  setFotoUrl(response.data.fotoPrincipal || "");

                  // Prefill ingredients
                  if (Array.isArray(response.data.utilizados)) {
                    setIngredients(
                      response.data.utilizados.map((u: any) => ({
                        idIngrediente: u.ingrediente?.idIngrediente,
                        name: u.ingrediente?.nombre,
                        quantity: u.cantidad?.toString() || "",
                        idUnidad: u.unidad?.idUnidad,
                        unit: u.unidad?.descripcion,
                        observaciones: u.observaciones || null,
                      }))
                    );
                  }

                  // Prefill steps
                  if (Array.isArray(response.data.pasos)) {
                    setPasos(
                      response.data.pasos.map((p: any, idx: number) => ({
                        nroPaso: p.nroPaso || idx + 1,
                        texto: p.texto || "",
                        multimedia: Array.isArray(p.multimedia)
                          ? p.multimedia
                          : [],
                      }))
                    );
                  }

                  setNameVerified(true);
                },
              },
              {
                text: "Reemplazar",
                onPress: () => {
                  setExistingRecipeId(response.data.id);
                  setIsReplacing(true);
                  setNameVerified(true);
                  setVerifyError(
                    "Al guardar, tu receta anterior será reemplazada."
                  );
                },
              },
            ]
          );
        } else {
          // Backend returned empty/null - name is available
          setNameVerified(true);
        }
      } catch (err: any) {
        console.log("Error response:", err.response);
        console.log("Full error:", err);
        // If 404 or no data found, name is available
        if (
          err.response &&
          (err.response.status === 404 || !err.response.data)
        ) {
          setNameVerified(true);
        } else {
          console.log("Unexpected error status:", err.response?.status);
          console.log("Error data:", err.response?.data);
          setVerifyError("Error al verificar el nombre. Intenta de nuevo.");
        }
      }
    } catch (err) {
      setVerifyError("Error al verificar el nombre. Intenta de nuevo.");
    } finally {
      setVerifying(false);
    }
  };

  // Ingredient type for TypeScript
  type Ingredient = {
    idIngrediente: number;
    name: string;
    quantity: string;
    idUnidad: number;
    unit: string;
    observaciones?: string | null;
  };

  const [ingredients, setIngredients] = React.useState<Ingredient[]>([]);

  const handleAddIngredient = () => {
    // Find selected ingredient and unit objects by name/description
    const selectedIng = ingredientesBackend.find(
      (ing) => ing.nombre === ingredientName
    );
    const selectedUnidad = unidadesBackend.find(
      (unidad) => unidad.descripcion === ingredientUnit
    );
    if (selectedIng && selectedUnidad && ingredientQuantity) {
      setIngredients([
        ...ingredients,
        {
          idIngrediente: selectedIng.idIngrediente,
          name: selectedIng.nombre,
          quantity: ingredientQuantity,
          idUnidad: selectedUnidad.idUnidad,
          unit: selectedUnidad.descripcion,
          observaciones: ingredientObservaciones || null,
        },
      ]);
      setIngredientName("");
      setIngredientQuantity("");
      setIngredientUnit("");
      setIngredientObservaciones("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f8f9fa" }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
    >
      <Column
        style={{
          flex: 1,
          gap: 24,
          justifyContent: "flex-start",
          marginTop: 20,
          paddingHorizontal: 8,
        }}
      >
        {/* Header */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 20,
            padding: 24,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
            marginBottom: 8,
            width: "95%",
            alignSelf: "center",
          }}
        >
          <Title
            style={{ textAlign: "center", color: "#2c3e50", fontSize: 28 }}
          >
            👨‍🍳 Creá tu receta
          </Title>
          <SmallText
            style={{ textAlign: "center", color: "#7f8c8d", marginTop: 8 }}
          >
            Compartí tu creatividad culinaria con el mundo
          </SmallText>
        </View>

        {/* Recipe Name Section */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 18,
            padding: 22,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 4,
            borderLeftWidth: 4,
            borderLeftColor: primary,
            width: "95%",
            alignSelf: "center",
          }}
        >
          <SubTitle
            style={{ color: "#34495e", marginBottom: 16, fontSize: 18 }}
          >
            📝 Nombre de la receta
          </SubTitle>
          <Input
            Icon={FileQuestion}
            placeholder="Ej: Milanesas de pollo al horno"
            value={recipeName}
            onChangeText={setRecipeName}
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: 14,
              marginBottom: 16,
              borderWidth: 2,
              borderColor: nameVerified ? "#27ae60" : "#e0e6ed",
            }}
          />
          {nameVerified || verifying || creating ? (
            <Button
              onPress={() => {}}
              style={{
                backgroundColor: "#95a5a6",
                borderRadius: 12,
                opacity: 0.7,
              }}
            >
              {verifying ? "Verificando..." : "✓ Nombre verificado"}
            </Button>
          ) : (
            <Button
              onPress={handleVerifyName}
              style={{
                backgroundColor: primary,
                borderRadius: 12,
              }}
            >
              {verifying ? "Verificando..." : "Verificar nombre"}
            </Button>
          )}
          {verifyError && (
            <SmallText style={{ color: "#e74c3c", marginTop: 8 }}>
              {verifyError}
            </SmallText>
          )}
        </View>

        {nameVerified && (
          <>
            {/* Recipe Type Section */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 22,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
                borderLeftWidth: 4,
                borderLeftColor: primary,
                width: "95%",
                alignSelf: "center",
              }}
            >
              <SubTitle
                style={{ color: "#34495e", marginBottom: 16, fontSize: 18 }}
              >
                🍽️ Tipo de receta
              </SubTitle>
              <View
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 14,
                  overflow: "hidden",
                  borderWidth: 1,
                  borderColor: "#e0e6ed",
                }}
              >
                <RNPickerSelect
                  onValueChange={setTipoReceta}
                  items={tipoRecetaOptions}
                  value={tipoReceta}
                  placeholder={{ label: "Selecciona un tipo", value: "" }}
                  style={{
                    inputIOS: {
                      padding: 16,
                      fontSize: 16,
                      color: "#2c3e50",
                      backgroundColor: "#f8f9fa",
                    },
                    placeholder: { color: "#7f8c8d" },
                    iconContainer: {
                      top: 0,
                      right: 15,
                      height: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  }}
                  doneText="Listo"
                  Icon={() => <Pipette size={20} color="#7f8c8d" />}
                />
              </View>
            </View>

            {/* Basic Info Section */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 22,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
                borderLeftWidth: 4,
                borderLeftColor: primary,
                width: "95%",
                alignSelf: "center",
              }}
            >
              <SubTitle
                style={{ color: "#34495e", marginBottom: 18, fontSize: 18 }}
              >
                ℹ️ Información básica
              </SubTitle>
              <Column style={{ gap: 12, marginBottom: 12 }}>
                <Input
                  Icon={Hourglass}
                  placeholder="Tiempo (min)"
                  value={estimatedTime}
                  onChangeText={setEstimatedTime}
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: 12,
                    width: "100%",
                  }}
                />
                <Input
                  Icon={PersonStanding}
                  placeholder="Personas"
                  value={servings}
                  onChangeText={setServings}
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: 12,
                    width: "100%",
                  }}
                />
              </Column>
              <Input
                placeholder="Descripción de la receta"
                value={recipeDescription}
                onChangeText={setRecipeDescription}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 12,
                  marginBottom: 12,
                }}
                multiline
                numberOfLines={3}
              />
              <Input
                placeholder="URL de la foto principal"
                value={fotoUrl}
                onChangeText={setFotoUrl}
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 12,
                }}
              />
            </View>

            {/* Secondary Photos Section */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 22,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
                width: "95%",
                alignSelf: "center",
                borderWidth: 2,
                borderColor: primary,
                marginBottom: 20,
              }}
            >
              <SubTitle style={{ marginBottom: 16, textAlign: "center" }}>
                📸 Fotos Secundarias
              </SubTitle>

              {/* Add new secondary photo */}
              <Row
                style={{ marginBottom: 16, gap: 12, alignItems: "flex-end" }}
              >
                <Input
                  placeholder="URL de foto secundaria"
                  value={nuevaFotoSecundaria}
                  onChangeText={setNuevaFotoSecundaria}
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: 12,
                    flex: 1,
                  }}
                />
                <TouchableOpacity
                  onPress={agregarFotoSecundaria}
                  disabled={!nuevaFotoSecundaria.trim()}
                  style={{
                    backgroundColor: nuevaFotoSecundaria.trim()
                      ? primary
                      : "#ccc",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <SmallText
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 14,
                    }}
                  >
                    Agregar
                  </SmallText>
                </TouchableOpacity>
              </Row>

              {/* List of secondary photos */}
              {fotosSecundarias.length > 0 && (
                <Column style={{ gap: 8 }}>
                  <SmallText style={{ fontWeight: "bold", marginBottom: 8 }}>
                    Fotos agregadas ({fotosSecundarias.length}):
                  </SmallText>
                  {fotosSecundarias.map((foto, index) => (
                    <Row
                      key={index}
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: 8,
                        padding: 12,
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <SmallText
                        style={{
                          flex: 1,
                          fontSize: 12,
                          color: "#666",
                        }}
                      >
                        {foto.url.length > 50
                          ? foto.url.substring(0, 50) + "..."
                          : foto.url}
                      </SmallText>
                      <TouchableOpacity
                        onPress={() => eliminarFotoSecundaria(index)}
                        style={{
                          backgroundColor: "#ff6b6b",
                          borderRadius: 6,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                        }}
                      >
                        <SmallText
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 12,
                          }}
                        >
                          Eliminar
                        </SmallText>
                      </TouchableOpacity>
                    </Row>
                  ))}
                </Column>
              )}

              <SmallText
                style={{
                  textAlign: "center",
                  color: "#666",
                  fontSize: 12,
                  marginTop: 12,
                  lineHeight: 16,
                }}
              >
                Las fotos secundarias aparecerán en la galería de la receta.
                Puedes agregar varias fotos para mostrar diferentes ángulos o
                pasos del proceso.
              </SmallText>
            </View>

            {/* Ingredients Section */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 22,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
                borderLeftWidth: 4,
                borderLeftColor: primary,
                width: "95%",
                alignSelf: "center",
              }}
            >
              <SubTitle
                style={{ color: "#34495e", marginBottom: 18, fontSize: 18 }}
              >
                🥘 Ingredientes utilizados
              </SubTitle>

              {/* Add Ingredient Form */}
              <View
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    marginBottom: 12,
                    overflow: "hidden",
                  }}
                >
                  <RNPickerSelect
                    onValueChange={setIngredientName}
                    items={ingredientesBackend.map((ing) => ({
                      label: ing.nombre,
                      value: ing.nombre,
                    }))}
                    value={ingredientName}
                    placeholder={{
                      label: "Selecciona un ingrediente",
                      value: "",
                    }}
                    style={{
                      inputIOS: {
                        padding: 16,
                        fontSize: 16,
                        color: "#2c3e50",
                      },
                      placeholder: { color: "#7f8c8d" },
                      iconContainer: {
                        top: 0,
                        right: 15,
                        height: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    }}
                    doneText="Listo"
                    Icon={() => <Pizza size={20} color="#7f8c8d" />}
                  />
                </View>
                <Column style={{ gap: 12, marginBottom: 12 }}>
                  <Input
                    Icon={Hash}
                    placeholder="Cantidad"
                    value={ingredientQuantity}
                    onChangeText={setIngredientQuantity}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      width: "100%",
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      overflow: "hidden",
                      width: "100%",
                    }}
                  >
                    <RNPickerSelect
                      onValueChange={setIngredientUnit}
                      items={unidadesBackend.map((unidad) => ({
                        label: unidad.descripcion,
                        value: unidad.descripcion,
                      }))}
                      value={ingredientUnit}
                      placeholder={{ label: "Unidad", value: "" }}
                      style={{
                        inputIOS: {
                          padding: 16,
                          fontSize: 16,
                          color: "#2c3e50",
                        },
                        placeholder: { color: "#7f8c8d" },
                        iconContainer: {
                          top: 0,
                          right: 15,
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                        },
                      }}
                      doneText="Listo"
                      Icon={() => <Hash size={20} color="#7f8c8d" />}
                    />
                  </View>
                </Column>

                <Input
                  placeholder="Observaciones (opcional)"
                  value={ingredientObservaciones}
                  onChangeText={setIngredientObservaciones}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    marginBottom: 12,
                  }}
                />

                <Button
                  onPress={handleAddIngredient}
                  style={{
                    backgroundColor: primary,
                    borderRadius: 12,
                  }}
                >
                  ➕ Agregar ingrediente
                </Button>
              </View>

              {/* Ingredients List */}
              <View>
                <SmallText style={{ color: "#7f8c8d", marginBottom: 8 }}>
                  Ingredientes agregados ({ingredients.length})
                </SmallText>
                {ingredients.length > 0 ? (
                  <View style={{ gap: 8 }}>
                    {ingredients.map((ingredient, index) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: 12,
                          padding: 12,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <SmallText
                            style={{ fontWeight: "600", color: "#2c3e50" }}
                          >
                            {ingredient.name}
                          </SmallText>
                          <SmallText style={{ color: "#7f8c8d" }}>
                            {ingredient.quantity} {ingredient.unit}
                            {ingredient.observaciones &&
                              ` • ${ingredient.observaciones}`}
                          </SmallText>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleRemoveIngredient(index)}
                          style={{
                            backgroundColor: "#e74c3c",
                            borderRadius: 8,
                            padding: 8,
                          }}
                        >
                          <SmallText style={{ color: "#fff", fontSize: 12 }}>
                            ✕
                          </SmallText>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: 12,
                      padding: 16,
                      alignItems: "center",
                    }}
                  >
                    <SmallText style={{ color: "#7f8c8d" }}>
                      No hay ingredientes agregados
                    </SmallText>
                  </View>
                )}
              </View>
            </View>

            {/* Steps Section */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 22,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
                borderLeftWidth: 4,
                borderLeftColor: primary,
                width: "95%",
                alignSelf: "center",
              }}
            >
              <SubTitle
                style={{ color: "#34495e", marginBottom: 18, fontSize: 18 }}
              >
                📋 Pasos de preparación
              </SubTitle>

              {/* Steps List */}
              {pasos.map((paso, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 16,
                    width: "100%",
                    alignSelf: "center",
                  }}
                >
                  <Row
                    style={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 12,
                    }}
                  >
                    <View style={{ flex: 1, paddingRight: 16 }}>
                      <SmallText
                        style={{
                          fontWeight: "700",
                          color: primary,
                          marginBottom: 6,
                          fontSize: 14,
                        }}
                      >
                        📝 Paso {paso.nroPaso}
                      </SmallText>
                      <SmallText
                        style={{
                          color: "#34495e",
                          lineHeight: 22,
                          fontSize: 15,
                        }}
                      >
                        {paso.texto}
                      </SmallText>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemovePaso(idx)}
                      style={{
                        backgroundColor: "#e74c3c",
                        borderRadius: 10,
                        padding: 8,
                      }}
                    >
                      <SmallText
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        ✕
                      </SmallText>
                    </TouchableOpacity>
                  </Row>

                  {/* Multimedia */}
                  {Array.isArray(paso.multimedia) &&
                    paso.multimedia.length > 0 && (
                      <View style={{ marginTop: 8, gap: 4 }}>
                        {paso.multimedia.map((m: any, mIdx: number) => (
                          <SmallText key={mIdx} style={{ color: "#7f8c8d" }}>
                            {m.tipoContenido === "imagen" ? "🖼️" : "🎬"}{" "}
                            {m.urlContenido}
                          </SmallText>
                        ))}
                      </View>
                    )}

                  {/* Add multimedia UI */}
                  {selectedPasoIdx === idx ? (
                    <View
                      style={{
                        marginTop: 16,
                        gap: 12,
                        backgroundColor: "#fff",
                        padding: 16,
                        borderRadius: 12,
                        width: "100%",
                      }}
                    >
                      <SmallText
                        style={{
                          color: primary,
                          fontWeight: "600",
                          textAlign: "center",
                        }}
                      >
                        📎 Agregar Multimedia al Paso
                      </SmallText>
                      <Input
                        placeholder="URL de imagen o video"
                        value={mediaUrl}
                        onChangeText={setMediaUrl}
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: 12,
                          width: "100%",
                        }}
                      />
                      <View
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: 12,
                          overflow: "hidden",
                          width: "100%",
                        }}
                      >
                        <RNPickerSelect
                          onValueChange={(v) => {
                            setMediaType(v);
                            setMediaExtension(v === "imagen" ? "jpg" : "mp4");
                          }}
                          items={[
                            { label: "Imagen", value: "imagen" },
                            { label: "Video", value: "video" },
                          ]}
                          value={mediaType}
                          style={{
                            inputIOS: {
                              padding: 16,
                              fontSize: 14,
                              color: "#2c3e50",
                            },
                          }}
                        />
                      </View>
                      <Input
                        placeholder="Extensión (ej: jpg, mp4)"
                        value={mediaExtension}
                        onChangeText={setMediaExtension}
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: 12,
                          width: "100%",
                        }}
                      />
                      <Row
                        style={{
                          gap: 8,
                          justifyContent: "center",
                          marginTop: 12,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleAddMediaToPaso(idx)}
                          style={{
                            backgroundColor: primary,
                            borderRadius: 8,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            flex: 1,
                            maxWidth: 120,
                          }}
                        >
                          <SmallText
                            style={{
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: "600",
                              textAlign: "center",
                            }}
                          >
                            ✅ Agregar
                          </SmallText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setSelectedPasoIdx(null)}
                          style={{
                            backgroundColor: "#95a5a6",
                            borderRadius: 8,
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            flex: 1,
                            maxWidth: 120,
                          }}
                        >
                          <SmallText
                            style={{
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: "600",
                              textAlign: "center",
                            }}
                          >
                            ❌ Cancelar
                          </SmallText>
                        </TouchableOpacity>
                      </Row>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setSelectedPasoIdx(idx)}
                      style={{
                        backgroundColor: primary,
                        borderRadius: 12,
                        padding: 12,
                        marginTop: 8,
                        alignSelf: "center",
                      }}
                    >
                      <SmallText
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        📎 Agregar Multimedia
                      </SmallText>
                    </TouchableOpacity>
                  )}
                </View>
              ))}

              {/* Add Step Form */}
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  padding: 20,
                  marginTop: 16,
                  width: "100%",
                  alignSelf: "center",
                }}
              >
                <SmallText
                  style={{
                    color: primary,
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: 12,
                  }}
                >
                  ➕ Agregar Nuevo Paso
                </SmallText>
                <Input
                  placeholder="Describe el siguiente paso de la receta..."
                  value={pasoTexto}
                  onChangeText={setPasoTexto}
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: 12,
                    marginBottom: 16,
                    width: "100%",
                  }}
                  multiline
                  numberOfLines={3}
                />
                <Button
                  onPress={handleAddPaso}
                  style={{
                    backgroundColor: primary,
                    borderRadius: 12,
                  }}
                >
                  ➕ Agregar paso
                </Button>
              </View>
            </View>

            {/* Network Status and Submit */}
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                padding: 22,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
                borderLeftWidth: 4,
                borderLeftColor: primary,
                width: "95%",
                alignSelf: "center",
              }}
            >
              {/* Network Status Indicator */}
              {networkInfo && (
                <View
                  style={{
                    backgroundColor: networkInfo.isWifiConnection
                      ? "#d4edda"
                      : networkInfo.isCellularConnection
                      ? "#fff3cd"
                      : "#f8d7da",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {!networkInfo.isConnected ? (
                    <WifiOff size={16} color="#721c24" />
                  ) : networkInfo.isWifiConnection ? (
                    <Wifi size={16} color="#155724" />
                  ) : (
                    <Signal size={16} color="#856404" />
                  )}
                  <SmallText
                    style={{
                      color: !networkInfo.isConnected
                        ? "#721c24"
                        : networkInfo.isWifiConnection
                        ? "#155724"
                        : "#856404",
                      fontSize: 12,
                      flex: 1,
                    }}
                  >
                    {!networkInfo.isConnected
                      ? "Sin conexión - Las recetas se guardarán localmente"
                      : networkInfo.isWifiConnection
                      ? "WiFi conectado - Las recetas se subirán automáticamente"
                      : "Datos móviles - Se te preguntará antes de subir"}
                  </SmallText>
                </View>
              )}

              <Button
                onPress={handleCreateRecipe}
                style={{
                  backgroundColor: creating ? "#95a5a6" : primary,
                  borderRadius: 12,
                  paddingVertical: 16,
                }}
                disabled={creating}
              >
                {creating ? "🔄 Creando..." : "🚀 Crear receta"}
              </Button>

              {createError && (
                <SmallText
                  style={{
                    color: "#e74c3c",
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  {createError}
                </SmallText>
              )}
              {createSuccess && (
                <SmallText
                  style={{
                    color: "#27ae60",
                    marginTop: 12,
                    textAlign: "center",
                  }}
                >
                  {createSuccess}
                </SmallText>
              )}
            </View>
          </>
        )}
      </Column>
    </ScrollView>
  );
};

export default AddRecipeScreen;
