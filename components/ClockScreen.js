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

// Helper function to pad numbers with leading zeros
const padZero = (num) => num.toString().padStart(2, "0");

// Placeholder image URL for corner icon
const CORNER_ICON_URL = "../assets/clock.png";
// Or use local asset: const cornerIcon = require('../assets/your-icon.png');

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
          // Generate random time components
          const randomHour = Math.floor(Math.random() * 24);
          const randomMinute = Math.floor(Math.random() * 60);
          const randomSecond = Math.floor(Math.random() * 60);

          // Format the time string
          const timeString = `${padZero(randomHour)}:${padZero(
            randomMinute
          )}:${padZero(randomSecond)}`;

          await AsyncStorage.setItem(storageKey, timeString);
          setRandomTime(timeString);
        }
      } catch (e) {
        console.error("Failed to load or save time.", e);
        // Fallback to generating time without saving if AsyncStorage fails
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
  }, [city.timezone, city.name]); // Ensure effect runs if city changes

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
    backgroundColor: "#2c3e50", // Dark blue background
    padding: 20,
  },
  cornerIcon: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 60, // Adjust top based on platform/StatusBar
    right: 20,
    width: 30,
    height: 30,
    opacity: 0.8, // Make it slightly transparent
  },
  title: {
    fontSize: 34, // Slightly larger
    fontWeight: "300", // Lighter font weight
    color: "#ecf0f1", // Light grey/white color
    marginBottom: 15, // Space below title
    textAlign: "center",
  },
  timeDisplay: {
    fontSize: 64, // Much larger font for the time
    fontWeight: "bold",
    color: "#ffffff", // White color for time
    marginBottom: 20, // Space below time
    fontFamily: Platform.OS === "ios" ? "Courier New" : "monospace", // Monospaced font
    letterSpacing: 2, // Add some spacing between characters
  },
  timezoneInfo: {
    fontSize: 16,
    color: "#bdc3c7", // Lighter grey color
    fontStyle: "italic",
  },
});
