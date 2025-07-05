import React from "react";
import { View, StyleSheet } from "react-native";
import { Title } from "./ui/Title";
import { SubTitle } from "./ui/SubTitle";
import { Row } from "./ui/Row";
import { Column } from "./ui/Column";
import { primary } from "@/utils/colors";
import { Image } from "expo-image";

interface WelcomeRecipeProps {
  title?: string;
  description?: string;
  source?: string;
}

export function WelcomeRecipe({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <Row style={{ gap: 16 }}>
      <Image source={image} style={styles.image} />
      <Column>
        <Title style={{ fontSize: 18, color: primary }}>{title}</Title>
        <SubTitle>{description}</SubTitle>
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
