import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Image, Alert } from "react-native";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import Cooking from "@/assets/illustrations/cooking.svg";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import Input from "@/components/ui/Input";
import { useUserStore } from "@/stores/user";

const index = () => {
  const [dniFrente, setDniFrente] = useState<string | null>(null);
  const [dniFondo, setDniFondo] = useState<string | null>(null);
  const [tramite, setTramite] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const { createAlumno } = useUserStore();
  const [loading, setLoading] = useState(false);

  const pickImage = async (setter: (v: string) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0].base64) {
      setter(`data:image/png;base64,${result.assets[0].base64}`);
    }
  };

  const handleSubmit = async () => {
    if (!dniFrente || !dniFondo || !tramite || !numeroTarjeta) {
      Alert.alert("Completa todos los campos y sube ambas fotos del DNI");
      return;
    }
    setLoading(true);
    try {
      await createAlumno(tramite, numeroTarjeta, dniFrente, dniFondo);
      Alert.alert("Alumno creado exitosamente");
      router.push("/home");
    } catch (e) {
      Alert.alert("Error al crear alumno");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Column style={{ flex: 1, gap: 32, padding: 16 }}>
      <Column style={{ gap: 8 }}>
        <Title style={{ marginHorizontal: 16 }}>Convertite en alumno hoy</Title>
        <SubTitle style={{ marginHorizontal: 16 }}>
          Convertite en alumno para acceder a este curso y muchos más
        </SubTitle>
      </Column>
      <Cooking width={207} height={177} />
      <SmallText>Trámite</SmallText>
      <Input
        placeholder="Número de trámite"
        value={tramite}
        onChangeText={setTramite}
      />
      <SmallText>Número de tarjeta</SmallText>
      <Input
        placeholder="Número de tarjeta"
        value={numeroTarjeta}
        onChangeText={setNumeroTarjeta}
      />
      <Button onPress={() => pickImage(setDniFrente)}>
        {dniFrente ? "Cambiar foto DNI Frente" : "Subir foto DNI Frente"}
      </Button>
      {dniFrente && (
        <Image
          source={{ uri: dniFrente }}
          style={{
            width: 200,
            height: 120,
            alignSelf: "center",
            marginVertical: 8,
          }}
        />
      )}
      <Button onPress={() => pickImage(setDniFondo)}>
        {dniFondo ? "Cambiar foto DNI Dorso" : "Subir foto DNI Dorso"}
      </Button>
      {dniFondo && (
        <Image
          source={{ uri: dniFondo }}
          style={{
            width: 200,
            height: 120,
            alignSelf: "center",
            marginVertical: 8,
          }}
        />
      )}
      <Button onPress={handleSubmit}>
        {loading ? "Enviando..." : "Enviar solicitud"}
      </Button>
    </Column>
  );
};

export default index;
