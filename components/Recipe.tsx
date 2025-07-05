import { Column } from "@/components/ui/Column";
import { Row } from "@/components/ui/Row";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { SubTitle } from "./ui/SubTitle";
import { SmallText } from "@/components/ui/SmallText";
import { Timer, Users } from "lucide-react-native";
import { primary } from "@/utils/colors";
import { Star, StarHalf } from "lucide-react-native";

interface RecipeProps {
  title: string;
  rating?: number;
  author: string;
  cookTime: number;
  servings: number;
  imageUrl?: string;
  id?: number;
}

const Recipe = ({
  id,
  title,
  rating,
  author,
  cookTime,
  servings,
  imageUrl,
}: RecipeProps) => {
  const router = useRouter();
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

  const handleClick = () => {
    if (id !== undefined) {
      router.push(`/home/recipe/${id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.8}
      style={{ width: "80%" }}
    >
      <Row style={[styles.container, { width: "100%" }]}>
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

            {renderStars(rating)}
            <SmallText>Por: {author}</SmallText>
          </Column>
        </Row>

        <Column
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",

            gap: 2,
            marginRight: 12,
          }}
        >
          <Row style={{ gap: 6 }}>
            <Timer style={styles.icon} />
            <SmallText style={styles.iconText}>{cookTime}'</SmallText>
          </Row>
          <Row style={{ gap: 6 }}>
            <Users style={styles.icon} />
            <SmallText style={styles.iconText}>{servings}</SmallText>
          </Row>
        </Column>
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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

export default Recipe;
