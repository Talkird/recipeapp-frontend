import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { WelcomeRecipe } from "@/components/WelcomeRecipe";
import { Column } from "@/components/ui/Column";
import { SmallText } from "@/components/ui/SmallText";
import { Link, router } from "expo-router";
import { primary } from "@/utils/colors";
import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { Pressable, StyleSheet } from "react-native";

export default function Index() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        router.replace("/nointernet");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLaterPress = () => {
    
    router.push("/home");
  };

  return (
    <>
      <Pressable style={styles.laterButton} onPress={handleLaterPress}>
        <Column style={styles.laterButtonContainer}>
          <SmallText style={{ color: primary, fontWeight: "bold" }}>
            Más tarde
          </SmallText>
        </Column>
      </Pressable>
      <Column style={{ flex: 1, gap: 32 }}>
        <Column>
          <Title>Recipedia</Title>
          <SubTitle>Descubrí, cociná y compartí</SubTitle>
        </Column>

        <Column style={{ gap: 36 }}>
          <WelcomeRecipe />
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
    </>
  );
}

const styles = StyleSheet.create({
  laterButton: {
    position: "absolute",
    top: 30,
    right: 20,
    zIndex: 10,
  },
  laterButtonContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
