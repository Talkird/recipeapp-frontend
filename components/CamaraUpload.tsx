import { View, Text } from "react-native";
import React from "react";
import { Plus } from "lucide-react-native";

const CamaraUpload = () => {
  return (
    <View
      style={{
        width: 170,
        height: 115,
        borderRadius: 12,
        backgroundColor: "#D9D9D9",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Plus size={42} color="#343434" />
    </View>
  );
};

export default CamaraUpload;
