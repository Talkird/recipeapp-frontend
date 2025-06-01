import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import Recipe from "@/components/Recipe";
import SearchBar from "@/components/SearchBar";
export default function Index() {
  return (
    <Column
      style={{
        flex: 1,
        gap: 32,
        justifyContent: "flex-start",
        marginTop: 32,
      }}
    >
      <Title>Home</Title>
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
    </Column>
  );
}
