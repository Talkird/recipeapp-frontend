import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Row } from "./ui/Row";
import { Column } from "./ui/Column";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { SubTitle } from "./ui/SubTitle";
import { SmallText } from "./ui/SmallText";
import { primary } from "@/utils/colors";

interface CourseProps {
  id: number;
  title?: string;
  description?: string;
  imageUrl: string;
  state: "active" | "inactive";
  // You can add more fields as needed for passing full data
}

const Course = ({ id, title, description, state, imageUrl }: CourseProps) => {
  const router = useRouter();
  const handleClick = () => {
    if (id !== undefined) {
      router.push(`/courses/course/${id}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.8}
      style={{ width: "80%" }}
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
            <SubTitle>{title}</SubTitle>
            <SmallText
              style={{
                width: "80%",
                textAlign: "left",
              }}
            >
              {description}
            </SmallText>
          </Column>
        </Row>
        {/* TODO: Agregar estado del curso */}
      </Row>
    </TouchableOpacity>
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
});

export default Course;
