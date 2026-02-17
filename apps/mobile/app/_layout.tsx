import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0c0f14" },
          headerTintColor: "#f0f2f5",
          headerTitleStyle: { fontWeight: "700", fontSize: 17 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: "#0c0f14" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "CropIntel",
          }}
        />
        <Stack.Screen
          name="results"
          options={{
            title: "Results",
            presentation: "card",
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
