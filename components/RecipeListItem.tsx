import { Column } from "@/components/ui/Column";
import { Row } from "@/components/ui/Row";
import { StyleSheet } from "react-native";
import { Image } from "react-native";
import { Title } from "@/components/ui/Title";
import { SmallText } from "@/components/ui/SmallText";
import { Timer, Users } from "lucide-react-native";
import { Text } from "react-native";

interface RecipeListItemProps {
  title: string;
  rating?: number;
  author: string;
  cookTime: number;
  servings: number;
  imageUrl?: string;
}

const RecipeListItem = ({
  title,
  rating,
  author,
  cookTime,
  servings,
  imageUrl,
}: RecipeListItemProps) => {
  return (
    <Row style={styles.container}>
      <Image style={styles.image} src={imageUrl} />

      <Column style={{ gap: 2 }}>
        <Title style={{ fontSize: 18 }}>{title}</Title>
        <SmallText>Rating: {rating} [TODO: Estrellas]</SmallText>
        <SmallText>Por: {author}</SmallText>
      </Column>
      <Column style={{ justifyContent: "flex-start", gap: 2 }}>
        <Row style={{ gap: 6 }}>
          <Timer style={styles.icon} />
          <Text style={styles.iconText}>{cookTime}'</Text>
        </Row>
        <Row style={{ gap: 6 }}>
          <Users style={styles.icon} />
          <Text style={styles.iconText}>{servings}</Text>
        </Row>
      </Column>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 330,
    height: 75,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
  },
  image: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    width: 75,
    height: 75,
  },
  iconText: {
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
    fontSize: 18,
    color: "#808080",
  },
  icon: {
    width: 16,
    height: 16,
    color: "#808080",
  },
});

export default RecipeListItem;
