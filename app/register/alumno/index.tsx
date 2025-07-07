import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { router } from "expo-router";
import { SmallText } from "@/components/ui/SmallText";
import PersonalInfo from "@/assets/illustrations/personal-information.svg";
import { CreditCard, Hash } from "lucide-react-native";
import CamaraUpload from "@/components/CamaraUpload";
import { useUserStore } from "@/stores/user";
import { useState } from "react";
import { ScrollView, SafeAreaView, Alert, View } from "react-native";

const index = () => {
  const { createAlumno } = useUserStore();
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [tramite, setTramite] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImagesChange = (images: string[]) => {
    setSelectedImages(images);
  };

  const handleFinalizar = async () => {
    if (selectedImages.length === 0) {
      Alert.alert("Error", "Por favor, selecciona al menos una imagen del DNI");
      return;
    }

    if (!numeroTarjeta.trim()) {
      Alert.alert("Error", "Por favor, ingresa el número de tarjeta");
      return;
    }

    if (!tramite.trim()) {
      Alert.alert("Error", "Por favor, ingresa el número de trámite");
      return;
    }

    try {
      await createAlumno(
        tramite,
        numeroTarjeta,
        selectedImages[0] || "dni_frente.jpg",
        selectedImages[1] || selectedImages[0] || "dni_fondo.jpg"
      );
      router.push("/register/success");
    } catch (error) {
      console.error("Error al crear el alumno:", error);
      Alert.alert(
        "Error",
        "No se pudo completar el registro. Intenta nuevamente."
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Column
          style={{
            gap: 24,
            alignItems: "center",
            maxWidth: 400,
            alignSelf: "center",
            width: "100%",
          }}
        >
          {/* Header Section */}
          <Column style={{ alignItems: "center", marginTop: 20 }}>
            <Title>Convertite en alumno</Title>
            <SubTitle>Y empezá a cocinar</SubTitle>
          </Column>

          {/* Illustration */}
          <PersonalInfo width={180} height={120} />

          {/* Form Fields */}
          <Column style={{ gap: 20, width: "100%" }}>
            <Input
              onChangeText={setNumeroTarjeta}
              value={numeroTarjeta}
              Icon={CreditCard}
              placeholder="Número de tarjeta"
              style={{ width: "100%" }}
            />

            <Input
              onChangeText={setTramite}
              value={tramite}
              Icon={Hash}
              placeholder="Número de trámite"
              style={{ width: "100%" }}
            />
          </Column>

          {/* DNI Images Section */}
          <Column style={{ gap: 12, width: "100%" }}>
            <SmallText style={{ fontWeight: "bold", fontSize: 16 }}>
              📷 Imágenes del DNI
            </SmallText>
            <SmallText style={{ color: "#666", fontSize: 14, lineHeight: 20 }}>
              Necesitamos una foto del frente y dorso de tu DNI para verificar
              tu identidad. Asegurate de que se vea claramente toda la
              información.
            </SmallText>

            <CamaraUpload onImagesChange={handleImagesChange} maxImages={2} />

            {selectedImages.length > 0 && (
              <SmallText
                style={{ color: "green", fontSize: 12, textAlign: "center" }}
              >
                ✅ {selectedImages.length} de 2 imágenes agregadas
              </SmallText>
            )}
          </Column>

          {/* Submit Button */}
          <View style={{ marginTop: 20, width: "100%" }}>
            <Button onPress={handleFinalizar}>Finalizar</Button>
          </View>
        </Column>
      </ScrollView>
    </SafeAreaView>
  );
};

export default index;
