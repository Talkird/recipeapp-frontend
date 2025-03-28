import { Text, View, TextInput } from "react-native";
import { UserIcon } from "react-native-heroicons/solid";

export default function Input() {
  return (
    <View className="w-[250px] gap-[10px] bg-white rounded-full flex flex-row py-3 px-4 items-center justify-start border border-[#808080]">
      <UserIcon color={"#808080"} className="h-6 w-6" />
      <TextInput
        className="w-full"
        placeholderTextColor={"#808080"}
        placeholder="Username"
      />
    </View>
  );
}
