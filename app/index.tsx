import React, { useState, useEffect } from "react";
import { Button, View, Text, StyleSheet, Pressable } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useCameraPermissions } from "expo-camera";
import { Link, Stack } from "expo-router";

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermisionGrandet = Boolean(permission?.granted);

  return (
    <View style={styles.container} className=" bg-white">
      <Pressable onPress={requestPermission}>
        <Text className=" text-[20px]">request permisions</Text>
      </Pressable>
      <Link href={"/scanner"} asChild>
        <Pressable disabled={!isPermisionGrandet}>
          <Text
            className={`${
              isPermisionGrandet ? "opacity-50" : "opacity-0"
            } mt-[50px] text-[20px] text-black`}
          >
            scan code
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    alignItems: "center",
  },
});
