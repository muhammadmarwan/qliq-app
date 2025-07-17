import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Image,
} from "react-native";
import {
  Text,
  Button,
  Card,
  IconButton,
  Surface,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { getCartDetails, removeFromCart } from "../api/api";
import { useFocusEffect } from "@react-navigation/native";

export default function CartScreen({ navigation }: any) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const data = await getCartDetails();
      setCartItems(data.items || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load cart");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch cart items when tab/screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [])
  );

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleRemoveItem = async (cartItemId: string) => {
    try {
      await removeFromCart(cartItemId);
      Alert.alert("Removed", "Item removed from cart");
      fetchCartItems();
    } catch (error) {
      Alert.alert("Error", "Failed to remove item");
      console.error(error);
    }
  };

  const getTotal = () => {
    return cartItems
      .reduce((sum, item) => {
        const price = item.product?.price ?? 0;
        const quantity = item.quantity ?? 0;
        return sum + price * quantity;
      }, 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <Surface style={[styles.container, styles.center]}>
        <ActivityIndicator animating={true} size="large" color="#6200ee" />
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        My Cart
      </Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Image
                  source={{
                    uri: item.product?.image || "https://via.placeholder.com/80",
                  }}
                  style={styles.productImage}
                />
                <View style={styles.infoContainer}>
                  <Text style={styles.productName}>
                    {item.product?.name || "Unnamed product"}
                  </Text>
                  <Text style={styles.productPrice}>
                    ${item.product?.price?.toFixed(2) || "0.00"} x {item.quantity}
                  </Text>
                </View>
                <IconButton
                  icon="trash-can-outline"
                  iconColor="#e53935"
                  onPress={() =>
                    Alert.alert("Remove Item", `Remove ${item.product?.name}?`, [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Remove",
                        style: "destructive",
                        onPress: () => handleRemoveItem(item._id),
                      },
                    ])
                  }
                />
              </View>
            </Card>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <>
          <Divider style={{ marginVertical: 16 }} />
          <View style={styles.footer}>
            <Text style={styles.totalText}>Total: ${getTotal()}</Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Checkout")}
              style={styles.checkoutButton}
            >
              Checkout
            </Button>
          </View>
        </>
      )}
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
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#fff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  infoContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#6200ee",
    marginTop: 4,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  checkoutButton: {
    width: "100%",
    paddingVertical: 6,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 80,
    color: "#999",
    fontSize: 16,
  },
});
