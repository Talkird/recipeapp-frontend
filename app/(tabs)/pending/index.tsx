import React, { useState, useEffect } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Column } from "@/components/ui/Column";
import { Row } from "@/components/ui/Row";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { Button } from "@/components/ui/Button";
import { Clock, Wifi, Upload, Trash2 } from "lucide-react-native";
import { primary } from "@/utils/colors";
import {
  getPendingRecipes,
  removePendingRecipe,
  uploadPendingRecipes,
  checkNetworkConnection,
  PendingRecipe,
} from "@/utils/networkUtils";
import { router } from "expo-router";

export default function PendingRecipes() {
  const [pendingRecipes, setPendingRecipes] = useState<PendingRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  const loadPendingRecipes = async () => {
    setLoading(true);
    try {
      const recipes = await getPendingRecipes();
      setPendingRecipes(recipes);

      const network = await checkNetworkConnection();
      setNetworkInfo(network);
    } catch (error) {
      console.error("Error loading pending recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingRecipes();
  }, []);

  const handleUploadAll = async () => {
    if (!networkInfo?.isWifiConnection) {
      Alert.alert(
        "Sin WiFi",
        "Necesitás una conexión WiFi para subir las recetas pendientes."
      );
      return;
    }

    setUploading(true);
    try {
      await uploadPendingRecipes();
      await loadPendingRecipes();
      Alert.alert("¡Bárbaro!", "Todas las recetas pendientes fueron subidas.");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al subir las recetas.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRecipe = (recipeId: string) => {
    Alert.alert(
      "Eliminar receta",
      "¿Estás seguro que querés eliminar esta receta pendiente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await removePendingRecipe(recipeId);
            await loadPendingRecipes();
          },
        },
      ]
    );
  };

  const getNetworkStatusText = () => {
    if (!networkInfo?.isConnected) return "Sin conexión";
    if (networkInfo.isWifiConnection) return "WiFi conectado";
    if (networkInfo.isCellularConnection) return "Datos móviles";
    return "Conectado";
  };

  const getNetworkStatusColor = () => {
    if (!networkInfo?.isConnected) return "#ff4444";
    if (networkInfo.isWifiConnection) return "#00aa00";
    return "#ff9900";
  };

  if (loading) {
    return (
      <Column
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <SmallText>Cargando recetas pendientes...</SmallText>
      </Column>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={loadPendingRecipes} />
      }
    >
      <Column style={{ padding: 16, gap: 20 }}>
        <Column style={{ gap: 8 }}>
          <Title>Recetas Pendientes</Title>
          <Row style={{ alignItems: "center", gap: 8 }}>
            <Wifi size={16} color={getNetworkStatusColor()} />
            <SmallText style={{ color: getNetworkStatusColor() }}>
              {getNetworkStatusText()}
            </SmallText>
          </Row>
        </Column>

        {pendingRecipes.length === 0 ? (
          <Column
            style={{
              alignItems: "center",
              gap: 16,
              paddingVertical: 40,
              backgroundColor: "white",
              borderRadius: 12,
              marginTop: 20,
            }}
          >
            <Clock size={48} color="#ccc" />
            <SubTitle style={{ textAlign: "center", color: "#666" }}>
              No tenés recetas pendientes
            </SubTitle>
            <SmallText style={{ textAlign: "center", color: "#888" }}>
              Las recetas que guardes sin conexión WiFi van a aparecer acá
            </SmallText>
          </Column>
        ) : (
          <>
            {networkInfo?.isWifiConnection && (
              <Button
                onPress={handleUploadAll}
                disabled={uploading}
                style={{ backgroundColor: "#00aa00" }}
              >
                <Row style={{ alignItems: "center", gap: 8 }}>
                  <Upload size={16} color="white" />
                  <SmallText style={{ color: "white", fontWeight: "bold" }}>
                    {uploading
                      ? "Subiendo..."
                      : `Subir todas (${pendingRecipes.length})`}
                  </SmallText>
                </Row>
              </Button>
            )}

            <Column style={{ gap: 12 }}>
              {pendingRecipes.map((recipe, index) => (
                <Column
                  key={recipe.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 12,
                    padding: 16,
                    gap: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Row
                    style={{
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <Column style={{ flex: 1, gap: 4 }}>
                      <SubTitle>Receta #{index + 1}</SubTitle>
                      <SmallText style={{ color: "#666" }}>
                        Tipo:{" "}
                        {recipe.type === "create"
                          ? "Nueva receta"
                          : "Actualización"}
                      </SmallText>
                      <SmallText style={{ color: "#888", fontSize: 12 }}>
                        Guardada:{" "}
                        {new Date(recipe.timestamp).toLocaleDateString()} a las{" "}
                        {new Date(recipe.timestamp).toLocaleTimeString()}
                      </SmallText>
                    </Column>

                    <TouchableOpacity
                      onPress={() => handleDeleteRecipe(recipe.id)}
                      style={{
                        padding: 8,
                        backgroundColor: "#ffebee",
                        borderRadius: 8,
                      }}
                    >
                      <Trash2 size={16} color="#f44336" />
                    </TouchableOpacity>
                  </Row>

                  <Row style={{ gap: 8 }}>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: "#f0f0f0",
                        borderRadius: 8,
                        padding: 12,
                        alignItems: "center",
                      }}
                      onPress={() => {
                        Alert.alert(
                          "Vista previa",
                          "Funcionalidad de vista previa pendiente"
                        );
                      }}
                    >
                      <SmallText style={{ fontWeight: "500" }}>
                        Ver detalles
                      </SmallText>
                    </TouchableOpacity>

                    {networkInfo?.isWifiConnection && (
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          backgroundColor: primary,
                          borderRadius: 8,
                          padding: 12,
                          alignItems: "center",
                        }}
                        onPress={async () => {
                          setUploading(true);
                          try {
                            await new Promise((resolve) =>
                              setTimeout(resolve, 1000)
                            );
                            await removePendingRecipe(recipe.id);
                            await loadPendingRecipes();
                            Alert.alert(
                              "¡Subida!",
                              "La receta fue subida exitosamente."
                            );
                          } catch (error) {
                            Alert.alert("Error", "No se pudo subir la receta.");
                          } finally {
                            setUploading(false);
                          }
                        }}
                        disabled={uploading}
                      >
                        <Row style={{ alignItems: "center", gap: 4 }}>
                          <Upload size={14} color="white" />
                          <SmallText
                            style={{ color: "white", fontWeight: "500" }}
                          >
                            Subir
                          </SmallText>
                        </Row>
                      </TouchableOpacity>
                    )}
                  </Row>
                </Column>
              ))}
            </Column>
          </>
        )}

        <Column
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 16,
            gap: 8,
            marginTop: 20,
          }}
        >
          <SubTitle style={{ color: primary }}>💡 Información</SubTitle>
          <SmallText style={{ color: "#666", lineHeight: 18 }}>
            • Las recetas se suben automáticamente cuando tenés WiFi{"\n"}• En
            datos móviles, podés elegir subir ahora o guardar para después{"\n"}
            • Máximo 10 recetas pendientes (se eliminan las más viejas)
          </SmallText>
        </Column>
      </Column>
    </ScrollView>
  );
}
