# QLIQ MLM & eCommerce React Native App

A modern **React Native** mobile application built with **Expo Router**, integrating **MLM user tree**, **eCommerce functionality**, **real-time notifications**, and **authentication**. 

---

## ✨ Features

- 🔐 **User Authentication**
- 🛒 **Product Listing & Cart System**
- ✅ **Order Management**
- 👤 **User Profile View**
- 🌳 **MLM Tree View**
- 🔔 **Live Notifications via Socket.IO**
- 🔄 **Secure API Communication with Token Interceptors**

---

## 📸 Screenshots

| Home Page | Cart Page |
|----------|-----------|
| ![Home](https://drive.google.com/uc?id=1Is0PLvFEi_BfP1emmBK_R7PvtYnt2_5D) | ![Cart](https://drive.google.com/uc?id=1aJjc4Awq61c_MsLqs2Ub2BNHhRU7BUZO) |

| Orders Page | Profile Page |
|-------------|--------------|
| ![Orders](https://drive.google.com/uc?id=1IwhgHRbrIDQUOOoGxVMigKGjpprWN1yn) | ![Profile](https://drive.google.com/uc?id=1gaJdhX8QDQGa20zgcz0xoHbTm7P5Av1n) |

| MLM Tree |
|----------|
| ![MLM Tree](https://drive.google.com/uc?id=1ERXlsEI3Kf_V5GNoRCvLGvxCdPdiN8eM)  |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/qliq-app.git
cd qliq-app
```
2. Install Dependencies
   
```bash
npm install
# or
yarn install
```

3. Add Backend URL
Update your app.json with the correct API base URL:

```bash
{
  "expo": {
    ...
    "extra": {
      "BACKEND_URL": "http://<your-ip>:8000/api"
    }
  }
}
```

Replace <your-ip> with your local or production server address.

4. Start the App
```bash
npx expo start -c
```

The -c flag clears cache for a clean start.

🛠️ Tech Stack
React Native (Expo Router)

NativeWind (Tailwind CSS for RN)

AsyncStorage (Token Storage)

Socket.IO (Real-Time Events)

Axios (API Requests + JWT Interceptor)

Express + MongoDB (Backend API)

📁 Folder Structure
bash
Copy
Edit
src/
├── components/         # UI Components
├── screens/            # Page Screens (Home, Cart, Orders, etc.)
├── services/           # Axios API setup
├── context/            # Global Context Providers
├── assets/             # Icons & Images

🔐 Environment Variables
Set your API base URL in app.json under the extra field:

```bash
"extra": {
  "BACKEND_URL": "http://<your-ip>:8000/api"
}
```

Access it in your code using:

```bash
import Constants from 'expo-constants';

const baseURL = Constants.expoConfig?.extra?.BACKEND_URL;
```

📦 API Integration
All API calls use Axios with an interceptor that attaches the JWT token from AsyncStorage automatically.

```bash
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

📡 Live Notifications
The app uses Socket.IO for real-time updates such as:

User joined events

MLM tree changes

Order confirmations

👥 Contributors
Muhammad Marwan – GitHub

📝 License
This project is licensed under the MIT License.
