import { View, Text, Image, StyleSheet, Animated } from "react-native";
import { useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function HomePage() {
  const scrollY = useRef(new Animated.Value(0)).current;
    
  const services = [
    { id: 1, name: "Services", icon: "settings-outline" },
    { id: 2, name: "Citizen Guide", icon: "book-outline" },
    { id: 3, name: "e-Services", icon: "globe-outline" },
    { id: 4, name: "Emergency", icon: "warning-outline" },
    { id: 5, name: "Students", icon: "school-outline" },
    { id: 6, name: "Startup", icon: "rocket-outline" },
    { id: 7, name: "Business", icon: "briefcase-outline" },
    { id: 8, name: "View All", icon: "add-circle-outline" },
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

          <View>

          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    backgroundColor: "#E8E4C9",
    borderRadius: 25,
  },
  head:{
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  }
});