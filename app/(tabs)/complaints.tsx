import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Complaintspage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headercon}>
          <Text style={styles.text}>←</Text>
          <Text style={styles.text}>Complaint</Text>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white", // light background
  },
  container: {
    flex: 1,
  },
  headercon: {
    padding: 20,
    width: "100%",
    flexDirection: "row", // 👈 makes children appear side by side
    alignItems: "center", // vertically align items
    backgroundColor: "#F5F6FA"
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 5,
    color: "#333",
  },
});
