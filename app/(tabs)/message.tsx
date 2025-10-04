import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Messagepage() {
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

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {services.map((service) => (
          <TouchableOpacity key={service.id} style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name={service.icon as any} size={32} color="#FF6B6B" />
            </View>
            <Text style={styles.label}>{service.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "22%",
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
    fontSize: 11,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
});