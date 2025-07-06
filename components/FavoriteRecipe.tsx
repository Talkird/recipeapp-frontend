import React from "react";
import { View, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Image } from "expo-image";
import { SubTitle } from "@/components/ui/SubTitle";
import { Timer, Users, Star, StarHalf } from "lucide-react-native";
import { primary } from "@/utils/colors";
import { Column } from "@/components/ui/Column";
import { Row } from "@/components/ui/Row";
import { SmallText } from "@/components/ui/SmallText";
import { Title } from "@/components/ui/Title";
import { Trash2 } from "lucide-react-native";

interface FavoriteRecipeProps {
  id: number;
  title: string;
  rating?: number;
  author?: string;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  onRemove: (id: number) => void;
  onPress?: () => void;
}

const FavoriteRecipe: React.FC<FavoriteRecipeProps> = ({
  id,
  title,
  rating,
  author,
  cookTime,
  servings,
  imageUrl,
  onRemove,
  onPress,
}) => {
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
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{ width: "100%" }}
    >
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
            {renderStars(rating)}
            <SmallText>Por: {author}</SmallText>
          </Column>
        </Row>
        {/* Removed cook time and servings for favorite recipe card */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            Alert.alert(
              "Eliminar favorito",
              "¿Seguro que quieres eliminar esta receta de tus favoritos?",
              [
                { text: "Cancelar", style: "cancel" },
                {
                  text: "Eliminar",
                  style: "destructive",
                  onPress: () => onRemove(id),
                },
              ]
            );
          }}
          style={{
            padding: 16,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "stretch",
          }}
        >
          <Trash2 color="#e74c3c" size={32} />
        </TouchableOpacity>
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
    marginBottom: 12,
    width: "90%",
    alignSelf: "center",
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

export default FavoriteRecipe;
