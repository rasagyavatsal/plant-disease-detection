import React from "react";
import { View, Text } from "react-native";
import { ConfidenceBar } from "./ConfidenceBar";
import type { Prediction } from "@cropintel/shared";

interface PredictionCardProps {
  prediction: Prediction;
  isTop?: boolean;
}

function getConfidenceColor(score: number): string {
  if (score >= 0.7) return "#2dd4a8";
  if (score >= 0.4) return "#facc15";
  return "#5c6578";
}

function getConfidenceLabel(score: number): string {
  if (score >= 0.8) return "High confidence";
  if (score >= 0.5) return "Moderate confidence";
  return "Low confidence";
}

export function PredictionCard({
  prediction,
  isTop = false,
}: PredictionCardProps) {
  const percentage = (prediction.score * 100).toFixed(1);
  const barColor = getConfidenceColor(prediction.score);

  if (isTop) {
    return (
      <View className="bg-accent/10 border border-accent/20 rounded-2xl p-5">
        <View className="flex-row items-center mb-2">
          <View className="w-5 h-5 rounded-full bg-accent/20 items-center justify-center mr-2">
            <Text className="text-accent text-[10px] font-bold">✓</Text>
          </View>
          <Text className="text-accent text-[11px] font-semibold uppercase tracking-widest">
            Detected
          </Text>
        </View>
        <Text className="text-[18px] font-bold text-text-primary mb-3">
          {prediction.label}
        </Text>
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <ConfidenceBar score={prediction.score} height={6} color={barColor} />
          </View>
          <Text className="text-[14px] font-bold text-accent">
            {percentage}%
          </Text>
        </View>
        <Text className="text-[11px] text-text-tertiary mt-1.5">
          {getConfidenceLabel(prediction.score)}
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-surface-elevated rounded-xl p-4">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="font-medium text-text-secondary flex-1 mr-2 text-[14px]">
          {prediction.label}
        </Text>
        <Text className="text-[12px] font-semibold text-text-tertiary">
          {percentage}%
        </Text>
      </View>
      <ConfidenceBar score={prediction.score} height={3} color={barColor} />
    </View>
  );
}
