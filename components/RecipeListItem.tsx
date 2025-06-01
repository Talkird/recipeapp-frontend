import { Column } from "@/components/ui/Column";
import { Row } from "@/components/ui/Row";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Title } from "@/components/ui/Title";
import { SmallText } from "@/components/ui/SmallText";
import { Timer, Users } from "lucide-react-native";
import { Text } from "react-native";
import { primary } from "@/utils/colors";
import { Star, StarHalf } from "lucide-react-native";

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
  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} style={styles.star} fill={primary} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={i} style={styles.star} fill={primary} />);
      } else {
        stars.push(<Star key={i} style={styles.starEmpty} fill={"#D9D9D9"} />);
      }
    }
    return <Row style={{ gap: 2 }}>{stars}</Row>;
  };

  return (
    <Row style={styles.container}>
      <Image style={styles.image} source={imageUrl} />

      <Column
        style={{
          gap: 2,
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <Title style={{ fontSize: 18 }}>{title}</Title>

        {renderStars(rating)}
        <SmallText>Por: {author}</SmallText>
      </Column>
      <Column
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 2,
        }}
      >
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
    gap: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    flexDirection: "row",
    alignItems: "stretch",
    padding: 0,
    margin: 0,
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
    color: "#808080",
  },
  icon: {
    width: 16,
    height: 16,
    color: "#808080",
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

export default RecipeListItem;
