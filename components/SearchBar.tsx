import { Row } from "./ui/Row";
import { StyleSheet } from "react-native";
import { Search } from "lucide-react-native";
import { TextInput } from "react-native";

function SearchBar() {
  return (
    <Row style={styles.searchBar}>
      <TextInput
        placeholder="Buscar recetas"
        placeholderTextColor={"#808080"}
        style={{
          flex: 1,
          padding: 12,
          fontSize: 16,
          color: "#000",
        }}
      />
      <Search style={styles.icon} />
    </Row>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    width: "80%",
    borderRadius: 24,
    backgroundColor: "#D9D9D9",
    paddingHorizontal: 12,
  },
  icon: {
    width: 20,
    height: 20,
    color: "#808080",
  },
});

export default SearchBar;
