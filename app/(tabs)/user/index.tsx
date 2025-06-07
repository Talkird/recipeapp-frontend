import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import Label from "@/components/ui/Label";
import { User, Mail, CircleHelp } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";

export default function Index() {
  return (
    <Column
      style={{ flex: 1, gap: 32, justifyContent: "flex-start", marginTop: 32 }}
    >
      <Title>Mi Perfil</Title>
      <Label text="Nombre de usuario" Icon={User} />
      <Label text="Dirección de correo" Icon={Mail} />
      <Label text="Tipo de cuenta" Icon={CircleHelp} />
      <Button
        onPress={() => {
          router.push("/register/alumno");
        }}
      >
        Convertirse en alumno
      </Button>
      <Button onPress={() => router.push("/logout")}>Cerrar sesión</Button>
    </Column>
  );
}
