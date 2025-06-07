import { Tabs } from "expo-router";
import { primary } from "@/utils/colors";
import {
  Home,
  GraduationCap,
  User,
  CirclePlus,
  Heart,
} from "lucide-react-native";
import { View } from "react-native";

export default function TabLayout() {
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
        headerShown: false,
      }}
    >
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
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <CirclePlus size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="courses/index"
        options={{
          title: "Cursos",
          tabBarLabel: "Cursos",
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
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <User size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
