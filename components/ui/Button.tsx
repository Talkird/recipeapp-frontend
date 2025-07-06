import React from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { primary } from "@/utils/colors";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export function Button({ children, onPress, style, textStyle, disabled = false }: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withTiming(0.97, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withTiming(1, { duration: 150 });
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View style={[
        styles.button, 
        animatedStyle, 
        style,
        disabled && styles.disabled
      ]}>
        <Text style={[
          styles.text, 
          textStyle,
          disabled && styles.disabledText
        ]}>
          {children}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: primary,
    opacity: 0.8,
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
    width: 235,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "DMSans_500Medium",
    color: "#000000",
    opacity: 0.8,
  },
  disabled: {
    backgroundColor: "#ccc",
    opacity: 0.5,
  },
  disabledText: {
    color: "#666",
    opacity: 0.6,
  },
});
