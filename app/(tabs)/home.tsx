import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from "react-native";
import { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function HomePage() {
  const scrollY = useRef(new Animated.Value(0)).current;
    
  const services = [
    { id: 1, name: "Complaints", icon: "mail-outline" },
    { id: 2, name: "Emergency", icon: "alert-circle-outline" },
    { id: 3, name: "Feedback", icon: "analytics-outline" },
    { id: 4, name: "Officials", icon: "people-outline" },
  ];

  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, -300],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.parallaxContainer}>
          <Animated.Image
            source={require("../../assets/images/parallax.png")}
            style={[
              styles.image,
              {
                transform: [{ translateY: imageTranslateY }],
              },
            ]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.head}>
            What would you like
          </Text>
            <View style={styles.grid}>
              {services.map((service) => (
                <TouchableOpacity key={service.id} style={styles.card}>
                  <View style={styles.iconContainer}>
                    <Ionicons name={service.icon as any} size={50} color="#FF6B6B" />
                  </View>
                  <Text style={styles.label}>{service.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          <View>

          </View>
        </View>
        <View style={[styles.content, {marginTop: 20, marginBottom: 30}]}>
          <Text style={[styles.head, {marginBottom: 10}]}>
            Quick contacts
          </Text>
          <View>
            <Text style={styles.contacts}>Police: 100</Text>
            <Text style={styles.contacts}>Ambulance: 102</Text>
            <Text style={styles.contacts}>Fire: 101</Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  parallaxContainer: {
    height: 300,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 25,
    marginHorizontal: 10,

      // 💠 Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,

    // 💠 Shadow for Android
    elevation: 6,
  },
  head:{
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#FFF5F5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginBottom: 8,
    
  },
  label: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  contacts: {
    width: "100%",
    padding: 20,
    fontSize: 17,
    backgroundColor: "#FFF5F5",
    borderRadius: 12,
    marginBottom: 10,
  }
});