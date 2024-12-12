import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { useKeepAwake } from "expo-keep-awake";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence
} from "react-native-reanimated";

import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isFlashing, setIsFlashing] = useState(true); // State to toggle flashing
  const opacity = useSharedValue(1); // Shared value for LED opacity
  useKeepAwake(); // Keep the app awake to simulate Always-On Display (AOD)

  // Lock screen orientation
  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  }, []);
  
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  useEffect(() => {
    if (isFlashing) {
      opacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 0 }), // Instantly turn on
          withTiming(1, { duration: 200 }), // Keep fully on for 300ms
          withTiming(0, { duration: 0 }), // Instantly turn off
          withTiming(0, { duration: 800 }) // Stay off for 700ms
        ),
        -1,
        false
      );
    } else {
      opacity.value = withTiming(1, { duration: 0 }); // Instantly fully visible
    }
  }, [isFlashing, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={() => setIsFlashing(!isFlashing)}>
      <View style={styles.container}>
        <Animated.View style={[styles.led, animatedStyle]} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  led: {
    width: 10,
    height: 10,
    top: 25,
    left: 25,
    borderRadius: 25,
    backgroundColor: "blue"
  },
});