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
import {
  ScrollView,
  SafeAreaView,
  Alert,
  View,
  StyleSheet,
} from "react-native";

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
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Title style={styles.title}>Convertite en alumno</Title>
          <SubTitle style={styles.subtitle}>Y empezá a cocinar</SubTitle>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <PersonalInfo width={160} height={110} />
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {/* Inputs */}
          <View style={styles.inputsContainer}>
            <Input
              onChangeText={setNumeroTarjeta}
              value={numeroTarjeta}
              Icon={CreditCard}
              placeholder="Número de tarjeta"
            />

            <Input
              onChangeText={setTramite}
              value={tramite}
              Icon={Hash}
              placeholder="Número de trámite"
            />
          </View>

          {/* DNI Section */}
          <View style={styles.dniContainer}>
            <SmallText style={styles.dniTitle}>📷 Imágenes del DNI</SmallText>
            <SmallText style={styles.dniDescription}>
              Necesitamos una foto del frente y dorso de tu DNI para verificar
              tu identidad. Asegurate de que se vea claramente toda la
              información.
            </SmallText>

            <View style={styles.cameraContainer}>
              <CamaraUpload onImagesChange={handleImagesChange} maxImages={2} />
            </View>

            {selectedImages.length > 0 && (
              <SmallText style={styles.progressText}>
                ✅ {selectedImages.length} de 2 imágenes agregadas
              </SmallText>
            )}
          </View>

          {/* Button */}
          <View style={styles.buttonContainer}>
            <Button onPress={handleFinalizar}>Finalizar</Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  inputsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  dniContainer: {
    marginBottom: 32,
  },
  dniTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  dniDescription: {
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cameraContainer: {
    marginBottom: 12,
  },
  progressText: {
    color: "green",
    fontSize: 12,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 8,
  },
});

export default index;
