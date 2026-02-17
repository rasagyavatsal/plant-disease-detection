import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface ConfidenceBarProps {
  score: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

export function ConfidenceBar({
  score,
  height = 5,
  color = "#2dd4a8",
  backgroundColor = "#1c2230",
}: ConfidenceBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(score * 100, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [score]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View
      style={{ height, backgroundColor, borderRadius: height / 2 }}
      className="w-full overflow-hidden"
    >
      <Animated.View
        style={[
          {
            height,
            backgroundColor: color,
            borderRadius: height / 2,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
