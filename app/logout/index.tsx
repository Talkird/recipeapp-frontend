import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { Button } from "@/components/ui/Button";
import LogoutIllustration from "@/assets/illustrations/logout.svg";
import { Link } from "expo-router";
import { primary } from "@/utils/colors";

const index = () => {
  return (
    <Column style={{ flex: 1, gap: 64 }}>
      <Column>
        <Title>¿Querés cerrar sesión?</Title>
        <SubTitle style={{ marginHorizontal: 16 }}>
          Si cerrás sesión, vas a necesitar ingresar tu correo y contraseña para
          volver a acceder a tu cuenta.
        </SubTitle>
      </Column>
      <LogoutIllustration width={165} height={193} />
      <Column>
        <Button>Cerrar sesión</Button>
        <SmallText>¿No querés cerrar sesión?</SmallText>
        <Link href="/user">
          <SmallText
            style={{ color: primary, textDecorationLine: "underline" }}
          >
            Regresar
          </SmallText>
        </Link>
      </Column>
    </Column>
  );
};

export default index;
