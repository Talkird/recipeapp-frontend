import React from "react";
import { View, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { SmallText } from "./SmallText";

interface LabelProps {
  text: string;
  Icon: LucideIcon;
}

export default function Label({ text, Icon }: LabelProps) {
  return (
    <View style={styles.container}>
      <Icon size={20} color="#808080" />
      <SmallText>{text}</SmallText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
    backgroundColor: "#dddddd",
    borderRadius: 999,
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#808080",
  },
});
