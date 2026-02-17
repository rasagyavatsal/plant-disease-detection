import React from "react";
import { View, Text } from "react-native";
import { ConfidenceBar } from "./ConfidenceBar";
import type { Prediction } from "@cropintel/shared";

interface PredictionCardProps {
  prediction: Prediction;
  isTop?: boolean;
}

export function PredictionCard({
  prediction,
  isTop = false,
}: PredictionCardProps) {
  const percentage = (prediction.score * 100).toFixed(1);

  if (isTop) {
    return (
      <View className="bg-green-50 border border-green-200 rounded-2xl p-5">
        <View className="flex-row items-center mb-2">
          <Text className="text-green-700 text-base font-semibold mr-2">
            ✅ Detected
          </Text>
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-3">
          {prediction.label}
        </Text>
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <ConfidenceBar score={prediction.score} height={8} />
          </View>
          <Text className="text-base font-bold text-green-700">
            {percentage}%
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-gray-50 rounded-xl p-4">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="font-medium text-gray-900 flex-1 mr-2">
          {prediction.label}
        </Text>
        <Text className="text-sm font-semibold text-gray-600">
          {percentage}%
        </Text>
      </View>
      <ConfidenceBar score={prediction.score} height={4} color="#22c55e" />
    </View>
  );
}
