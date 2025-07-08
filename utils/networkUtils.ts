import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import axios from "axios";

export interface PendingRecipe {
  id: string;
  timestamp: string;
  recipeData: any;
  type: "create" | "update";
}

export const checkNetworkConnection = async () => {
  const netInfoState = await NetInfo.fetch();
  return {
    isConnected: netInfoState.isConnected,
    type: netInfoState.type,
    isWifiConnection: netInfoState.type === "wifi",
    isCellularConnection: netInfoState.type === "cellular",
  };
};

export const shouldProceedWithUpload = async (): Promise<boolean> => {
  const networkInfo = await checkNetworkConnection();

  if (!networkInfo.isConnected) {
    Alert.alert(
      "Sin conexión",
      "No hay conexión a internet. La receta se va a guardar localmente hasta que tengas conexión.",
      [{ text: "Entendido" }]
    );
    return false;
  }

  if (networkInfo.isWifiConnection) {
    // WiFi connection - proceed automatically
    return true;
  }

  if (networkInfo.isCellularConnection) {
    // Cellular connection - ask user
    return new Promise((resolve) => {
      Alert.alert(
        "Conexión de datos móviles",
        "Estás conectado a datos móviles. ¿Querés cargar la receta ahora (se van a consumir datos) o guardarla para cargar cuando tengas WiFi?",
        [
          {
            text: "Guardar para después",
            onPress: () => resolve(false),
            style: "cancel",
          },
          {
            text: "Cargar ahora",
            onPress: () => resolve(true),
          },
        ]
      );
    });
  }

  return false;
};

export const savePendingRecipe = async (
  recipe: Omit<PendingRecipe, "id" | "timestamp">
) => {
  try {
    const existingPending = await AsyncStorage.getItem("pendingRecipes");
    const pendingRecipes: PendingRecipe[] = existingPending
      ? JSON.parse(existingPending)
      : [];

    const newPendingRecipe: PendingRecipe = {
      ...recipe,
      id: `pending_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    pendingRecipes.push(newPendingRecipe);
    await AsyncStorage.setItem(
      "pendingRecipes",
      JSON.stringify(pendingRecipes)
    );

    Alert.alert(
      "Receta guardada",
      "La receta se guardó localmente. Se va a subir automáticamente cuando tengas conexión WiFi."
    );

    return newPendingRecipe.id;
  } catch (error) {
    console.error("Error saving pending recipe:", error);
    Alert.alert("Error", "No se pudo guardar la receta localmente");
    return null;
  }
};

export const getPendingRecipes = async (): Promise<PendingRecipe[]> => {
  try {
    const pending = await AsyncStorage.getItem("pendingRecipes");
    return pending ? JSON.parse(pending) : [];
  } catch (error) {
    console.error("Error getting pending recipes:", error);
    return [];
  }
};

export const removePendingRecipe = async (id: string) => {
  try {
    const existing = await AsyncStorage.getItem("pendingRecipes");
    if (existing) {
      const pendingRecipes: PendingRecipe[] = JSON.parse(existing);
      const filtered = pendingRecipes.filter((recipe) => recipe.id !== id);
      await AsyncStorage.setItem("pendingRecipes", JSON.stringify(filtered));
    }
  } catch (error) {
    console.error("Error removing pending recipe:", error);
  }
};

export const uploadPendingRecipes = async () => {
  const networkInfo = await checkNetworkConnection();

  if (!networkInfo.isWifiConnection) {
    return;
  }

  const pendingRecipes = await getPendingRecipes();

  if (pendingRecipes.length === 0) {
    return;
  }

  console.log(
    `Attempting to upload ${pendingRecipes.length} pending recipes...`
  );

  for (const recipe of pendingRecipes) {
    try {
      if (recipe.type === "create") {
        const response = await axios.post(
          "https://legendary-carnival-49gj4755q7gfj95-8080.app.github.dev/api/recetas/create",
          recipe.recipeData
        );

        console.log(
          `Successfully uploaded recipe: ${recipe.id}`,
          response.data
        );
        await removePendingRecipe(recipe.id);
      } else if (recipe.type === "update") {
        if (recipe.recipeData.existingRecipeId) {
          try {
            await axios.delete(
              `https://legendary-carnival-49gj4755q7gfj95-8080.app.github.dev/api/recetas/delete/${recipe.recipeData.existingRecipeId}`
            );
          } catch (deleteErr) {
            console.warn(
              "Could not delete existing recipe during update:",
              deleteErr
            );
          }
        }

        const response = await axios.post(
          "https://legendary-carnival-49gj4755q7gfj95-8080.app.github.dev/api/recetas/create",
          recipe.recipeData
        );

        console.log(`Successfully updated recipe: ${recipe.id}`, response.data);
        await removePendingRecipe(recipe.id);
      }
    } catch (error) {
      console.error(`Failed to upload pending recipe ${recipe.id}:`, error);
      // Don't remove failed uploads - they'll be retried next time
    }
  }

  const remainingRecipes = await getPendingRecipes();
  if (remainingRecipes.length < pendingRecipes.length) {
    console.log(
      `Successfully uploaded ${
        pendingRecipes.length - remainingRecipes.length
      } recipes`
    );
  }
};
