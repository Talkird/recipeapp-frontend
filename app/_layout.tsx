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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/stores/user";
import { useNetworkMonitor } from "@/hooks/useNetworkMonitor";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const { login, setAuthToken } = useUserStore();

  // Monitor network changes and upload pending recipes when WiFi is available
  useNetworkMonitor();

  useEffect(() => {
    const checkStoredCredentials = async () => {
      try {
        const storedCredentials = await AsyncStorage.getItem("userCredentials");
        if (storedCredentials) {
          const { mail, password } = JSON.parse(storedCredentials);
          try {
            await login(mail, password);
            router.replace("/home");
          } catch (error) {
            console.log("Auto-login failed, removing stored credentials");
            await AsyncStorage.removeItem("userCredentials");
            router.replace("/login");
          }
        } else {
          router.replace("/login");
        }
      } catch (error) {
        console.error("Error checking stored credentials:", error);
        router.replace("/login");
      }
    };

    if (fontsLoaded) {
      SplashScreen.hideAsync();
      checkStoredCredentials();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
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
        // Prevent going back to login from authenticated screens
        gestureEnabled: true,
      }}
    >
      {/* Hide header for login and register screens */}
      <Stack.Screen
        name="login/index"
        options={{
          headerShown: false,
          gestureEnabled: false, // Prevent swipe back on login
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="forgot"
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      {/* Authenticated screens with proper back navigation */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false, // Let tabs handle their own headers
          gestureEnabled: false, // Main tabs shouldn't allow swipe back
        }}
      />
    </Stack>
  );
}
