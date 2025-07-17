import API from "./axios";

export async function loginUser(email: string, password: string) {
  try {
    const response = await API.post("/auth/user/login", { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function registerUser(paload: any) {
  try {
    const response = await API.post("/auth/user/register", paload);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getProductsList() {
  try {
    const response = await API.get("/products/products-list");
    return response.data;
  } catch (error: any) {
    return error.status;
  }
}

export async function addToCart(productId: string) {
  try {
    const response = await API.post("/cart/add", 
      { productId: productId,
        quantity: 1
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function removeFromCart(productId: string) {
  try {
    const response = await API.delete("/cart/remove/" + productId);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getCartDetails() {
  try {
    const response = await API.get("/cart");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function checkoutOrder() {
  try {
    const response = await API.post("/checkout");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserDetails() {
  try {
    const response = await API.get("/users/me");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserMLMDetails() {
  try {
    const response = await API.get("/users/mlm-tree-user");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAllOrders() {
  try {
    const response = await API.get("/orders/get-all-orders");
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAIProductsSuggestions() {
  try {
    const response = await API.get("/products/recommendations-ai");
    return response.data;
  } catch (error) {
    throw error;
  }
}




