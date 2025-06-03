import React from "react";
import { ScrollView } from "react-native";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import Recipe from "@/components/Recipe";
import SearchBar from "@/components/SearchBar";
export default function Index() {
  return (
    <ScrollView
      style={{ flex: 1, marginBottom: 32 }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Column
        style={{
          flex: 1,
          gap: 32,
          justifyContent: "flex-start",
          marginTop: 32,
        }}
      >
        <Title>Inicio</Title>
        <SearchBar />

        <Recipe
          title={"Pizza Margarita"}
          author={"Juan Losauro"}
          cookTime={45}
          servings={4}
          rating={4.5}
          imageUrl="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Recipe
          title={"Pasta Carbonara"}
          author={"Maria Rossi"}
          cookTime={30}
          servings={2}
          rating={5}
          imageUrl="https://plus.unsplash.com/premium_photo-1664472619078-9db415ebef44?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFzdGF8ZW58MHx8MHx8fDA%3D"
        />
        <Recipe
          title={"Vegan Buddha Bowl"}
          author={"Alex Green"}
          cookTime={25}
          servings={1}
          rating={4}
          imageUrl="https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Recipe
          title={"Chocolate Cake"}
          author={"Sophie Baker"}
          cookTime={60}
          servings={8}
          rating={3.5}
          imageUrl="https://plus.unsplash.com/premium_photo-1668616816933-f3874102f54b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Recipe
          title={"Avocado Toast"}
          author={"Emma Stone"}
          cookTime={10}
          servings={1}
          rating={4.2}
          imageUrl="https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <Recipe
          title={"Indian Curry"}
          author={"Priya Singh"}
          cookTime={50}
          servings={4}
          rating={4.8}
          imageUrl="https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZCUyMGluZGlhbnxlbnwwfHwwfHx8MA%3D%3D"
        />
        <Recipe
          title={"Sushi Platter"}
          author={"Hiro Tanaka"}
          cookTime={40}
          servings={2}
          rating={4.9}
          imageUrl="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3VzaGl8ZW58MHx8MHx8fDA%3D"
        />
        <Recipe
          title={"Falafel Wrap"}
          author={"Layla Hassan"}
          cookTime={20}
          servings={2}
          rating={4.3}
          imageUrl="https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </Column>
    </ScrollView>
  );
}
