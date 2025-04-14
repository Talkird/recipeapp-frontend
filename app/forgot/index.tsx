import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import Input from "@/components/ui/Input";
import { Link } from "expo-router";
import { Button } from "@/components/ui/Button";
import { StyleSheet, Image } from "react-native";
import { primary } from "@/utils/colors";

export default function Index() {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title style={{ width: "80%" }}>¿Olvidaste tu contraseña?</Title>
        <SubTitle style={{ width: "50%" }}>
          Ingresá tu correo electrónico y te enviaremos un enlace para
          restablecer tu clave.
        </SubTitle>
      </Column>
      <Input placeholder="Dirección de correo" />

      <Column>
        <SmallText>¿Recordaste tu clave?</SmallText>
        <Link href="/forgot">
          <SmallText
            style={{ color: primary, textDecorationLine: "underline" }}
          >
            Iniciar sesión
          </SmallText>
        </Link>
      </Column>

      <Image
        source={require("@/assets/illustrations/forgot-password.svg")}
        style={styles.image}
      />
      <Button>Enviar enlace</Button>
    </Column>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 205,
    height: 135,
  },
});
