import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Title } from "./ui/Title";
import { SubTitle } from "./ui/SubTitle";
import { Row } from "./ui/Row";
import { Column } from "./ui/Column";
import { primary } from "@/utils/colors";

export function Recipe() {
  return (
    <Row style={{ gap: 16 }}>
      <Image
        source={{
          uri: "https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZvb2R8ZW58MHx8MHx8fDA%3D",
        }}
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
