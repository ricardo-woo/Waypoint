import { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";

import { router } from "expo-router";

import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";
import AppButton from "../components/AppButton";
import FormField from "../components/Formfield";
import AuthScreen from "../components/AuthScreen";
import AuthHeader from "../components/AuthHeader";
import AuthFooterLink from "../components/Authfooterlink";
import BrandMark from "../components/Brandmark";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  email?: string;

  password?: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const login = useAuthStore((state) => state.login);

  function updateField(
    field: keyof FormErrors,
    setter: (value: string) => void,
  ) {
    return (value: string) => {
      setter(value);
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  }

  function validate() {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      await login(response.data.access_token);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Login failed", "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthScreen>
      <BrandMark />

      <AuthHeader
        title="Welcome back"
        subtitle="Sign in to pick up where you left off."
      />

      <View style={styles.form}>
        <FormField
          label="Email"
          placeholder="you@example.com"
          onChangeText={updateField("email", setEmail)}
          error={errors.email}
        />

        <FormField
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          onChangeText={updateField("password", setPassword)}
          error={errors.password}
        />

        <AppButton title="Login" onPress={handleLogin} loading={isLoading} />
      </View>

      <AuthFooterLink
        text="Don't have an account?"
        linkText="Create one"
        onPress={() => router.push("/register")}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 18,
  },
});
