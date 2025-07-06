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
}

export default function Input({
  placeholder,
  value,
  onChangeText,
  Icon,
  type = "text",
  disabled = false,
}: InputProps) {
  return (
    <View style={styles.container}>
      {Icon && (
        <View
          style={{
            width: 24,
            height: 24,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon size={20} color="#808080" />
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholderTextColor="#808080"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={type === "password"}
        editable={!disabled}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 250,
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
  input: {
    flex: 1,
    color: "#000",
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
});
