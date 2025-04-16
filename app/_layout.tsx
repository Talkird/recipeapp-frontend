import React from "react";
import { Stack } from "expo-router";
import { primary } from "@/utils/colors";
import { SubTitle } from "@/components/ui/SubTitle";
export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: () => <SubTitle>Recipedia</SubTitle>,
        headerBackTitle: "Volver",
        headerTintColor: primary,
        headerStyle: { backgroundColor: "#ffffff" },
        contentStyle: { backgroundColor: "#f5f5f5" },
      }}
    />
  );
}
