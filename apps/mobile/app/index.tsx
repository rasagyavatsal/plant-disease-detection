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
    <View className="flex-1 bg-bg">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-4 pb-10"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-[26px] font-extrabold text-text-primary tracking-tight">
            Identify Plant{"\n"}Diseases
          </Text>
          <Text className="text-[15px] text-text-secondary mt-2 leading-relaxed">
            Upload or capture a leaf image to get an instant AI diagnosis.
          </Text>
        </View>

        {/* Image Picker Card */}
        <View className="bg-surface rounded-2xl border border-border-subtle overflow-hidden mb-4">
          <View className="px-5 pt-4 pb-3 flex-row items-center justify-between">
            <Text className="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest">
              Plant Image
            </Text>
            {imageUri && (
              <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
                <Text className="text-[12px] text-text-tertiary">Reset</Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="px-5 pb-5">
            <ImagePicker
              imageUri={imageUri}
              onImageSelected={handleImageSelected}
            />
          </View>
        </View>

        {/* Error */}
        {error && (
          <View className="mb-4">
            <ErrorBanner message={error} onDismiss={reset} />
          </View>
        )}

        {/* Analyze Button */}
        {imageUri && (
          <TouchableOpacity
            onPress={handleAnalyze}
            disabled={loading}
            className={`rounded-xl py-4 items-center flex-row justify-center gap-2 ${loading ? "bg-surface-elevated" : "bg-accent"
              }`}
            activeOpacity={0.8}
          >
            <Text
              className={`font-bold text-[15px] ${loading ? "text-text-tertiary" : "text-bg"
                }`}
            >
              {loading ? "Analyzing…" : "Analyze Disease"}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <LoadingOverlay visible={loading} />
    </View>
  );
}
