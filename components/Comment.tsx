import { View, Text } from "react-native";
import React from "react";
import { Title } from "./ui/Title";
import { SubTitle } from "./ui/SubTitle";
import { SmallText } from "./ui/SmallText";
import { Row } from "./ui/Row";
import { Column } from "./ui/Column";
import { Star, StarHalf } from "lucide-react-native";
import { primary } from "@/utils/colors";

interface CommentProps {
  rating?: number;
  text?: string;
  author?: string;
}

const renderStars = (rating: number = 0) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} color={primary} fill={primary} size={18} />);
  }
  if (hasHalfStar) {
    stars.push(
      <StarHalf key="half" color={primary} fill={primary} size={18} />
    );
  }
  // Optionally render empty stars for a total of 5
  for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
    stars.push(<Star key={"empty-" + i} color="#ccc" size={18} />);
  }
  return stars;
};

const Comment = ({ rating, text, author }: CommentProps) => {
  return (
    <Column
      style={{
        width: "100%",
        padding: 16,
        gap: 8,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <SubTitle>{author}</SubTitle>
        <Row style={{ alignItems: "center", gap: 2 }}>
          {renderStars(rating)}
        </Row>
      </View>
      <SmallText style={{ textAlign: "left" }}>{text}</SmallText>
    </Column>
  );
};

export default Comment;
