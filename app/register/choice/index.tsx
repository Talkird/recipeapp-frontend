import { View, Text } from "react-native";
import React from "react";
import { Title } from "@/components/ui/Title";
import { Button } from "@/components/ui/Button";
import { Router } from "expo-router";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { Column } from "@/components/ui/Column";

const index = () => {
  return (
    <Column style={{ flex: 1, gap: 64, padding: 16 }}>
      <Column>
        <Title style={{ width: "75%" }}>Elegí el tipo de usuario</Title>
        <SubTitle>¿Cómo te querés registrar?</SubTitle>
      </Column>

      <Column style={{ gap: 16 }}>
        <Button>Usuario</Button>
        <SmallText style={{ width: "75%" }}>
          Podrás acceder al catálogo de recetas creadas por otros usuarios,
          guardar tus favoritas y crear recetas propias
        </SmallText>
      </Column>
      <Column style={{ gap: 16 }}>
        <Button>Alumno</Button>
        <SmallText style={{ width: "75%" }}>
          Podrás usar todas las funcionalidades de un usuario y además
          inscribirte a nuestros cursos de cocina
        </SmallText>
      </Column>
    </Column>
  );
};

export default index;
