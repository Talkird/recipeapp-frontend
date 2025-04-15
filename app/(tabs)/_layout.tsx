import { Tabs } from "expo-router";
import { primary } from "@/utils/colors";
import {
  Home,
  Star,
  GraduationCap,
  User,
  CirclePlus,
} from "lucide-react-native";
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primary,
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Home size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites/index"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Star size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="add/index"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <CirclePlus size={32} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="courses/index"
        options={{
          title: "Courses",
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
          title: "User",
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
