import { Text, View, StyleSheet } from "react-native";
import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { Recipe } from "@/components/Recipe";
import { Column } from "@/components/ui/Column";

import { useRouter } from "expo-router";
import { Link } from "expo-router";
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
        <Button style={{ marginBottom: 10 }}>Crear cuenta</Button>
        <SubTitle>¿Ya tenés cuenta?</SubTitle>
        <Link href="/login">
          <SubTitle style={{ color: primary, textDecorationLine: "underline" }}>
            Iniciar sesión
          </SubTitle>
        </Link>
      </Column>
    </Column>
  );
}

const styles = StyleSheet.create({});
