import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
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
      <View className="flex-1 items-center justify-center bg-green-50 p-5">
        <Text className="text-lg text-gray-500">No results available</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-green-600 rounded-xl py-3 px-8"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-green-50" contentContainerClassName="p-5 pb-10">
      {/* Image Preview */}
      {imageUri ? (
        <View className="bg-white rounded-2xl overflow-hidden mb-5 shadow-sm">
          <Image
            source={{ uri: imageUri }}
            className="w-full h-56"
            resizeMode="contain"
          />
        </View>
      ) : null}

      {/* Top Prediction */}
      {result.top_prediction && (
        <View className="mb-5">
          <PredictionCard prediction={result.top_prediction} isTop />
        </View>
      )}

      {/* All Predictions */}
      <View className="bg-white rounded-2xl p-5 shadow-sm mb-5">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          All Predictions
        </Text>
        <View className="gap-3">
          {result.predictions.slice(0, MAX_TOP_N).map((pred, index) => (
            <PredictionCard key={index} prediction={pred} />
          ))}
        </View>
      </View>

      {/* New Scan Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        className="bg-green-600 rounded-xl py-4 items-center"
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-lg">New Scan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
