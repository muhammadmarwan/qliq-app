import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";
import {
  Text,
  Surface,
  Card,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import { getAllOrders } from "../api/api";

export default function OrdersScreen() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAllOrders();
      setOrders(res || []);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch orders.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Surface style={[styles.container, styles.center]}>
        <ActivityIndicator animating={true} size="large" color="#6200ee" />
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>My Orders</Text>

      {orders.length === 0 ? (
        <Text style={styles.emptyText}>You have no past orders.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.orderId}>Order ID: {item.transactionId}</Text>
                <Text style={styles.orderDate}>
                  Ordered on: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.orderStatus}>
                  Payment: {item.paymentStatus.toUpperCase()}
                </Text>
                <Text style={styles.totalAmount}>
                  Total: ${item.total?.toFixed(2)}
                </Text>
                <Text style={styles.itemCount}>
                  Items: {item.items.length}
                </Text>
              </Card.Content>

              <Divider style={{ marginTop: 8 }} />

              {item.items.map((orderItem: any, idx: number) => (
                <View key={idx} style={styles.itemRow}>
                  <Image
                    source={{
                      uri: orderItem.product?.image || "https://via.placeholder.com/60",
                    }}
                    style={styles.productImage}
                  />
                  <View style={styles.itemInfo}>
                    <Text style={styles.productName}>
                      {orderItem.product?.name || "Product"}
                    </Text>
                    <Text style={styles.productDetails}>
                      ${orderItem.product?.price?.toFixed(2)} x {orderItem.quantity}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          )}
        />
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
    marginBottom: 16,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#fff",
    paddingBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  orderDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  orderStatus: {
    fontSize: 12,
    color: "#6200ee",
    marginTop: 2,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    color: "#2e7d32",
  },
  itemCount: {
    fontSize: 12,
    color: "#333",
    marginTop: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: "#eee",
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  productDetails: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 80,
    color: "#999",
    fontSize: 16,
  },
});
