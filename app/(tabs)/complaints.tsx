import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ComplaintsPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    email: "",
    location: "",
    category: "",
    customCategory: "",
    description: "",
  });

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [recentComplaints, setRecentComplaints] = useState<
    { id: number; 
      title: string; 
      status: string; 
      date: string; 
      location: string; 
      description: string }[]>([]);
      
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { id: 1, name: "Road Issues", icon: "🚧", color: "#FF6B6B" },
    { id: 2, name: "Garbage", icon: "🗑️", color: "#4ECDC4" },
    { id: 3, name: "Water Supply", icon: "💧", color: "#45B7D1" },
    { id: 4, name: "Electricity", icon: "⚡", color: "#F7B731" },
    { id: 5, name: "Street Lights", icon: "💡", color: "#5F27CD" },
    { id: 6, name: "Fire", icon: "🔥", color: "#E74C3C" },
    { id: 7, name: "Flood", icon: "🌊", color: "#3498DB" },
    { id: 8, name: "Crime/Safety", icon: "🚨", color: "#E67E22" },
    { id: 9, name: "Noise Complaint", icon: "🔊", color: "#9B59B6" },
    { id: 10, name: "Illegal Dumping", icon: "♻️", color: "#27AE60" },
    { id: 11, name: "Damaged Infrastructure", icon: "🏗️", color: "#E67E22" },
    { id: 12, name: "Animal Control", icon: "🐕", color: "#F39C12" },
    { id: 13, name: "Drainage Issues", icon: "🚰", color: "#16A085" },
    { id: 14, name: "Traffic Violation", icon: "🚦", color: "#C0392B" },
    { id: 15, name: "Others", icon: "📋", color: "#95A5A6" },
  ];

  // Pick image from gallery
  const handleChooseFiles = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "Please allow photo access.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((a) => a.uri);
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const handleSubmit = () => {
    const errors = [];
    if (!selectedCategory) errors.push("Please select a complaint category");
    if (selectedCategory === 15 && !formData.customCategory.trim())
      errors.push("Please specify your complaint type");
    if (!formData.name.trim()) errors.push("Please enter your full name");
    if (!formData.contact.trim()) errors.push("Please enter your contact number");
    if (!formData.location.trim()) errors.push("Please enter the location");
    if (!formData.description.trim())
      errors.push("Please provide a description");
    if (selectedImages.length === 0)
      errors.push("Please upload at least one photo as proof");

    if (errors.length > 0) {
      Alert.alert("Incomplete Form", errors.join("\n"));
      return;
    }

    const newComplaint = {
      id: Date.now(),
      title:
        selectedCategory === 15
          ? formData.customCategory
          : formData.category,
      status: "Pending",
      date: "Just now",
      location: formData.location,
      description: formData.description,
    };

    setRecentComplaints([newComplaint, ...recentComplaints]);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: "",
        contact: "",
        email: "",
        location: "",
        category: "",
        customCategory: "",
        description: "",
      });
      setSelectedCategory(null);
      setSelectedImages([]);
    }, 3000);
  };

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>File a Complaint</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="alert-circle-outline" size={28} color="#4A90E2" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              Submit your complaint and we'll assign it to the relevant
              department. Track your complaint status anytime.
            </Text>
          </View>
        </View>

        {/* Category Selection */}
        <Text style={styles.sectionTitle}>Select Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                {
                  borderColor:
                    selectedCategory === cat.id ? cat.color : "#E0E0E0",
                  backgroundColor:
                    selectedCategory === cat.id ? `${cat.color}22` : "white",
                },
              ]}
              onPress={() => {
                setSelectedCategory(cat.id);
                setFormData({
                  ...formData,
                  category: cat.name,
                  customCategory: "",
                });
              }}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedCategory === 15 && (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Specify Complaint Type *</Text>
            <TextInput
              style={styles.input}
              placeholder="Please specify your complaint type..."
              value={formData.customCategory}
              onChangeText={(text) =>
                setFormData({ ...formData, customCategory: text })
              }
            />
          </View>
        )}

        {/* Form Fields */}
        <Text style={styles.sectionTitle}>Your Information</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Contact *</Text>
            <TextInput
              style={styles.input}
              placeholder="09XX XXX XXXX"
              value={formData.contact}
              keyboardType="phone-pad"
              onChangeText={(text) => setFormData({ ...formData, contact: text })}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={formData.email}
              keyboardType="email-address"
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Exact Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Street, Barangay, City"
            value={formData.location}
            onChangeText={(text) => setFormData({ ...formData, location: text })}
          />
        </View>

        <Text style={styles.sectionTitle}>Complaint Details</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Please describe your complaint in detail..."
            multiline
            value={formData.description}
            onChangeText={(text) =>
              setFormData({ ...formData, description: text })
            }
          />
        </View>

        {/* Upload Section */}
        <View style={styles.uploadBox}>
          <Ionicons name="camera-outline" size={32} color="#999" />
          <Text style={styles.uploadText}>Upload Photos (Proof)</Text>
          <TouchableOpacity
            onPress={handleChooseFiles}
            style={styles.uploadButton}
          >
            <Text style={{ color: "#333", fontWeight: "600" }}>Choose Files</Text>
          </TouchableOpacity>

          {selectedImages.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedImages.map((uri, idx) => (
                  <Image
                    key={idx}
                    source={{ uri }}
                    style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }}
                  />
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Complaint</Text>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>

        {/* Recent Complaints */}
        {recentComplaints.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Your Recent Complaints</Text>
            {recentComplaints.map((c) => (
              <View key={c.id} style={styles.recentItem}>
                <Ionicons name="document-text-outline" size={22} color="#666" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.recentTitle}>{c.title}</Text>
                  <Text style={styles.recentSub}>{c.date} • {c.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {showSuccess && (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Complaint Submitted!</Text>
            <Text style={styles.successMsg}>
              Your complaint has been successfully submitted.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    backgroundColor: "#F5F6FA",
  },
  backButton: { padding: 6, marginRight: 8 },
  headerText: { fontSize: 22, fontWeight: "700", color: "#333" },
  scroll: { padding: 16 },
  infoCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#EBF5FF",
    borderWidth: 1,
    borderColor: "#B3D9FF",
    marginBottom: 24,
  },
  infoTitle: { fontWeight: "700", fontSize: 16 },
  infoText: { color: "#555", marginTop: 4 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1A1A1A",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryCard: {
    width: "30%",
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 10,
  },
  categoryIcon: { fontSize: 28 },
  categoryName: { fontWeight: "600", color: "#333", fontSize: 13, marginTop: 4 },
  formGroup: { marginBottom: 16 },
  label: { fontWeight: "600", color: "#333", marginBottom: 6 },
  input: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "white",
  },
  row: { flexDirection: "row", gap: 12 },
  uploadBox: {
    padding: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#CBD5E0",
    borderStyle: "dashed",
    borderRadius: 12,
    backgroundColor: "#F7FAFC",
    marginBottom: 20,
  },
  uploadText: { marginTop: 8, fontWeight: "600", color: "#333" },
  uploadButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    backgroundColor: "white",
  },
  submitButton: {
    backgroundColor: "#667EEA",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 8,
  },
  submitText: { color: "white", fontWeight: "700", fontSize: 16 },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  recentTitle: { fontWeight: "600", color: "#1A1A1A" },
  recentSub: { color: "#666", fontSize: 13 },
  successOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  successCard: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
  },
  successIcon: { fontSize: 50, marginBottom: 10 },
  successTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
  successMsg: { color: "#555", textAlign: "center", marginTop: 6 },
});
