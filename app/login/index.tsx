import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Link } from "expo-router";
import { primary } from "@/utils/colors";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { SmallText } from "@/components/ui/SmallText";

export default function Index() {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>Iniciar sesión</Title>
        <SubTitle>Para compartír tus recetas con el mundo</SubTitle>
      </Column>

      <Column style={{ gap: 20 }}>
        <Input placeholder="Dirección de correo" />
        <Input placeholder="Contraseña" />
      </Column>

      <Column>
        <SmallText>¿Olvidaste tu contraseña?</SmallText>
        <Link href="/forgot">
          <SmallText
            style={{ color: primary, textDecorationLine: "underline" }}
          >
            Recuperar
          </SmallText>
        </Link>
      </Column>

      <Image
        source={require("@/assets/illustrations/login.svg")}
        style={styles.image}
      />
      <Column>
        <Link style={{ marginBottom: 10 }} href="/home">
          <Button>Iniciar sesión</Button>
        </Link>
        <SmallText>¿No tenés cuenta?</SmallText>
        <Link href="/register">
          <SmallText
            style={{ color: primary, textDecorationLine: "underline" }}
          >
            Registrate
          </SmallText>
        </Link>
      </Column>
    </Column>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 135,
    width: 135,
  },
});
