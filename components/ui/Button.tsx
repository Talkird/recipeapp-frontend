import React from "react";
import { Pressable, Text } from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
}

export function Button(props: ButtonProps) {
  return (
    <Pressable className="bg-blue-500 p-4 rounded-lg" onPress={props.onPress}>
      <Text>{props.children}</Text>
    </Pressable>
  );
}
