import React from "react";
import { View, StyleSheet } from "react-native";
import { Title } from "./ui/Title";
import { SubTitle } from "./ui/SubTitle";
import { Row } from "./ui/Row";
import { Column } from "./ui/Column";
import { primary } from "@/utils/colors";
import { Image } from "expo-image";

export function WelcomeRecipe() {
  return (
    <Row style={{ gap: 16 }}>
      <Image
        source={
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D"
        }
        style={styles.image}
      />
      <Column>
        <Title style={{ fontSize: 24, color: primary }}>Recipe</Title>
        <SubTitle>Description</SubTitle>
      </Column>
    </Row>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 109,
    height: 109,
    resizeMode: "cover",
    borderRadius: 12,
  },
});
