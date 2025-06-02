import { Button } from "@/components/ui/button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { WelcomeRecipe } from "@/components/WelcomeRecipe";
import { Column } from "@/components/ui/Column";
import { SmallText } from "@/components/ui/SmallText";
import { Link, router } from "expo-router";
import { primary } from "@/utils/colors";
import { View } from "react-native";

export default function Index() {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>Recipedia</Title>
        <SubTitle>Descubrí, cociná y compartí</SubTitle>
      </Column>

      <Column style={{ gap: 36 }}>
        <WelcomeRecipe />
        <WelcomeRecipe />
      </Column>

      <Column>
        <Button
          onPress={() => router.push("/register/choice")}
          style={{ marginBottom: 10 }}
        >
          Crear cuenta
        </Button>

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
