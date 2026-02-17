import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PredictionCard } from "../components/PredictionCard";
import { MAX_TOP_N } from "@cropintel/shared";
import type { PredictionResponse } from "@cropintel/shared";

export default function ResultsScreen() {
  const { data, imageUri } = useLocalSearchParams<{
    data: string;
    imageUri: string;
  }>();
  const router = useRouter();

  const result: PredictionResponse | null = React.useMemo(() => {
    try {
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, [data]);

  if (!result) {
    return (
      <View className="flex-1 items-center justify-center bg-bg px-5">
        <View className="w-14 h-14 rounded-2xl bg-surface-elevated items-center justify-center mb-4">
          <Text className="text-2xl">🔍</Text>
        </View>
        <Text className="text-[15px] text-text-tertiary text-center mb-5">
          No results available
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-accent rounded-xl py-3 px-8"
          activeOpacity={0.8}
        >
          <Text className="text-bg font-semibold text-[15px]">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-bg"
      contentContainerClassName="px-5 pt-4 pb-10"
    >
      {/* Image Preview */}
      {imageUri ? (
        <View className="bg-surface rounded-2xl overflow-hidden mb-5 border border-border-subtle">
          <Image
            source={{ uri: imageUri }}
            className="w-full h-56"
            resizeMode="contain"
          />
        </View>
      ) : null}

      {/* Top Prediction */}
      {result.top_prediction && (
        <View className="mb-4">
          <PredictionCard prediction={result.top_prediction} isTop />
        </View>
      )}

      {/* All Predictions */}
      <View className="bg-surface rounded-2xl border border-border-subtle overflow-hidden mb-5">
        <View className="px-5 pt-4 pb-3">
          <Text className="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest">
            Other Possibilities
          </Text>
        </View>
        <View className="px-5 pb-5 gap-2.5">
          {result.predictions.slice(1, MAX_TOP_N).map((pred, index) => (
            <PredictionCard key={index} prediction={pred} />
          ))}
        </View>
      </View>

      {/* New Scan Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-surface border border-border-subtle rounded-xl py-4 items-center"
        activeOpacity={0.8}
      >
        <Text className="text-text-secondary font-semibold text-[15px]">
          New Scan
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
