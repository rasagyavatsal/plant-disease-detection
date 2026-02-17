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
      <View className="rounded-xl overflow-hidden bg-surface-elevated border border-border-subtle">
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
      <View className="w-full items-center justify-center border border-dashed border-border rounded-xl py-14 px-8">
        <View className="w-12 h-12 rounded-full bg-surface-elevated items-center justify-center mb-3">
          <Text className="text-xl">🌿</Text>
        </View>
        <Text className="text-[15px] font-semibold text-text-secondary text-center mb-1">
          Scan a Plant Leaf
        </Text>
        <Text className="text-[12px] text-text-tertiary text-center">
          Take a photo or choose from gallery
        </Text>
      </View>

      <View className="flex-row gap-3 w-full">
        <TouchableOpacity
          onPress={takePhoto}
          className="flex-1 bg-accent rounded-xl py-3.5 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-bg font-semibold text-[14px]">
            Camera
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickFromGallery}
          className="flex-1 bg-surface-elevated border border-border-subtle rounded-xl py-3.5 items-center"
          activeOpacity={0.8}
        >
          <Text className="text-text-secondary font-semibold text-[14px]">
            Gallery
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
