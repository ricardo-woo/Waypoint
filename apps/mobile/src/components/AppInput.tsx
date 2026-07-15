import { forwardRef, useState } from "react";
import { TextInput, View, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../theme/colors";

interface AppInputProps extends React.ComponentPropsWithoutRef<
  typeof TextInput
> {
  secureTextEntry?: boolean;
  error?: string | boolean;
  leftIcon?: React.ReactNode;
}

const AppInput = forwardRef<TextInput, AppInputProps>(
  (
    { secureTextEntry, style, onFocus, onBlur, error, leftIcon, ...props },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    function handleFocus(e: any) {
      setFocused(true);
      onFocus?.(e);
    }

    function handleBlur(e: any) {
      setFocused(false);
      onBlur?.(e);
    }

    return (
      <View style={styles.wrapper}>
        {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}

        <TextInput
          ref={ref}
          placeholderTextColor={colors.placeholder}
          style={[
            styles.input,
            focused && styles.inputFocused,
            error && styles.inputError,
            secureTextEntry && styles.inputWithRightIcon,
            leftIcon && styles.inputWithLeftIcon,
            style,
          ]}
          secureTextEntry={secureTextEntry ? !isPasswordVisible : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {secureTextEntry && (
          <Pressable
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            hitSlop={8}
            style={styles.rightIcon}
          >
            <Feather
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={colors.muted}
            />
          </Pressable>
        )}
      </View>
    );
  },
);

AppInput.displayName = "AppInput";

export default AppInput;

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
  },

  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    ...({ outlineStyle: "none" } as any),
  },

  inputFocused: {
    borderColor: colors.primary,
  },

  inputError: {
    borderColor: colors.error,
  },

  inputWithRightIcon: {
    paddingRight: 44,
  },

  inputWithLeftIcon: {
    paddingLeft: 46,
  },

  leftIconWrapper: {
    position: "absolute",
    left: 16,
    zIndex: 1,
    height: 52,
    justifyContent: "center",
  },

  rightIcon: {
    position: "absolute",
    right: 14,
    height: 52,
    justifyContent: "center",
  },
});
