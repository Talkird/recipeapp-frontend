import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import { router } from "expo-router";
import ConfirmedIllustration from "@/assets/illustrations/confirmed.svg";

const index = () => {
  return (
    <Column style={{ flex: 1, gap: 64, padding: 16 }}>
      <Column>
        <Title style={{ width: "75%" }}>
          ¡Contraseña restablecida con éxito!
        </Title>
        <SubTitle style={{ width: "75%" }}>
          Tu nueva contraseña ha sido guardada correctamente. Ya podés iniciar
          sesión con tus nuevos datos.
        </SubTitle>
      </Column>
      <ConfirmedIllustration width={135} height={135} />
      <Button onPress={() => router.push("/login")}>
        Ir al inicio de sesión
      </Button>
    </Column>
  );
};

export default index;
