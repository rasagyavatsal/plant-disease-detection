import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <View className="bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-start">
      <Text className="text-red-600 text-lg mr-2">⚠️</Text>
      <View className="flex-1">
        <Text className="font-semibold text-red-900 mb-1">Error</Text>
        <Text className="text-red-700 text-sm">{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} className="p-1">
          <Text className="text-red-400 text-lg">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
