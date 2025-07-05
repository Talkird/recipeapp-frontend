import React from "react";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { ScrollView } from "react-native";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Row } from "@/components/ui/Row";
import {
  FileQuestion,
  Hash,
  Hourglass,
  PersonStanding,
  Pipette,
  Pizza,
} from "lucide-react-native";
import RNPickerSelect from "react-native-picker-select";
import { SmallText } from "@/components/ui/SmallText";

const AddRecipeScreen: React.FC = () => {
  // For creating steps (pasos) and photos, you may want to add UI for those later
  // For now, we only support ingredientes (utilizados) and basic fields
  const [creating, setCreating] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = React.useState<string | null>(null);
  // Helper to map ingredients to UtilizadoRequest (with IDs)
  const buildUtilizados = () => {
    // Only allow dummy if both arrays are non-empty and have valid IDs
    if (ingredients.length === 0) {
      const dummyIng = ingredientesBackend[0];
      const dummyUnidad = unidadesBackend[0];
      if (
        dummyIng &&
        dummyIng.idIngrediente != null &&
        dummyUnidad &&
        dummyUnidad.idUnidad != null
      ) {
        return [
          {
            idIngrediente: dummyIng.idIngrediente,
            cantidad: 1,
            idUnidad: dummyUnidad.idUnidad,
            observaciones: "Ingrediente de ejemplo",
          },
        ];
      }
      // If no valid dummy, return empty array
      return [];
    }
    // Filter out any ingredient with missing IDs
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
        observaciones: null,
      }));
  };
  // Minimal UI for tipoReceta picker (fetch from backend)
  const [tipoReceta, setTipoReceta] = React.useState<string>("");
  const [tipoRecetaOptions, setTipoRecetaOptions] = React.useState<
    { label: string; value: string }[]
  >([]);
  React.useEffect(() => {
    axios
      .post("http://localhost:8080/api/tiporeceta/getAll")
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
        .post("http://localhost:8080/api/tiporeceta/getByDescripcion", null, {
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
      .get("http://localhost:8080/ingredientes/get/All")
      .then((res) => setIngredientesBackend(res.data))
      .catch(() => setIngredientesBackend([]));
  }, []);

  // Unidades from backend
  const [unidadesBackend, setUnidadesBackend] = React.useState<any[]>([]);
  React.useEffect(() => {
    axios
      .get("http://localhost:8080/api/unidades")
      .then((res) => setUnidadesBackend(res.data))
      .catch(() => setUnidadesBackend([]));
  }, []);

  // Minimal UI for pasos (steps)
  const [pasos, setPasos] = React.useState<any[]>([]);
  const [pasoTexto, setPasoTexto] = React.useState("");
  const handleAddPaso = () => {
    if (pasoTexto.trim()) {
      setPasos([
        ...pasos,
        { nroPaso: pasos.length + 1, texto: pasoTexto, multimedia: [] },
      ]);
      setPasoTexto("");
    }
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
      const recetaRequest = {
        nombreReceta: recipeName,
        descripcionReceta: recipeDescription,
        idTipoReceta: tipoRecetaId,
        porciones: servings ? parseInt(servings) : 1,
        pasos: pasos,
        utilizados,
        fotos: [
          {
            idFoto: 1,
            idReceta: null,
            urlFoto: fotoUrl || "https://placehold.co/600x400",
            extension: "jpg",
          },
        ],
        idUsuario: idUsuario,
        calificacion: null,
        cantidadPersonas: servings ? parseInt(servings) : 1,
        duracion: estimatedTime ? parseInt(estimatedTime) : 1,
        fotoPrincipal: fotoUrl || "https://placehold.co/600x400",
      };
      // Get token if needed
      // const token = useUserStore((s) => s.token);
      const response = await axios.post(
        "http://localhost:8080/api/recetas/create",
        recetaRequest
        // , { headers: { Authorization: `Bearer ${token}` } }
      );
      setCreateSuccess("Receta creada exitosamente!");
      // Optionally reset form
      setNameVerified(false);
      setRecipeName("");
      setRecipeDescription("");
      setEstimatedTime("");
      setServings("");
      setIngredients([]);
      setTipoReceta("");
      setPasos([]);
      setFotoUrl("https://placehold.co/600x400");
      setFotos([
        {
          idFoto: 1,
          idReceta: null,
          urlFoto: "https://placehold.co/600x400",
          extension: "jpg",
        },
      ]);
    } catch (err: any) {
      setCreateError("Error al crear la receta. Intenta de nuevo.");
    } finally {
      setCreating(false);
    }
  };
  const [nameVerified, setNameVerified] = React.useState(false);
  const [recipeName, setRecipeName] = React.useState("");
  const [verifying, setVerifying] = React.useState(false);
  const [verifyError, setVerifyError] = React.useState<string | null>(null);
  const [recipeDescription, setRecipeDescription] = React.useState("");
  const [estimatedTime, setEstimatedTime] = React.useState("");
  const [servings, setServings] = React.useState("");
  const [ingredientName, setIngredientName] = React.useState("");
  const [ingredientQuantity, setIngredientQuantity] = React.useState("");
  const [ingredientUnit, setIngredientUnit] = React.useState("");

  // Get the current user's nickname from the user store
  const nickname = useUserStore((s) => s.nickname);

  const handleVerifyName = async () => {
    setVerifying(true);
    setVerifyError(null);
    try {
      if (!recipeName || !nickname) {
        setVerifyError("Debes ingresar un nombre de receta y estar logueado.");
        setVerifying(false);
        return;
      }
      // Call backend: /api/recetas/search/usuario/{nickname}?criterio={recipeName}
      const response = await axios.get(
        `http://localhost:8080/api/recetas/search/usuario/${encodeURIComponent(
          nickname
        )}?criterio=${encodeURIComponent(recipeName)}`
      );
      if (Array.isArray(response.data) && response.data.length === 0) {
        setNameVerified(true);
      } else {
        setVerifyError(
          "Ya tienes una receta con ese nombre. Elige otro nombre."
        );
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
        },
      ]);
      setIngredientName("");
      setIngredientQuantity("");
      setIngredientUnit("");
    }
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
              <RNPickerSelect
                onValueChange={setTipoReceta}
                items={tipoRecetaOptions}
                value={tipoReceta}
                placeholder={{ label: "Selecciona un tipo", value: "" }}
                style={{ inputIOS: { padding: 12, fontSize: 16 } }}
              />
              <Column style={{ gap: 16 }}>
                <SubTitle>Pasos</SubTitle>
                {pasos.map((paso, idx) => (
                  <Row key={idx} style={{ gap: 8 }}>
                    <SmallText>Paso {paso.nroPaso}:</SmallText>
                    <SmallText>{paso.texto}</SmallText>
                  </Row>
                ))}
                <Input
                  placeholder="Describe el siguiente paso"
                  value={pasoTexto}
                  onChangeText={setPasoTexto}
                />
                <Button onPress={handleAddPaso}>Agregar paso</Button>
                <SubTitle>Agregá ingredientes a tu receta</SubTitle>
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
                  style={{ inputIOS: { padding: 12, fontSize: 16 } }}
                />
                <Input
                  Icon={Hash}
                  placeholder="Cantidad"
                  value={ingredientQuantity}
                  onChangeText={setIngredientQuantity}
                />
                <RNPickerSelect
                  onValueChange={setIngredientUnit}
                  items={unidadesBackend.map((unidad) => ({
                    label: unidad.descripcion,
                    value: unidad.descripcion,
                  }))}
                  value={ingredientUnit}
                  placeholder={{ label: "Selecciona una unidad", value: "" }}
                  style={{ inputIOS: { padding: 12, fontSize: 16 } }}
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
