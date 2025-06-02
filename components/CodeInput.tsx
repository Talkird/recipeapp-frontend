import { View } from "react-native";
import { Row } from "./ui/Row";
import React from "react";
import { StyleSheet } from "react-native";

interface CodeInputProps {
  value?: number[];
}

const CodeInput = ({ value }: CodeInputProps) => {
  return <Row style={{ gap: 10 }}>Hola</Row>;
};

const styles = StyleSheet.create({
  numberBox: {
    width: 50,
    height: 65,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignContent: "center",
  },
});

export default CodeInput;
