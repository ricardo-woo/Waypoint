import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';

interface LoginResponse {
  access_token: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore((state) => state.login);

  async function handleLogin() {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    login(response.data.access_token);
  }

  return (
    <View>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title="Login"
        onPress={() => {
          void handleLogin();
        }}
      />
    </View>
  );
}
