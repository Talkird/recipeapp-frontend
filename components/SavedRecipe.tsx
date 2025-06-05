import { Column } from "@/components/ui/Column";
import { Row } from "@/components/ui/Row";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { SubTitle } from "./ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { primary } from "@/utils/colors";
import { Heart } from "lucide-react-native";
import { useState } from "react";

interface SavedRecipeProps {
  title: string;
  description: string;
  imageUrl?: string;
}

const Recipe = ({ title, description, imageUrl }: SavedRecipeProps) => {
  const [recipeSaved, setRecipeSaved] = useState(true);

  return (
    <Row style={styles.container}>
      <Row style={{ gap: 12 }}>
        <Image style={styles.image} source={imageUrl} />

        <Column
          style={{
            gap: 2,
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <SubTitle style={{ fontSize: 18 }}>{title}</SubTitle>
          <SmallText>{description}</SmallText>
        </Column>
        <Column>
          <Heart style={recipeSaved ? styles.iconActive : styles.icon} />
        </Column>
      </Row>
    </Row>
  );
};

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
  icon: {
    width: 16,
    height: 16,
    color: "#808080",
  },
  iconActive: {
    width: 16,
    height: 16,
    color: primary,
  },
});

export default Recipe;
