import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import "../global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#ffffff" },
          headerTintColor: "#111827",
          headerTitleStyle: { fontWeight: "700" },
          contentStyle: { backgroundColor: "#f0fdf4" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "CropIntel",
            headerLargeTitle: true,
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
