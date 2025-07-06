import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import Label from "@/components/ui/Label";
import { User, Mail, CircleHelp } from "lucide-react-native";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { useEffect } from "react";
import { useUserStore } from "@/stores/user";

export default function Index() {
  const { getAccountInfo, mail, nickname, nombre, esAlumno } = useUserStore();
 
  useEffect(() => {
    getAccountInfo()
      .then((info) => {
        console.log("Información de la cuenta:", info);
      })
      .catch((error) => {
        console.error("Error al obtener la información de la cuenta:", error);
      });
  }, []);

  return (
    <Column
      style={{ flex: 1, gap: 32, justifyContent: "flex-start", marginTop: 32 }}
    >
      <Title>Mi Perfil</Title>
      <Label text={nombre || nickname || ""} Icon={User} />

      <Label text={mail ?? ""} Icon={Mail} />
      <Label text={esAlumno ? "Alumno" : "Usuario"} Icon={CircleHelp} />
      
      {/* Solo mostrar el botón si no es alumno */}
      {!esAlumno && (
        <Button
          onPress={() => {
            router.push("/register/alumno");
          }}
        >
          Convertirse en alumno
        </Button>
      )}
      
      <Button onPress={() => router.push("/logout")}>Cerrar sesión</Button>
    </Column>
  );
}
