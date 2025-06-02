import React, { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
  Theme,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

import { primary } from "@/utils/colors";
import { SubTitle } from "@/components/ui/SubTitle";
import { PortalHost } from "@rn-primitives/portal";

import "~/global.css";

import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";

SplashScreen.preventAutoHideAsync();

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;

export default function Layout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const hasMounted = useRef(false);
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) return;

    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
    }
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isColorSchemeLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
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
      <PortalHost />
    </ThemeProvider>
  );
}
