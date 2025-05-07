import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  Button,
  ImageBackground,
} from "react-native";
import Toast from "react-native-toast-message";

export const cities = [
  { name: "New York", timezone: "America/New_York" },
  { name: "London", timezone: "Europe/London" },
  { name: "Paris", timezone: "Europe/Paris" },
  { name: "Tokyo", timezone: "Asia/Tokyo" },
  { name: "Sydney", timezone: "Australia/Sydney" },
  { name: "Cairo", timezone: "Africa/Cairo" },
  { name: "Moscow", timezone: "Europe/Moscow" },
  { name: "Rio de Janeiro", timezone: "America/Sao_Paulo" },
  { name: "Dubai", timezone: "Asia/Dubai" },
  { name: "Singapore", timezone: "Asia/Singapore" },
  { name: "Los Angeles", timezone: "America/Los_Angeles" },
  { name: "Chicago", timezone: "America/Chicago" },
  { name: "Toronto", timezone: "America/Toronto" },
  { name: "Berlin", timezone: "Europe/Berlin" },
  { name: "Rome", timezone: "Europe/Rome" },
  { name: "Madrid", timezone: "Europe/Madrid" },
  { name: "Beijing", timezone: "Asia/Shanghai" },
  { name: "Seoul", timezone: "Asia/Seoul" },
  { name: "Mumbai", timezone: "Asia/Kolkata" },
  { name: "Mexico City", timezone: "America/Mexico_City" },
  { name: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires" },
  { name: "Johannesburg", timezone: "Africa/Johannesburg" },
  { name: "Tel Aviv", timezone: "Asia/Jerusalem" },
];

const INITIAL_CITY_COUNT = 5;

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllCities, setShowAllCities] = useState(false);

  const handlePress = (city) => {
    Toast.show({
      type: "success",
      text1: "City Selected",
      text2: `Showing clock for ${city.name}`,
      visibilityTime: 2000,
      position: "bottom",
    });
    navigation.navigate("Clock", { city });
  };

  const filteredCities = useMemo(() => {
    if (!searchQuery) {
      return cities;
    }
    return cities.filter((city) =>
      city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const citiesToDisplay = useMemo(() => {
    return showAllCities
      ? filteredCities
      : filteredCities.slice(0, INITIAL_CITY_COUNT);
  }, [filteredCities, showAllCities]);

  const renderCityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handlePress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/clock.png")}
          resizeMode="cover"
          style={styles.headerBackground}
          imageStyle={styles.headerBackgroundImageStyle}
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.title}>World Clock</Text>
            <Text style={styles.introText}>
              Welcome to the World Clock app! Select a city from the list or
              search below to see the current time (currently displays random
              time).
            </Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search city..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#e0e0e0"
            />
          </View>
        </ImageBackground>

        <FlatList
          style={styles.listContainer}
          data={citiesToDisplay}
          renderItem={renderCityItem}
          keyExtractor={(item) => item.timezone}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.noResultsText}>
              No cities found matching your search.
            </Text>
          )}
          ListFooterComponent={() =>
            !showAllCities &&
            filteredCities.length > INITIAL_CITY_COUNT && (
              <View style={styles.seeMoreContainer}>
                <Button
                  title="See More..."
                  onPress={() => setShowAllCities(true)}
                  color="#007bff"
                />
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  container: {
    flex: 1,
  },
  headerBackground: {
    marginBottom: 15,
  },
  headerBackgroundImageStyle: {
    opacity: 0.3,
  },
  headerOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: 1.2,
  },
  introText: {
    fontSize: 16,
    color: "#dcdcdc",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  searchInput: {
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#ffffff",
  },
  listContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  listContent: {
    paddingBottom: 30,
  },
  button: {
    backgroundColor: "#ffffff",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#0d6efd",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.3,
  },
  separator: {
    height: 1,
    backgroundColor: "#dee2e6",
    marginVertical: 6,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#6c757d",
  },
  seeMoreContainer: {
    marginTop: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
});
