import React from "react";
import { Text, StyleSheet, TextStyle } from "react-native";

interface SubTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function SubTitle({ children, style }: SubTitleProps) {
  return <Text style={[styles.subtitle, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    fontWeight: "medium",
    color: "#000000",
    opacity: 0.8,
  },
});
