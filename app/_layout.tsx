import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { primary } from "@/utils/colors";
import { SubTitle } from "@/components/ui/SubTitle";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

// Set splash screen background color
// SplashScreen.setBackgroundColorAsync("#f7741c");

export default function Layout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      router.push("/home");
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Could add a loader here if you want
  }

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
