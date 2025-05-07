import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const padZero = (num) => num.toString().padStart(2, "0");

const CORNER_ICON_URL = "../assets/clock.png";

export default function ClockScreen({ route }) {
  const { city } = route.params;
  const [randomTime, setRandomTime] = useState("");

  useEffect(() => {
    const loadTime = async () => {
      const storageKey = `randomTime_${city.timezone}`;
      try {
        const storedTime = await AsyncStorage.getItem(storageKey);
        if (storedTime !== null) {
          setRandomTime(storedTime);
        } else {
          const randomHour = Math.floor(Math.random() * 24);
          const randomMinute = Math.floor(Math.random() * 60);
          const randomSecond = Math.floor(Math.random() * 60);

          const timeString = `${padZero(randomHour)}:${padZero(
            randomMinute
          )}:${padZero(randomSecond)}`;

          await AsyncStorage.setItem(storageKey, timeString);
          setRandomTime(timeString);
        }
      } catch (e) {
        console.error("Failed to load or save time.", e);

        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        const randomSecond = Math.floor(Math.random() * 60);
        const timeString = `${padZero(randomHour)}:${padZero(
          randomMinute
        )}:${padZero(randomSecond)}`;
        setRandomTime(timeString);
      }
    };

    loadTime();
  }, [city.timezone, city.name]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}> {city.name}</Text>
      <Text style={styles.timeDisplay}> {randomTime}</Text>
      <Text style={styles.timezoneInfo}>(Timezone: {city.timezone})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
    padding: 20,
  },
  cornerIcon: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60, // Adjust top based on platform/StatusBar
    right: 20,
    width: 30,
    height: 30,
    opacity: 0.8,
  },
  title: {
    fontSize: 34,
    fontWeight: "300",
    color: "#ecf0f1",
    marginBottom: 15,
    textAlign: "center",
  },
  timeDisplay: {
    fontSize: 64,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace",
    letterSpacing: 2,
    timezoneInfo: {
      fontSize: 16,
      color: "#bdc3c7", // Lighter grey color
      fontStyle: "italic",
    },
  },
});
