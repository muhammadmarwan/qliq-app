import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Text, Surface, Button } from "react-native-paper";
import { checkoutOrder } from "../api/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function CheckoutScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const tickScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spinner rotate animation
    const spinnerAnim = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Scale pulse animation
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );

    spinnerAnim.start();
    pulseAnim.start();

    const processCheckout = async () => {
      try {
        const res = await checkoutOrder();
        setSuccess(true);

        // Stop animations
        spinnerAnim.stop();
        pulseAnim.stop();

        // Animate tick scale
        Animated.spring(tickScaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 100,
          useNativeDriver: true,
        }).start();
      } catch (err) {
        setError("Checkout failed. Please try again.");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    processCheckout();

    // Cleanup animations on unmount
    return () => {
      spinnerAnim.stop();
      pulseAnim.stop();
    };
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (loading && !error) {
    return (
      <Surface style={[styles.container, styles.center]}>
        <Animated.View
          style={[
            styles.spinner,
            {
              transform: [
                { rotate: rotateInterpolate },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="loading"
            size={60}
            color="#6200ee"
            style={{ opacity: 0.8 }}
          />
        </Animated.View>
        <Text style={styles.loadingText}>
          Processing your payment...
        </Text>
      </Surface>
    );
  }

  if (success) {
    return (
      <Surface style={[styles.container, styles.center]}>
        <Animated.View style={[styles.tickContainer, { transform: [{ scale: tickScaleAnim }] }]}>
          <MaterialCommunityIcons
            name="check-circle"
            size={120}
            color="green"
          />
        </Animated.View>
        <Text variant="headlineMedium" style={styles.successText}>
          Payment Successful!
        </Text>
        <Button
          mode="contained"
          style={styles.backButton}
          onPress={() => navigation.navigate("MainTabs")}
        >
          Back to Home
        </Button>
      </Surface>
    );
  }

  return (
    <Surface style={[styles.container, styles.center]}>
      <Text variant="headlineMedium" style={styles.errorText}>
        {error}
      </Text>
      <Button mode="contained" onPress={() => navigation.goBack()}>
        Try Again
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: "#f7f7f7",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spinner: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: "#6200ee",
  },
  tickContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    marginTop: 20,
    color: "green",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 30,
    width: width * 0.6,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
});
