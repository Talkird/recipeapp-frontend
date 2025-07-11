import { Button } from "@/components/ui/Button";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { WelcomeRecipe } from "@/components/WelcomeRecipe";
import { Column } from "@/components/ui/Column";
import { SmallText } from "@/components/ui/SmallText";
import { Link, router } from "expo-router";
import { primary } from "@/utils/colors";
import { useEffect, useState } from "react";
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";
import { Pressable, StyleSheet } from "react-native";
import { useUserStore } from "@/stores/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URLS } from "@/lib/constants";

export default function Index() {
  const [ultimasRecetas, setUltimasRecetas] = useState<
    Array<{
      id: number;
      nombreReceta: string;
      usuario: string;
      calificacion: number;
      cantidadPersonas: number;
      duracion: number;
      fotoPrincipal: string;
    }>
  >([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        router.replace("/nointernet");
      }
    });
    // Fetch last three recipes on mount
    axios
      .get(`${API_URLS.RECETAS}/ultimas-tres`)
      .then((res) => {
        setUltimasRecetas(res.data);
      })
      .catch((err) => {
        console.error("Error fetching ultimas tres recetas:", err);
      });
    return () => unsubscribe();
  }, []);

  const handleLaterPress = async () => {
    // Set guest mode (only in memory, not in storage)
    useUserStore.getState().setGuestMode(true);
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
          {ultimasRecetas.map((receta) => (
            <WelcomeRecipe
              key={receta.id}
              title={receta.nombreReceta}
              description={`Por: ${
                receta.usuario
              } - Rating: ${receta.calificacion.toFixed(1)}`}
              image={receta.fotoPrincipal}
              onPress={() => {
                console.log("WelcomeRecipe clicked - Recipe ID:", receta.id);
                // Set guest mode first
                useUserStore.getState().setGuestMode(true);
                console.log("Guest mode set to true");
                // Navigate to home first, then to the specific recipe
                router.push("/home");
                // Small delay to ensure the guest mode is set and home is loaded
                setTimeout(() => {
                  console.log(
                    "Navigating to recipe:",
                    `/home/recipe/${receta.id}`
                  );
                  router.push(`/home/recipe/${receta.id}`);
                }, 100);
              }}
            />
          ))}
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
    top: 80, // Increased from 30 to center it better
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
