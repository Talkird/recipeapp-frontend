import React from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";
import { LucideIcon } from "lucide-react-native";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  Icon?: LucideIcon;
  type?: "text" | "password";
  disabled?: boolean;
  style?: any;
  multiline?: boolean;
  numberOfLines?: number;
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  Icon,
  type = "text",
  disabled = false,
  style,
  multiline = false,
  numberOfLines = 1,
}: InputProps) {
  return (
    <View
      style={[styles.container, style, multiline && styles.multilineContainer]}
    >
      {Icon && (
        <View
          style={{
            width: 24,
            height: 24,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: multiline ? "flex-start" : "center",
            marginTop: multiline ? 12 : 0,
          }}
        >
          <Icon size={20} color="#808080" />
        </View>
      )}
      <TextInput
        style={[styles.input, multiline && { textAlignVertical: "top" }]}
        placeholderTextColor="#808080"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={type === "password"}
        editable={!disabled}
        autoCapitalize="none"
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
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
  multilineContainer: {
    borderRadius: 12,
    alignItems: "flex-start",
    minHeight: 60,
  },
  input: {
    flex: 1,
    color: "#000",
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
});
