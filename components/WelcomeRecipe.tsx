import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Title } from "./ui/Title";
import { SubTitle } from "./ui/SubTitle";
import { Row } from "./ui/Row";
import { Column } from "./ui/Column";
import { primary } from "@/utils/colors";
import { Image } from "expo-image";

interface WelcomeRecipeProps {
  title: string;
  description: string;
  image: string;
  onPress?: () => void;
}

export function WelcomeRecipe({
  title,
  description,
  image,
  onPress,
}: WelcomeRecipeProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Row style={{ gap: 16, width: "50%" }}>
        <Image source={image} style={styles.image} />
        <Column>
          <Title style={{ fontSize: 18, color: primary }}>{title}</Title>
          <SubTitle>{description}</SubTitle>
        </Column>
      </Row>
    </TouchableOpacity>
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
