import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Text,
  Button,
  Surface,
  Avatar,
  Card,
  IconButton,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard"; // expo clipboard
import { useDispatch } from "react-redux";
import { logout } from "../config/redux/slices/authSlice";

// Import your existing API helper
import { getUserDetails } from "../api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface IUser {
  name: string;
  email: string;
  referralCode: string;
  commissionBalance: number;
}

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<IUser | null>(null);
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    loadUserDetails();
  }, []);

  const loadUserDetails = async () => {
    try {
      const data = await getUserDetails();
      setUser({
        name: data.name,
        email: data.email,
        referralCode: data.referralCode,
        commissionBalance: data.commissionBalance,
      });
    } catch (error) {
      console.error("Failed to load user details:", error);
      Alert.alert("Error", "Could not load user data. Please try again.");
    }
  };

  const handleCopyCode = async () => {
    if (!user?.referralCode) return;

    await Clipboard.setStringAsync(user.referralCode);
    setCopied(true);
    Alert.alert("Copied", "Referral code copied to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch(logout());
    navigation.replace("Login");
  };

  if (!user) {
    return (
      <Surface style={styles.container}>
        <Text>Loading user data...</Text>
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      {/* User Info */}
      <View style={styles.profileSection}>
        <Avatar.Text size={64} label={user.name.charAt(0)} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Referral Code Card */}
      <Card style={styles.card}>
        <Card.Title
          title="Your Referral Code"
          left={(props) => (
            <MaterialCommunityIcons
              {...props}
              name="gift-outline"
              size={24}
              color="#6200ee"
              style={{ marginLeft: 10 }}
            />
          )}
        />
        <Card.Content>
          <View style={styles.centeredRow}>
            <Text style={styles.referralCode}>{user.referralCode}</Text>
            <IconButton
              icon="content-copy"
              onPress={handleCopyCode}
              size={20}
              iconColor="#6200ee"
              style={{ marginLeft: 4 }}
            />
          </View>
          <Text style={styles.hint}>
            Share this code and earn rewards for each signup.
          </Text>
        </Card.Content>
      </Card>

      {/* Balance Card */}
      <Card style={[styles.card, { marginTop: 20 }]}>
        <Card.Title
          title="Available Balance"
          left={(props) => (
            <MaterialCommunityIcons
              {...props}
              name="cash"
              size={24}
              color="#4caf50"
              style={{ marginLeft: 10 }}
            />
          )}
        />
        <Card.Content style={styles.centeredContent}>
          <Text style={styles.balance}>${user.commissionBalance.toFixed(2)}</Text>
          <Text style={styles.hint}>Earn more by inviting friends.</Text>
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          mode="contained-tonal"
          icon="logout"
          onPress={handleLogout}
          contentStyle={{ flexDirection: "row-reverse" }}
        >
          Logout
        </Button>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "#777",
  },
  card: {
    elevation: 3,
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingBottom: 10,
  },
  centeredRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  referralCode: {
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 2,
    color: "#6200ee",
  },
  centeredContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  balance: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4caf50",
  },
  hint: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
  },
  logoutContainer: {
    marginTop: 30,
    alignItems: "center",
  },
});
