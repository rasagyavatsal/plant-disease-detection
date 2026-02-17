import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ImagePicker } from "../components/ImagePicker";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { ErrorBanner } from "../components/ErrorBanner";
import { usePredict } from "../hooks/usePredict";

export default function HomeScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { loading, error, result, analyze, reset } = usePredict();
  const router = useRouter();

  const handleImageSelected = (uri: string) => {
    setImageUri(uri);
    reset();
  };

  const handleAnalyze = async () => {
    if (!imageUri) return;
    await analyze(imageUri);
  };

  const handleReset = () => {
    setImageUri(null);
    reset();
  };

  // Navigate to results when we get a result
  React.useEffect(() => {
    if (result) {
      router.push({
        pathname: "/results",
        params: { data: JSON.stringify(result), imageUri: imageUri || "" },
      });
    }
  }, [result]);

  return (
    <View className="flex-1 bg-green-50">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        {/* Title Section */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900">
            Plant Disease{"\n"}Detection
          </Text>
          <Text className="text-base text-gray-500 mt-2">
            Upload or capture a plant leaf image to identify diseases
          </Text>
        </View>

        {/* Image Picker */}
        <View className="bg-white rounded-2xl p-5 shadow-sm mb-5">
          <ImagePicker
            imageUri={imageUri}
            onImageSelected={handleImageSelected}
          />
        </View>

        {/* Error */}
        {error && (
          <View className="mb-5">
            <ErrorBanner message={error} onDismiss={reset} />
          </View>
        )}

        {/* Action Buttons */}
        {imageUri && (
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleAnalyze}
              disabled={loading}
              className={`rounded-xl py-4 items-center ${
                loading ? "bg-gray-400" : "bg-green-600"
              }`}
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Analyzing..." : "Analyze Disease"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReset}
              disabled={loading}
              className="bg-gray-200 rounded-xl py-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-gray-700 font-semibold text-base">
                Reset
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <LoadingOverlay visible={loading} />
    </View>
  );
}
