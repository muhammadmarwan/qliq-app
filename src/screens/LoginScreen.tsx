import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Image,
  View,
} from "react-native";
import { TextInput, Text, Button, Surface } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setToken } from "../config/redux/slices/authSlice";
import { loginUser } from "../api/api";

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      const token = res.token;
      await AsyncStorage.setItem("token", token);
      dispatch(setToken(token));
      navigation.replace("MainTabs");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Surface style={styles.container}>
          {/* Logo & Title */}
          <View style={styles.header}>
            <Image
              source={{
                uri: "https://www.onlygfx.com/wp-content/uploads/2016/01/hexagon-photography-icon-logo-2.png",
              }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>QLIQ MLM</Text>
          </View>

          {/* Input Fields */}
          <TextInput
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
            error={!!error}
          />

          <TextInput
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            error={!!error}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Log In
          </Button>

          {/* Register Link */}
          <Text
            onPress={() => navigation.navigate("Register")}
            style={styles.registerText}
          >
            Don’t have an account? Create one
          </Text>
        </Surface>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: "#f0f2f5",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1877f2",
  },
  input: {
    width: "100%",
    marginBottom: 16,
  },
  button: {
    width: "100%",
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  registerText: {
    marginTop: 24,
    color: "#1877f2",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
