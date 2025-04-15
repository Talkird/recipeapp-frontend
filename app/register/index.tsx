import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Link } from "expo-router";
import { primary } from "@/utils/colors";
import { Image } from "react-native";
import { SmallText } from "@/components/ui/SmallText";

export default function Index() {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>Crea tu cuenta</Title>
        <SubTitle>Y empezá a cocinar</SubTitle>
      </Column>

      <Image
        source={require("@/assets/illustrations/avatar.svg")}
        style={{ height: 135, width: 135 }}
      />

      <Column style={{ gap: 20 }}>
        <Input placeholder="Nombre de usuario" />
        <Input placeholder="Dirección de correo" />
        <Input placeholder="Contraseña" />
        <Input placeholder="Confirmar contraseña" />
      </Column>

      <Column>
        <Link style={{ marginBottom: 10 }} href="/register/verify">
          <Button>Crear cuenta</Button>
        </Link>
        <SmallText>¿Ya tenés cuenta?</SmallText>
        <Link href="/login">
          <SmallText
            style={{ color: primary, textDecorationLine: "underline" }}
          >
            Iniciar sesión
          </SmallText>
        </Link>
      </Column>
    </Column>
  );
}
