import { TextInput, View, StyleSheet } from "react-native";

interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function Input(props: InputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#808080"
        placeholder={props.placeholder}
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
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: "#808080",
  },
  input: {
    flex: 1,
    color: "#000",
  },
});
