import { TextInput, View, StyleSheet } from "react-native";

export default function Input() {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor="#808080"
        placeholder="Username"
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
