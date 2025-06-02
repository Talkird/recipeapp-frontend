import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { primary } from "@/utils/colors";
import { Row } from "./Row";
import { SmallText } from "./SmallText";

interface CheckBoxProps {
  label?: string;
  checked?: boolean;
  value?: boolean;
  setValue?: (checked: boolean) => void;
}

const CheckBox = ({
  label,
  checked: checkedProp,
  value,
  setValue,
}: CheckBoxProps) => {
  const isControlled = value !== undefined && setValue !== undefined;
  const [checked, setChecked] = useState(checkedProp ?? false);
  const currentChecked = isControlled ? value : checked;

  const handlePress = () => {
    const newChecked = !currentChecked;
    if (isControlled) {
      setValue?.(newChecked);
    } else {
      setChecked(newChecked);
    }
  };

  return (
    <Row>
      <Pressable
        style={[
          styles.checkbox,
          {
            backgroundColor: currentChecked ? primary : "transparent",
            borderColor: currentChecked ? primary : "#ccc",
          },
        ]}
        onPress={handlePress}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: currentChecked }}
      >
        {currentChecked && <Check size={18} color="#fff" />}
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
