import { Tabs } from "expo-router";
import { primary } from "@/utils/colors";
import {
  Home,
  GraduationCap,
  User,
  CirclePlus,
  Heart,
  Clock,
} from "lucide-react-native";
import { View } from "react-native";
import { SubTitle } from "@/components/ui/SubTitle";
import { useUserStore } from "@/stores/user";

export default function TabLayout() {
  const isGuest = useUserStore((s) => s.isGuest);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primary,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
          marginBottom: 0,
        },
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          backgroundColor: "#fff",
          borderTopWidth: 0.5,
          borderTopColor: "#eee",
        },
        headerShown: true, // Always show header
        headerTitle: () => <SubTitle>Recipedia</SubTitle>,
        headerStyle: {
          backgroundColor: "#ffffff",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "600",
        },
        headerLeft: () => null, // Remove back button for main tab screens
      }}
    >
      {/* Main tab screens - only these 5 should show */}
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Home size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites/index"
        options={{
          title: "Favoritos",
          tabBarLabel: "Favoritos",
          href: isGuest ? null : undefined, // Hide tab for guests
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Heart size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add/index"
        options={{
          title: "Crear",
          tabBarLabel: "Crear",
          href: isGuest ? null : undefined, // Hide tab for guests
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <CirclePlus size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pending/index"
        options={{
          title: "Pendientes",
          tabBarLabel: "Pendientes",
          href: isGuest ? null : undefined, // Hide tab for guests
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Clock size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="courses/index"
        options={{
          title: "Cursos",
          tabBarLabel: "Cursos",
          href: undefined, // Always show this tab (for both guests and authenticated users)
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <GraduationCap size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="user/index"
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          href: isGuest ? null : undefined, // Hide tab for guests
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <User size={24} color={color} />
            </View>
          ),
        }}
      />
      {/* Hide all nested/dynamic routes from tab bar */}
      <Tabs.Screen
        name="home/recipe/[id]"
        options={{
          href: null, // This hides the route from the tab bar
          headerShown: true,
          headerTitle: () => <SubTitle>Receta</SubTitle>,
          headerStyle: {
            backgroundColor: "#ffffff",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerLeft: undefined, // This allows the back button to show
          headerTintColor: primary,
        }}
      />
      <Tabs.Screen
        name="home/placeholder/index"
        options={{
          href: null,
          headerShown: true,
          headerTitle: () => <SubTitle>Recipedia</SubTitle>,
          headerStyle: {
            backgroundColor: "#ffffff",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerLeft: undefined,
          headerTintColor: primary,
        }}
      />
      <Tabs.Screen
        name="courses/course/[id]"
        options={{
          href: null,
          headerShown: true,
          headerTitle: () => <SubTitle>Curso</SubTitle>,
          headerStyle: {
            backgroundColor: "#ffffff",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerLeft: undefined,
          headerTintColor: primary,
        }}
      />
      <Tabs.Screen
        name="courses/course/inscrito/[id]"
        options={{
          href: null,
          headerShown: true,
          headerTitle: () => <SubTitle>Mi Curso</SubTitle>,
          headerStyle: {
            backgroundColor: "#ffffff",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerLeft: undefined,
          headerTintColor: primary,
        }}
      />
    </Tabs>
  );
}
