import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
}

export function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 bg-bg/90 items-center justify-center z-50">
      <View className="bg-surface rounded-2xl p-8 items-center border border-border-subtle">
        <ActivityIndicator size="large" color="#2dd4a8" />
        <Text className="text-[15px] font-semibold text-text-primary mt-4">
          Analyzing…
        </Text>
        <Text className="text-[12px] text-text-tertiary mt-1">
          Identifying plant disease
        </Text>
      </View>
    </View>
  );
}
