import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useKeepAwake } from "expo-keep-awake";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence
} from "react-native-reanimated";

export default function Index() {
  const [isFlashing, setIsFlashing] = useState(true); // State to toggle flashing
  const opacity = useSharedValue(1); // Shared value for LED opacity
  useKeepAwake(); // Keep the app awake to simulate Always-On Display (AOD)

  // Lock screen orientation
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);

  // Handle flashing animation
  useEffect(() => {
    if (isFlashing) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }), // Instantly turn on
          withTiming(1, { duration: 300 }), // Keep fully on for 300ms
          withTiming(0, { duration: 0 }), // Instantly turn off
          withTiming(0, { duration: 700 }) // Stay off for 700ms
        ),
        -1, // Infinite repetitions
        false // No reverse animation
      );
    } else {
      opacity.value = withTiming(1, { duration: 0 }); // Instantly fully visible
    }
  }, [isFlashing, opacity]);

  // Animated style for the LED
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={() => setIsFlashing(!isFlashing)}>
      <View style={styles.container}>
        {/* Simulated LED */}
        <Animated.View style={[styles.led, animatedStyle]} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // AMOLED-friendly background
  },
  led: {
    width: 10, // Diameter of the LED
    height: 10,
    top: 25,
    left: 25,
    borderRadius: 25, // Circular shape
    backgroundColor: "blue", // LED color
  },
});
