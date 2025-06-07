import { useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";
import { Heart } from "lucide-react-native";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import { SubTitle } from "@/components/ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import { primary } from "@/utils/colors";
import { Timer, Users } from "lucide-react-native";
import { Star, StarHalf } from "lucide-react-native";
import { Row } from "@/components/ui/Row";
import { StyleSheet } from "react-native";
import Comment from "@/components/Comment";

interface Comment {
  rating: number;
  text: string;
  author: string;
}

interface Ingredient {
  name: string;
  amount: string;
}

interface Recipe {
  title: string;
  description: string;
  rating: string;
  author: string;
  cookTime: string;
  servings: string;
  imageUrl: string;
}

export default function RecipeDetail() {
  return (
    <ScrollView>
      <Image
        source={
          "https://images.unsplash.com/photo-1664214649073-f4250ad39390?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        style={{ width: "100%", height: 250 }}
      />
      <TouchableOpacity style={{ position: "absolute", top: 16, left: 16 }}>
        <Heart color={primary} fill={primary} size={32} />
      </TouchableOpacity>

      <Column style={{ padding: 16, gap: 32 }}>
        <Title>Risotto de hongos y ternera al romero</Title>
        <Row
          style={{
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <SmallText style={{ fontFamily: "DMSans_500Medium" }}>
            Por Juan Losauro
          </SmallText>
          <Row style={{ gap: 2, alignItems: "center" }}>
            {[...Array(Math.floor(5))].map((_, i) => {
              const rating = 5; // Replace with dynamic rating if needed
              if (i < Math.floor(rating)) {
                return (
                  <Star key={i} color={primary} fill={primary} size={20} />
                );
              } else if (i === Math.floor(rating) && rating % 1 >= 0.5) {
                return (
                  <StarHalf key={i} color={primary} fill={primary} size={20} />
                );
              } else {
                return <Star key={i} color="#D9D9D9" size={20} />;
              }
            })}
          </Row>
        </Row>

        <Row
          style={{
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Row style={{ gap: 6 }}>
            <Timer style={styles.icon} />
            <SmallText style={styles.iconText}>45'</SmallText>
          </Row>
          <Row style={{ gap: 6 }}>
            <Users style={styles.icon} />
            <SmallText style={styles.iconText}>2 personas</SmallText>
          </Row>
        </Row>

        <SubTitle>
          Cremoso risotto con carne de ternera, hongos salteados y un toque de
          romero fresco. Sabores intensos en un plato reconfortante y fácil de
          preparar.
        </SubTitle>

        <Column style={{ gap: 12, alignItems: "flex-start", width: "100%" }}>
          <SubTitle>Ingredientes</SubTitle>
          <Row style={{ justifyContent: "flex-start", width: "100%", gap: 12 }}>
            <SmallText style={{ textAlign: "left", flex: 1 }}>
              Arroz arborio
            </SmallText>
            <SmallText style={{ textAlign: "left", flex: 1 }}>200g</SmallText>
          </Row>
          <Row style={{ justifyContent: "flex-start", width: "100%", gap: 12 }}>
            <SmallText style={{ textAlign: "left", flex: 1 }}>
              Carne de ternera
            </SmallText>
            <SmallText style={{ textAlign: "left", flex: 1 }}>150g</SmallText>
          </Row>
          <Row style={{ justifyContent: "flex-start", width: "100%", gap: 12 }}>
            <SmallText style={{ textAlign: "left", flex: 1 }}>
              Hongos frescos
            </SmallText>
            <SmallText style={{ textAlign: "left", flex: 1 }}>100g</SmallText>
          </Row>
          <Row style={{ justifyContent: "flex-start", width: "100%", gap: 12 }}>
            <SmallText style={{ textAlign: "left", flex: 1 }}>
              Caldo de verduras
            </SmallText>
            <SmallText style={{ textAlign: "left", flex: 1 }}>500ml</SmallText>
          </Row>
          <Row style={{ justifyContent: "flex-start", width: "100%", gap: 12 }}>
            <SmallText style={{ textAlign: "left", flex: 1 }}>
              Romero fresco
            </SmallText>
            <SmallText style={{ textAlign: "left", flex: 1 }}>
              1 ramita
            </SmallText>
          </Row>
        </Column>

        <Column style={{ alignItems: "flex-start", gap: 12 }}>
          <SubTitle>Procedimiento</SubTitle>
          <SmallText style={{ textAlign: "left" }}>
            Paso 1: Saltear la carne de ternera en una sartén con un poco de
            aceite hasta dorar.
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            Paso 2: Agregar los hongos y cocinar hasta que estén tiernos.
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            Paso 3: Añadir el arroz y mezclar bien durante 2 minutos.
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            Paso 4: Incorporar el caldo de verduras poco a poco, removiendo
            constantemente.
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            Paso 5: Cocinar a fuego medio hasta que el arroz esté cremoso y al
            dente.
          </SmallText>
          <SmallText style={{ textAlign: "left" }}>
            Paso 6: Añadir el romero fresco, mezclar y servir caliente.
          </SmallText>
        </Column>

        <Column style={{ gap: 12 }}>
          <SubTitle>Comentarios</SubTitle>
          <Comment
            rating={5}
            text="¡Delicioso! El risotto quedó súper cremoso y el toque de romero es espectacular."
            author="María Pérez"
          />
          <Comment
            rating={3.5}
            text="Muy buena receta, fácil de seguir. Le agregué un poco más de hongos y quedó genial."
            author="Carlos Gómez"
          />
        </Column>
      </Column>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    height: 75,
    borderRadius: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    flexDirection: "row",

    justifyContent: "space-between",
    padding: 0,

    backgroundColor: "#FFFFFF",
  },
  image: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    width: 75,
    height: 75,
    alignSelf: "flex-start",
    marginLeft: 0,
    marginRight: 0,
  },
  iconText: {
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
    fontSize: 18,
    color: "#000000",
    opacity: 0.8,
  },
  icon: {
    width: 16,
    height: 16,
    color: "#000000",
    opacity: 0.9,
  },
  star: {
    width: 20,
    height: 20,
    color: primary,
  },
  starEmpty: {
    width: 20,
    height: 20,
    color: "#D9D9D9",
  },
});
