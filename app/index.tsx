import { Text, View, StyleSheet } from "react-native";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pollo</Text>
      <Input />
      <Button>Hola!</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#6C63FF",
  },
});
