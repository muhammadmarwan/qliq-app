import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Text,
  Card,
  Button,
  Surface,
  ActivityIndicator,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { addToCart, getProductsList } from "../api/api";

const bannerImages = [
  "https://t4.ftcdn.net/jpg/11/91/18/69/360_F_1191186909_gJgpfaofA5UufQ6fi4F0Rn2ce8zCZYEr.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREEU83UTWvwJKKbrKImTjcHxQ3C7rLJro5uIBgk3V15f5L0iishn0ax9UHHXUnYBRRRlo&usqp=CAU",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg5udE9uJb0LKuSO3Q2PfO4j-jB9ab1bcRU4PXo9srsKOSLq9qPYka-hqS_O25qBUoVv8&usqp=CAU",
];

export default function HomeScreen({ navigation }: any) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Add to cart and update local cart count
  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product._id);
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, cart: (p.cart || 0) + 1 } : p
        )
      );
    } catch (error) {
      console.error("Add to cart failed", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % bannerImages.length;
      setActiveIndex(nextIndex);
      carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 2000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsList();
        setProducts(res);
        if (res === 401) {
          navigation.navigate("Login");
        }
      } catch (err) {
        console.error("Product fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);



  if (loading) {
    return (
      <Surface style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#6200ee" />
      </Surface>
    );
  }

  return (
    <Surface style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: "https://www.onlygfx.com/wp-content/uploads/2016/01/hexagon-photography-icon-logo-2.png",
            }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>QLIQ MLM</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <MaterialCommunityIcons name="magnify" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Banner Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          data={bannerImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          ref={carouselRef}
          onScroll={(e) => {
            const index = Math.round(
              e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
            );
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.bannerImage} />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            {item.image && (
              <Card.Cover source={{ uri: item.image }} style={styles.cardImage} />
            )}
            <Card.Content>
              <Text style={styles.productName}>{item.name}</Text>
              {item.description && (
                <Text style={styles.productDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              <Text style={styles.productPrice}>${item.price}</Text>
            </Card.Content>
            <Card.Actions style={styles.cartActions}>
              <Button onPress={() => handleAddToCart(item)}>Add to Cart</Button>
              {item.cart > 0 && (
                <Text style={styles.cartTag}>In Cart: {item.cart}</Text>
              )}
            </Card.Actions>
          </Card>
        )}
      />
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
  header: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  carouselContainer: {
    height: 220,
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  bannerImage: {
    width: 350,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginRight: 10,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },
  cardImage: {
    height: 120,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    color: "#333",
  },
  productDescription: {
    fontSize: 13,
    color: "#555",
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 4,
    color: "#6200ee",
  },
  cartActions: {
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: "row",
  },
  cartTag: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4CAF50",
  },
});
