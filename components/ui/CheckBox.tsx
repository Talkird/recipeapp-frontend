import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { primary } from "@/utils/colors";
import { Row } from "./Row";
import { SmallText } from "./SmallText";

interface CheckBoxProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const CheckBox = ({ label, checked: checkedProp, onChange }: CheckBoxProps) => {
  const [checked, setChecked] = useState(checkedProp ?? false);

  const handlePress = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    onChange?.(newChecked);
  };

  return (
    <Row>
      <Pressable
        style={[
          styles.checkbox,
          {
            backgroundColor: checked ? primary : "transparent",
            borderColor: checked ? primary : "#ccc",
          },
        ]}
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
      >
        {checked && <Check size={18} color="#fff" />}
      </Pressable>
      <SmallText>{label}</SmallText>
    </Row>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
});

export default CheckBox;
