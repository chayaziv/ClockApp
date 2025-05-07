import React, { useEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import HomeScreen, { cities } from "./components/HomeScreen";
import ClockScreen from "./components/ClockScreen";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const padZero = (num) => num.toString().padStart(2, "0");

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = React.useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        for (const city of cities) {
          const storageKey = `randomTime_${city.timezone}`;
          const storedTime = await AsyncStorage.getItem(storageKey);
          if (storedTime === null) {
            const randomHour = Math.floor(Math.random() * 24);
            const randomMinute = Math.floor(Math.random() * 60);
            const randomSecond = Math.floor(Math.random() * 60);
            const timeString = `${padZero(randomHour)}:${padZero(
              randomMinute
            )}:${padZero(randomSecond)}`;
            await AsyncStorage.setItem(storageKey, timeString);
            console.log(`Initialized time for ${city.name}: ${timeString}`);
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn("Error during app preparation:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <>
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Select City" }}
          />
          <Stack.Screen
            name="Clock"
            component={ClockScreen}
            options={{ title: "World Clock" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
