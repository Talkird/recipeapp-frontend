import React from "react";
import { View, ViewStyle, StyleSheet, ViewProps } from "react-native";

interface ColumnProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export function Column({ children, style, ...rest }: ColumnProps) {
  return (
    <View style={[styles.column, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});
