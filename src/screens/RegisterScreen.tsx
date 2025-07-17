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
import { Surface, TextInput, Text, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { registerUser } from "../api/api";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        name,
        email,
        password,
        referalCode: referralCode.trim() || null,
      };
      await registerUser(payload);
      navigation.replace("Login");
    } catch (err) {
      setError("Registration failed. Please try again.");
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

          <TextInput
            label="Name"
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            error={!!error && !name}
          />

          <TextInput
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            mode="outlined"
            style={styles.input}
            error={!!error && !email}
          />

          <TextInput
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            error={!!error && !password}
          />

          <TextInput
            label="Referral Code (Optional)"
            placeholder="Enter 6-digit code"
            value={referralCode}
            onChangeText={setReferralCode}
            mode="outlined"
            style={styles.input}
          />

          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Register
          </Button>

          <Text
            onPress={() => navigation.navigate("Login")}
            style={styles.loginText}
          >
            Already have an account? Login
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
    alignItems: "center",
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
  loginText: {
    marginTop: 24,
    color: "#1877f2",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
