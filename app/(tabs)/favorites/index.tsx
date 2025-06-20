import React from "react";
import { Column } from "@/components/ui/Column";
import { Title } from "@/components/ui/Title";

export default function Index() {
  return (
    <Column
      style={{ flex: 1, gap: 32, justifyContent: "flex-start", marginTop: 32 }}
    >
      <Title>Recetas guardadas</Title>
    </Column>
  );
}
