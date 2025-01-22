import { CameraView } from "expo-camera";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, ActivityIndicator, Text, View, Image } from "react-native";
import { Stack } from "expo-router";

interface BarcodeScannedEvent {
  data: string; // Define the type of 'data' (e.g., string)
}

export default function Home() {
  const [barcode, setBarcode] = useState<string | null>(null); // State to store the scanned barcode
  const [productData, setProductData] = useState<any | null>(null); // State to store API response
  const [loading, setLoading] = useState(false); // State to handle loading
  const [hasScanned, setHasScanned] = useState(false); // Flag to track if a barcode has been scanned

  const fetchProductData = async (barcode: string) => {
    try {
      setLoading(true); // Start loading
      const apiKey = "9sztc17fm5ffw58hsiwr7f265s9a92"; // Your API key
      const url = `https://api.barcodelookup.com/v3/products?barcode=${barcode}&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      setProductData(data?.products?.[0]); // Store the first product from the response
    } catch (error) {
      console.error("Error fetching product data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleBarcodeScanned = ({ data }: BarcodeScannedEvent) => {
    if (!hasScanned) {
      setHasScanned(true); // Prevent further scans
      setBarcode(data); // Store the scanned barcode
    }
  };

  // Effect to trigger API call when barcode changes
  useEffect(() => {
    if (barcode) {
      fetchProductData(barcode);
    }
  }, [barcode]);

  return (
    <SafeAreaView className="bg-slate-600" style={StyleSheet.absoluteFillObject}>
      <Stack.Screen
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      {!hasScanned ? (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          className=""
          facing="back"
          onBarcodeScanned={handleBarcodeScanned}
        />
      ) : (
        <View style={styles.resultContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : productData ? (
            <View style={styles.productContainer}>
              <Image
                source={{ uri: productData.images?.[0] }}
                style={styles.productImage}
              />
              <Text style={styles.productName} className=" text-white">
                {productData.title || "Unknown Product"}
              </Text>
              <Text style={styles.productDetail} className=" text-white">
                Calories: {productData.calories || "N/A"}
              </Text>
              <Text style={styles.productDetail} className=" text-white">
                Size: {productData.size || "N/A"}
              </Text>
              <Text style={styles.productDetail} className=" text-white">
                Country of Origin: {productData.country_of_origin || "N/A"}
              </Text>
            </View>
          ) : (
            <Text style={styles.resultText}>No product data found.</Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  productContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: '#332628',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 350,
    height: 230,
    marginBottom: 16,
    borderRadius: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  productDetail: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  resultText: {
    fontSize: 16,
    textAlign: "center",
  },
});
