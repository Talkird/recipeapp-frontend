import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Recipe } from "@/components/Recipe";
import { Column } from "@/components/ui/Column";
import { SmallText } from "@/components/ui/SmallText";
import { Link, router } from "expo-router";
import { primary } from "@/utils/colors";

export default function Index() {
  return (
    <Column style={{ flex: 1, gap: 32 }}>
      <Column>
        <Title>Recipedia</Title>
        <SubTitle>Descubrí, cociná y compartí</SubTitle>
      </Column>

      <Column style={{ gap: 36 }}>
        <Recipe />
        <Recipe />
        <Recipe />
      </Column>

      <Column>
        <Button
          onPress={() => router.push("/register")}
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
