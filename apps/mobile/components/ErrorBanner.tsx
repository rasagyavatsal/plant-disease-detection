import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <View className="bg-error/10 border border-error/20 rounded-xl p-4 flex-row items-start">
      <View className="w-5 h-5 rounded-full bg-error/20 items-center justify-center mr-3 mt-0.5">
        <Text className="text-[10px] text-error font-bold">!</Text>
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-error text-[13px] mb-0.5">
          Analysis Failed
        </Text>
        <Text className="text-error/70 text-[13px] leading-relaxed">
          {message}
        </Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} className="p-1 ml-2">
          <Text className="text-text-tertiary text-[14px]">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
