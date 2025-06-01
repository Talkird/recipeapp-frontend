import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";
import SearchBar from "@/components/SearchBar";
import Course from "@/components/Course";
export default function Index() {
  return (
    <Column
      style={{ flex: 1, gap: 32, justifyContent: "flex-start", marginTop: 32 }}
    >
      <Title>Cursos</Title>
      <SearchBar />
      <Course
        state="active"
        title="Curso de Carnes"
        description="Aprende a cocinar carnes desde cero."
        imageUrl="https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWVhdHxlbnwwfHwwfHx8MA%3D%3D"
      />
    </Column>
  );
}
