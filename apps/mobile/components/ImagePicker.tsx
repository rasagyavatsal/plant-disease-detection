import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as ExpoImagePicker from "expo-image-picker";

interface ImagePickerProps {
  imageUri: string | null;
  onImageSelected: (uri: string) => void;
}

export function ImagePicker({ imageUri, onImageSelected }: ImagePickerProps) {
  const pickFromGallery = async () => {
    const permission =
      await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access gallery is required.");
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      alert("Permission to access camera is required.");
      return;
    }

    const result = await ExpoImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  if (imageUri) {
    return (
      <View className="rounded-2xl overflow-hidden bg-gray-100">
        <Image
          source={{ uri: imageUri }}
          className="w-full h-72"
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View className="items-center gap-4">
      <View className="w-full items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl py-16 px-8">
        <Text className="text-5xl mb-4">🌿</Text>
        <Text className="text-lg font-semibold text-gray-700 text-center mb-1">
          Scan a Plant Leaf
        </Text>
        <Text className="text-sm text-gray-400 text-center">
          Take a photo or choose from gallery
        </Text>
      </View>

      <View className="flex-row gap-3 w-full">
        <TouchableOpacity
          onPress={takePhoto}
          className="flex-1 bg-green-600 rounded-xl py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-base">
            📷 Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickFromGallery}
          className="flex-1 bg-gray-200 rounded-xl py-4 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-gray-700 font-semibold text-base">
            🖼️ Gallery
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
