import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInput,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { Title } from "./ui/Title";

interface CodeInputProps {
  value: string;
  setValue: (val: string) => void;
  cellCount?: number;
}

export function CodeInput({ value, setValue, cellCount = 6 }: CodeInputProps) {
  const ref = useBlurOnFulfill({
    value,
    cellCount,
  }) as React.RefObject<TextInput>;
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={setValue}
      cellCount={cellCount}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      autoComplete="one-time-code"
      InputComponent={TextInput}
      renderCell={({ index, symbol, isFocused }) => (
        <View
          key={index}
          style={[styles.numberBox, isFocused && styles.focusedBox]}
          onLayout={getCellOnLayoutHandler(index)}
        >
          <Title style={styles.cellText}>
            {symbol || (isFocused ? <Cursor /> : null)}
          </Title>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  codeFieldRoot: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  numberBox: {
    width: 50,
    height: 65,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
    justifyContent: "center",
    alignItems: "center",
  },
  focusedBox: {
    borderWidth: 2,
    borderColor: "#000",
  },
  cellText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
});
