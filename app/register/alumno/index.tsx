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
      alert("Por favor, selecciona al menos una imagen del DNI");
      return;
    }

    if (!numeroTarjeta.trim()) {
      alert("Por favor, ingresa el número de tarjeta");
      return;
    }

    if (!tramite.trim()) {
      alert("Por favor, ingresa el número de trámite");
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
    }
  };

  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column style={{}}>
        <Title>Convertite en alumno</Title>
        <SubTitle>Y empezá a cocinar</SubTitle>
      </Column>
      <PersonalInfo width={210} height={140} />
      <Input onChangeText={setNumeroTarjeta} value={numeroTarjeta} Icon={CreditCard} placeholder="Número de tarjeta" />

      <Column style={{ gap: 16 }}>
        <SmallText>Cargá una imagen del frente y el dorso de tu DNI:</SmallText>
        <CamaraUpload onImagesChange={handleImagesChange} maxImages={2} />
      </Column>

      <Input onChangeText={setTramite} value={tramite} Icon={Hash} placeholder="Número de trámite" />
      <Button onPress={handleFinalizar}>Finalizar</Button>
    </Column>
  );
};

export default index;
