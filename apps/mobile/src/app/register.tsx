import { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";

import { router } from "expo-router";

import { api } from "../api/client";
import AuthScreen from "../components/AuthScreen";
import AuthHeader from "../components/AuthHeader";
import FormField from "../components/Formfield";
import AppButton from "../components/AppButton";
import AuthFooterLink from "../components/Authfooterlink";
import BrandMark from "../components/Brandmark";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  name?: string;

  email?: string;

  password?: string;
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

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

    if (!name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!password) {
      nextErrors.password = "Password is required";
    } else if (password.length < 8) {
      nextErrors.password = "Use at least 8 characters";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function register() {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      Alert.alert("Success", "Account created. Login now.");
    } catch (error) {
      Alert.alert("Error", "Could not create account");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthScreen>
      <BrandMark />

      <AuthHeader title="Create account" subtitle="Sign up to get started." />

      <View style={styles.form}>
        <FormField
          label="Name"
          placeholder="Jane Doe"
          onChangeText={updateField("name", setName)}
          error={errors.name}
        />

        <FormField
          label="Email"
          placeholder="you@example.com"
          onChangeText={updateField("email", setEmail)}
          error={errors.email}
        />

        <FormField
          label="Password"
          placeholder="Use at least 8 characters"
          secureTextEntry
          onChangeText={updateField("password", setPassword)}
          error={errors.password}
        />

        <AppButton title="Register" onPress={register} loading={isLoading} />
      </View>

      <AuthFooterLink
        text="Already have an account?"
        linkText="Log in"
        onPress={() => router.replace("/login")}
      />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 18,
  },
});
