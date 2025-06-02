import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { Button } from "@/components/ui/button";
import Logout from "@/assets/illustrations/logout.svg";
import { Link } from "expo-router";
import { primary } from "@/utils/colors";
import CustomAlert from "@/components/ui/CustomAlert";
const index = () => {
  return (
    <Column style={{ flex: 1, gap: 64 }}>
      <Column>
        <Title style={{ width: "80%" }}>¿Querés cerrar sesión?</Title>
        <SubTitle style={{ width: "50%" }}>
          Si cerrás sesión, vas a necesitar ingresar tu correo y contraseña para
          volver a acceder a tu cuenta.
        </SubTitle>
      </Column>
      <Logout style={{ width: 165, height: 193 }} />
      <Column>
        <CustomAlert
          title="Estas seguro que queres cerrar sesion?"
          description="Deberas reingresar todos tus datos de inicio de sesion"
          onConfirm={() => {
            console.log("Sesión cerrada");
          }}
        />
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
