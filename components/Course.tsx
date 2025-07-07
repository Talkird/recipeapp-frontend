import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Row } from "./ui/Row";
import { Column } from "./ui/Column";
import { StyleSheet } from "react-native";
import { SubTitle } from "./ui/SubTitle";
import { SmallText } from "./ui/SmallText";
import { primary, orange, gray, darkGray } from "@/utils/colors";
import { ChefHat } from "lucide-react-native";

interface CourseProps {
  id: number;
  title?: string;
  description?: string;
  state: "active" | "inactive";
  // You can add more fields as needed for passing full data
}

const Course = ({ id, title, description, state }: CourseProps) => {
  const router = useRouter();
  const handleClick = () => {
    if (id !== undefined) {
      router.push(`/courses/course/${id}`);
    }
  };

  // Trim description to 25 characters
  const trimmedDescription =
    description && description.length > 25
      ? description.substring(0, 25) + "..."
      : description;

  return (
    <TouchableOpacity
      onPress={handleClick}
      activeOpacity={0.8}
      style={{ width: "95%", alignSelf: "center" }}
    >
      <Row style={styles.container}>
        {/* Icon Section */}
        <View style={styles.iconContainer}>
          <ChefHat size={24} color={primary} />
        </View>

        {/* Content Section */}
        <Column
          style={{
            gap: 2,
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flex: 1,
            paddingLeft: 12,
          }}
        >
          <SubTitle>{title}</SubTitle>
          <SmallText
            style={{
              textAlign: "left",
              color: "#666",
            }}
          >
            {trimmedDescription}
          </SmallText>
        </Column>

        {/* Estado del curso */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: state === "active" ? orange : gray },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: state === "active" ? "#000000" : darkGray },
            ]}
          >
            {state === "active" ? "ABIERTO" : "CERRADO"}
          </Text>
        </View>
      </Row>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
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
    alignItems: "center",
    padding: 0,
    backgroundColor: "#FFFFFF",
  },
  iconContainer: {
    width: 60,
    height: 75,
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "center",
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Course;
