import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-white/80 items-center justify-center z-50">
      <View className="bg-white rounded-2xl p-8 shadow-lg items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-lg font-semibold text-gray-700 mt-4">
          Analyzing...
        </Text>
        <Text className="text-sm text-gray-400 mt-1">
          Identifying plant disease
        </Text>
      </View>
    </View>
  );
}
