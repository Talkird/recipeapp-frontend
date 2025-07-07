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

  const handleCreateRecipe = async () => {
    setCreating(true);
    setCreateError(null);
    setCreateSuccess(null);

    try {
      if (!recipeName || !nickname || !tipoRecetaId) {
        setCreateError(
          "Debes ingresar un nombre, tipo de receta y estar logueado."
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

      const recetaRequest = {
        idUsuario: idUsuario,
        nombreReceta: recipeName,
        descripcionReceta: recipeDescription,
        fotoPrincipal: fotoUrl || "https://placehold.co/600x400",
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
          {
            urlFoto: fotoUrl || "https://placehold.co/600x400",
            extension: "jpg",
          },
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
        setCreateSuccess("Receta creada y subida exitosamente!");
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
      setCreateError("Error al procesar la receta. Intenta de nuevo.");
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
        <Title>Creá tu receta</Title>
        <Column style={{ gap: 16 }}>
          <SubTitle>Nombre de la receta</SubTitle>
          <Input
            Icon={FileQuestion}
            placeholder="Nombre de la receta"
            value={recipeName}
            onChangeText={setRecipeName}
          />
          {nameVerified || verifying || creating ? (
            <Button onPress={() => {}}>
              {verifying ? "Verificando..." : "Verificar nombre"}
            </Button>
          ) : (
            <Button onPress={handleVerifyName}>
              {verifying ? "Verificando..." : "Verificar nombre"}
            </Button>
          )}
          {verifyError && (
            <SmallText style={{ color: "red" }}>{verifyError}</SmallText>
          )}
        </Column>

        {nameVerified && (
          <>
            <Column style={{ gap: 16 }}>
              <SubTitle>Tipo de receta</SubTitle>
              <View
                style={{ width: 250, alignSelf: "center", marginBottom: 8 }}
              >
                <RNPickerSelect
                  onValueChange={setTipoReceta}
                  items={tipoRecetaOptions}
                  value={tipoReceta}
                  placeholder={{ label: "Selecciona un tipo", value: "" }}
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
                  Icon={() => <Pipette size={20} color="#808080" />}
                />
              </View>
              <Column style={{ gap: 16 }}>
                <SubTitle>Pasos</SubTitle>
                {pasos.map((paso, idx) => (
                  <Column key={idx} style={{ gap: 4, marginBottom: 8 }}>
                    <Row
                      style={{
                        gap: 8,
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Row style={{ gap: 8, flex: 1 }}>
                        <SmallText>Paso {paso.nroPaso}:</SmallText>
                        <SmallText>{paso.texto}</SmallText>
                      </Row>
                      <TouchableOpacity
                        onPress={() => handleRemovePaso(idx)}
                        style={{
                          backgroundColor: "#ff4444",
                          borderRadius: 4,
                          padding: 4,
                        }}
                      >
                        <SmallText style={{ color: "white", fontSize: 12 }}>
                          Eliminar
                        </SmallText>
                      </TouchableOpacity>
                    </Row>
                    {/* List multimedia for this paso */}
                    {Array.isArray(paso.multimedia) &&
                      paso.multimedia.length > 0 && (
                        <Column style={{ marginLeft: 16, gap: 2 }}>
                          {paso.multimedia.map((m: any, mIdx: number) => (
                            <SmallText key={mIdx}>
                              {m.tipoContenido === "imagen" ? "🖼️" : "🎬"}{" "}
                              {m.urlContenido} ({m.extension})
                            </SmallText>
                          ))}
                        </Column>
                      )}
                    {/* Add multimedia UI */}
                    {selectedPasoIdx === idx ? (
                      <Column style={{ gap: 8, marginTop: 4 }}>
                        <Input
                          placeholder="URL de imagen o video"
                          value={mediaUrl}
                          onChangeText={setMediaUrl}
                        />
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
                              padding: 8,
                              fontSize: 14,
                              color: "#000",
                            },
                          }}
                        />
                        <Input
                          placeholder="Extensión"
                          value={mediaExtension}
                          onChangeText={setMediaExtension}
                        />
                        <Button onPress={() => handleAddMediaToPaso(idx)}>
                          Agregar
                        </Button>
                        <Button
                          onPress={() => setSelectedPasoIdx(null)}
                          style={{ backgroundColor: "#eee" }}
                        >
                          Cancelar
                        </Button>
                      </Column>
                    ) : (
                      <Button
                        onPress={() => setSelectedPasoIdx(idx)}
                        style={{ width: 120 }}
                      >
                        + Multimedia
                      </Button>
                    )}
                  </Column>
                ))}
                <Input
                  placeholder="Describe el siguiente paso"
                  value={pasoTexto}
                  onChangeText={setPasoTexto}
                />
                <Button onPress={handleAddPaso}>Agregar paso</Button>
                <Button
                  onPress={() => handleRemovePaso(pasos.length - 1)}
                  style={{ backgroundColor: "#dc3545", marginTop: 8 }}
                >
                  Eliminar último paso
                </Button>
                <SubTitle>Agregá ingredientes a tu receta</SubTitle>
                <View
                  style={{ width: 250, alignSelf: "center", marginBottom: 8 }}
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
                    Icon={() => <Pizza size={20} color="#808080" />}
                  />
                </View>
                <Input
                  Icon={Hash}
                  placeholder="Cantidad"
                  value={ingredientQuantity}
                  onChangeText={setIngredientQuantity}
                />
                <View
                  style={{ width: 250, alignSelf: "center", marginBottom: 8 }}
                >
                  <RNPickerSelect
                    onValueChange={setIngredientUnit}
                    items={unidadesBackend.map((unidad) => ({
                      label: unidad.descripcion,
                      value: unidad.descripcion,
                    }))}
                    value={ingredientUnit}
                    placeholder={{ label: "Selecciona una unidad", value: "" }}
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
                    Icon={() => <Hash size={20} color="#808080" />}
                  />
                </View>
                <Input
                  placeholder="Observaciones (opcional)"
                  value={ingredientObservaciones}
                  onChangeText={setIngredientObservaciones}
                />
                <Button onPress={handleAddIngredient}>Agregar</Button>
              </Column>

              <Column>
                <SubTitle>Lista de ingredientes</SubTitle>
                {ingredients.length > 0 ? (
                  ingredients.map((ingredient, index) => (
                    <Row key={index} style={{ flexDirection: "row", gap: 8 }}>
                      <SmallText>{ingredient.name}</SmallText>
                      <SmallText>{ingredient.quantity}</SmallText>
                      <SmallText>{ingredient.unit}</SmallText>
                      <Button
                        onPress={() => handleRemoveIngredient(index)}
                        style={{
                          backgroundColor: "#dc3545",
                          paddingVertical: 4,
                          paddingHorizontal: 8,
                          borderRadius: 4,
                        }}
                      >
                        <SmallText style={{ color: "#fff" }}>
                          Eliminar
                        </SmallText>
                      </Button>
                    </Row>
                  ))
                ) : (
                  <SmallText>No hay ingredientes agregados</SmallText>
                )}
              </Column>

              <Column style={{ gap: 16 }}>
                <SubTitle>Foto principal</SubTitle>
                <Input
                  placeholder="URL de la foto principal"
                  value={fotoUrl}
                  onChangeText={setFotoUrl}
                />
                <SubTitle>Información de la receta</SubTitle>
                <Input
                  Icon={Hourglass}
                  placeholder="Tiempo estimado en minutos"
                  value={estimatedTime}
                  onChangeText={setEstimatedTime}
                />
                <Input
                  Icon={PersonStanding}
                  placeholder="Cantidad de personas"
                  value={servings}
                  onChangeText={setServings}
                />
                <Input
                  placeholder="Descripción de la receta"
                  value={recipeDescription}
                  onChangeText={setRecipeDescription}
                />

                {/* Network Status Indicator */}
                {networkInfo && (
                  <Row
                    style={{
                      alignItems: "center",
                      gap: 8,
                      padding: 12,
                      backgroundColor: networkInfo.isWifiConnection
                        ? "#e8f5e8"
                        : networkInfo.isCellularConnection
                        ? "#fff3cd"
                        : "#f8d7da",
                      borderRadius: 8,
                      marginVertical: 8,
                    }}
                  >
                    {!networkInfo.isConnected ? (
                      <WifiOff size={16} color="#dc3545" />
                    ) : networkInfo.isWifiConnection ? (
                      <Wifi size={16} color="#28a745" />
                    ) : (
                      <Signal size={16} color="#ffc107" />
                    )}
                    <SmallText
                      style={{
                        color: !networkInfo.isConnected
                          ? "#dc3545"
                          : networkInfo.isWifiConnection
                          ? "#28a745"
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
                  </Row>
                )}

                <Button onPress={handleCreateRecipe}>
                  {creating ? "Creando..." : "Crear receta"}
                </Button>
                {createError && (
                  <SmallText style={{ color: "red" }}>{createError}</SmallText>
                )}
                {createSuccess && (
                  <SmallText style={{ color: "green" }}>
                    {createSuccess}
                  </SmallText>
                )}
              </Column>
            </Column>
          </>
        )}
      </Column>
    </ScrollView>
  );
};

export default AddRecipeScreen;
