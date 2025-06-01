import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import RecipeListItem from "@/components/RecipeListItem";
import SearchBar from "@/components/SearchBar";
export default function Index() {
  return (
    <Column
      style={{
        flex: 1,
        gap: 32,
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 32,
      }}
    >
      <Title>Home</Title>
      <SearchBar />
      <RecipeListItem
        title={"Pizza Margarita"}
        author={"Juan Losauro"}
        cookTime={40}
        servings={4}
        rating={4.5}
        imageUrl="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
    </Column>
  );
}
