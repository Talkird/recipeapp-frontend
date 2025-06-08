import React from "react";
import { Title } from "@/components/ui/Title";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { Column } from "@/components/ui/Column";
import { useUserStore } from "@/stores/user";

const index = () => {
  const { setChoiceAlumno } = useUserStore();

  const handleChoiceAlumno = () => {
    setChoiceAlumno(true);
    router.push("/register");
  };

  const handleChoiceUsuario = () => {
    setChoiceAlumno(false);
    router.push("/register");
  };

  return (
    <Column style={{ flex: 1, gap: 64, padding: 16 }}>
      <Column>
        <Title>Elegí el tipo de usuario</Title>
        <SubTitle>¿Cómo te querés registrar?</SubTitle>
      </Column>

      <Column style={{ gap: 16 }}>
        <Button onPress={handleChoiceAlumno}>Alumno</Button>
        <SmallText>
          Podrás usar todas las funcionalidades de un usuario y además
          inscribirte a nuestros cursos de cocina
        </SmallText>
      </Column>
      <Column style={{ gap: 16 }}>
        <Button onPress={handleChoiceUsuario}>Usuario</Button>
        <SmallText>
          Podrás acceder al catálogo de recetas creadas por otros usuarios,
          guardar tus favoritas y crear recetas propias
        </SmallText>
      </Column>
    </Column>
  );
};

export default index;
