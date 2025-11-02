import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { get, ref, update } from "firebase/database";
import { db, auth, storage } from "../../backend/firebaseConfig";
import { signOut } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

// ✅ Emoji-based Ionicons (no dependency)
type IoniconsProps = {
  name: keyof typeof iconMap | string;
  size: number;
  color?: string;
};

const iconMap: { [key: string]: string } = {
  "arrow-back": "←",
  "person-circle": "👤",
  "person-outline": "👤",
  "mail-outline": "✉️",
  "call-outline": "📞",
  "location-outline": "📍",
  "calendar-outline": "📅",
  "settings-outline": "⚙️",
  "notifications-outline": "🔔",
  "shield-outline": "🛡️",
  "help-circle-outline": "❓",
  "log-out-outline": "🚪",
  "create-outline": "✏️",
  "document-text-outline": "📄",
  "checkmark-circle": "✓",
  "time-outline": "🕐",
  "trophy-outline": "🏆",
  "cloud-upload-outline": "☁️",
  "camera-outline": "📷",
  close: "✕",
};

const Ionicons: React.FC<IoniconsProps> = ({ name, size, color = "#000" }) => {
  return <Text style={{ fontSize: size, color }}>{iconMap[name]}</Text>;
};

export default function ProfilePage() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    purok: "",
    age: "",
    memberSince: "",
    id_verification: "",
  });

  // Fetch user data from Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        
        if (!currentUser) {
          Alert.alert("Error", "No user logged in");
          router.replace("/");
          return;
        }

        // Get user data from Realtime Database
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          
          // Format member since date
          const createdDate = data.createdAt ? new Date(data.createdAt) : new Date();
          const memberSince = createdDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          });

          setUserData({
            name: data.name || "User",
            email: data.email || currentUser.email || "",
            phone: data.number || "No phone number",
            address: data.address || "No address",
            purok: data.purok || "",
            age: data.age || "",
            memberSince: memberSince,
            id_verification: data.id_verification || "",
          });
        } else {
          Alert.alert("Error", "User data not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Upload ID verification image
  const handleUploadID = async () => {
    try {
      // Request permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required", 
          "Please allow access to your photos to upload ID. Go to Settings > Talk2us > Photos to enable access."
        );
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      // Validate image selection
      if (!result.assets || result.assets.length === 0) {
        Alert.alert("Error", "No image was selected. Please try again.");
        return;
      }

      setUploading(true);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        Alert.alert("Authentication Error", "No user logged in. Please log in and try again.");
        setUploading(false);
        return;
      }

      const imageUri = result.assets[0].uri;
      
      // Validate image URI
      if (!imageUri) {
        throw new Error("Invalid image URI");
      }

      console.log("📤 Starting ID upload for user:", currentUser.uid);
      
      // Convert image to blob
      let response;
      let blob;
      
      try {
        response = await fetch(imageUri);
        if (!response.ok) {
          throw new Error("Failed to fetch image data");
        }
        blob = await response.blob();
      } catch (fetchError) {
        console.error("❌ Fetch error:", fetchError);
        throw new Error("Failed to read image file. Please try selecting a different image.");
      }

      // Validate blob
      if (!blob || blob.size === 0) {
        throw new Error("Selected image is empty or corrupted");
      }

      // Check file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (blob.size > maxSize) {
        Alert.alert(
          "File Too Large", 
          "The selected image is too large. Please select an image smaller than 5MB."
        );
        setUploading(false);
        return;
      }

      console.log("📦 Image size:", (blob.size / 1024 / 1024).toFixed(2), "MB");

      // Create storage reference
      const fileName = `id_verification_${currentUser.uid}_${Date.now()}.jpg`;
      const imageRef = storageRef(storage, `id_verifications/${fileName}`);

      // Upload to Firebase Storage
      console.log("☁️ Uploading to Firebase Storage...");
      try {
        await uploadBytes(imageRef, blob);
        console.log("✅ Upload successful");
      } catch (uploadError: any) {
        console.error("❌ Upload error:", uploadError);
        if (uploadError.code === "storage/unauthorized") {
          throw new Error("You don't have permission to upload files. Please contact support.");
        } else if (uploadError.code === "storage/canceled") {
          throw new Error("Upload was canceled. Please try again.");
        } else if (uploadError.code === "storage/unknown") {
          throw new Error("Upload failed due to network issues. Please check your connection and try again.");
        }
        throw new Error("Failed to upload image to server. Please try again.");
      }
      
      // Get download URL
      console.log("🔗 Getting download URL...");
      let downloadURL;
      try {
        downloadURL = await getDownloadURL(imageRef);
        console.log("✅ Download URL retrieved");
      } catch (urlError: any) {
        console.error("❌ Get URL error:", urlError);
        throw new Error("Failed to generate image link. Please try again.");
      }

      // Update Realtime Database
      console.log("💾 Updating database...");
      try {
        const userRef = ref(db, `users/${currentUser.uid}`);
        await update(userRef, {
          id_verification: downloadURL,
          id_verification_uploaded_at: new Date().toISOString(),
        });
        console.log("✅ Database updated");
      } catch (dbError: any) {
        console.error("❌ Database error:", dbError);
        throw new Error("Failed to save verification data. Please try again.");
      }

      // Update local state
      setUserData(prev => ({
        ...prev,
        id_verification: downloadURL,
      }));

      Alert.alert(
        "Success! ✅", 
        "Your ID has been uploaded successfully and is now being verified."
      );
      
    } catch (error: any) {
      console.error("❌ Error uploading ID:", error);
      
      let errorTitle = "Upload Failed";
      let errorMessage = "Failed to upload ID verification. Please try again.";

      if (error.message) {
        errorMessage = error.message;
      } else if (error.code) {
        // Handle specific Firebase error codes
        switch (error.code) {
          case "storage/unauthorized":
            errorTitle = "Permission Denied";
            errorMessage = "You don't have permission to upload files. Please contact support.";
            break;
          case "storage/canceled":
            errorTitle = "Upload Canceled";
            errorMessage = "The upload was canceled. Please try again.";
            break;
          case "storage/unknown":
            errorTitle = "Network Error";
            errorMessage = "Upload failed due to a network error. Please check your internet connection and try again.";
            break;
          case "storage/quota-exceeded":
            errorTitle = "Storage Limit Reached";
            errorMessage = "Storage limit has been exceeded. Please contact support.";
            break;
          case "storage/unauthenticated":
            errorTitle = "Authentication Required";
            errorMessage = "Please log out and log back in, then try again.";
            break;
          default:
            errorMessage = `Error: ${error.code}. Please try again or contact support.`;
        }
      }

      Alert.alert(errorTitle, errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const stats = [
    { label: "Complaints Filed", value: "12", icon: "📋", color: "#4A90E2" },
    { label: "Resolved", value: "9", icon: "✅", color: "#50C878" },
    { label: "Response Rate", value: "95%", icon: "📈", color: "#F39C12" },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Filed complaint",
      title: "Road repair needed",
      time: "2 days ago",
      status: "In Progress",
    },
    {
      id: 2,
      action: "Received response",
      title: "Street light issue",
      time: "5 days ago",
      status: "Resolved",
    },
    {
      id: 3,
      action: "Submitted feedback",
      title: "Service improvement",
      time: "1 week ago",
      status: "Reviewed",
    },
  ];

  const handleLogout = () => setShowLogoutModal(true);
  
  const confirmLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutModal(false);
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out");
    }
  };
  
  const cancelLogout = () => setShowLogoutModal(false);

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={{ marginTop: 10, color: "#666" }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Format full address
  const fullAddress = userData.purok 
    ? `Purok ${userData.purok}, ${userData.address}`
    : userData.address;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Profile</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="create-outline" size={22} color="#667eea" />
          </TouchableOpacity>
        </View>

        {/* Logout Modal */}
        <Modal
          visible={showLogoutModal}
          transparent
          animationType="fade"
          onRequestClose={cancelLogout}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Ionicons name="log-out-outline" size={48} color="#E74C3C" />
              <Text style={styles.modalTitle}>Log Out</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to log out? You'll need to sign in again
                to access your account.
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn]}
                  onPress={cancelLogout}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.confirmBtn]}
                  onPress={confirmLogout}
                >
                  <Text style={styles.confirmText}>Yes, Log Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person-circle" size={80} color="#667eea" />
              </View>
              <TouchableOpacity style={styles.avatarBadge}>
                <Ionicons name="create-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
            <View style={styles.memberBadge}>
              <Ionicons name="trophy-outline" size={14} color="#F39C12" />
              <Text style={styles.memberText}>
                Member since {userData.memberSince}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: `${stat.color}25` },
                  ]}
                >
                  <Text style={{ fontSize: 24 }}>{stat.icon}</Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Personal Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            {[
              { icon: "person-outline", label: "Full Name", value: userData.name },
              { icon: "mail-outline", label: "Email", value: userData.email },
              { icon: "call-outline", label: "Phone", value: userData.phone },
              { icon: "location-outline", label: "Address", value: fullAddress },
              ...(userData.age ? [{ icon: "calendar-outline", label: "Age", value: userData.age }] : []),
            ].map((item, i) => (
              <View key={i} style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <Ionicons name={item.icon} size={20} color="#666" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              </View>
            ))}

            {/* ID Verification Section */}
            <View style={styles.verificationSection}>
              <View style={styles.verificationHeader}>
                <Ionicons name="shield-outline" size={20} color="#667eea" />
                <Text style={styles.verificationTitle}>ID Verification</Text>
              </View>
              
              {userData.id_verification ? (
                <View style={styles.verifiedContainer}>
                  <Image 
                    source={{ uri: userData.id_verification }} 
                    style={styles.idImage}
                    resizeMode="cover"
                  />
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#50C878" />
                    <Text style={styles.verifiedText}>ID Uploaded</Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.reuploadButton}
                    onPress={handleUploadID}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <ActivityIndicator size="small" color="#667eea" />
                    ) : (
                      <>
                        <Ionicons name="cloud-upload-outline" size={18} color="#667eea" />
                        <Text style={styles.reuploadText}>Upload New ID</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={handleUploadID}
                  disabled={uploading}
                >
                  {uploading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="cloud-upload-outline" size={20} color="#fff" />
                      <Text style={styles.uploadButtonText}>Upload ID for Verification</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
              
              <Text style={styles.verificationNote}>
                📋 Upload a valid government ID for account verification
              </Text>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {recentActivity.map((act) => (
              <View key={act.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="document-text-outline" size={20} color="#667eea" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityAction}>{act.action}</Text>
                  <Text style={styles.activityTitle}>{act.title}</Text>
                  <View style={styles.activityFooter}>
                    <Text style={styles.activityTime}>
                      🕐 {act.time}
                    </Text>
                    <View
                      style={[
                        styles.activityBadge,
                        act.status === "Resolved"
                          ? styles.badgeResolved
                          : act.status === "In Progress"
                          ? styles.badgeProgress
                          : styles.badgeReviewed,
                      ]}
                    >
                      <Text style={styles.badgeText}>{act.status}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F7FA" },
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  iconButton: { padding: 8 },
  headerText: { fontSize: 22, fontWeight: "700", color: "#333" },
  scroll: { padding: 20 },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
  },
  avatarContainer: { position: "relative" },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#667eea",
    borderRadius: 16,
    padding: 6,
  },
  userName: { fontSize: 22, fontWeight: "700", color: "#1A1A1A", marginTop: 10 },
  userEmail: { fontSize: 14, color: "#6B7280" },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  memberText: { color: "#F39C12", fontSize: 12, marginLeft: 6 },
  statsGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#666" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  infoItem: { flexDirection: "row", marginBottom: 12 },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  infoLabel: { fontSize: 12, color: "#6B7280" },
  infoValue: { fontSize: 15, fontWeight: "600" },
  verificationSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  verificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginLeft: 8,
  },
  verifiedContainer: {
    alignItems: "center",
  },
  idImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#F3F4F6",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D4EDDA",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  verifiedText: {
    color: "#50C878",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  reuploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "100%",
  },
  reuploadText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#667eea",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 10,
  },
  verificationNote: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  activityItem: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  activityAction: { fontSize: 12, color: "#6B7280" },
  activityTitle: { fontSize: 15, fontWeight: "600" },
  activityFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  activityTime: { fontSize: 12, color: "#999" },
  activityBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeResolved: { backgroundColor: "#D4EDDA" },
  badgeProgress: { backgroundColor: "#FFF3CD" },
  badgeReviewed: { backgroundColor: "#E3F2FD" },
  badgeText: { fontSize: 11, fontWeight: "600" },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FFEBEE",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
  },
  logoutText: { fontSize: 16, fontWeight: "700", color: "#E74C3C", marginLeft: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 22, fontWeight: "700", marginTop: 10 },
  modalMessage: { fontSize: 14, color: "#555", textAlign: "center", marginVertical: 12 },
  modalButtons: { flexDirection: "row", width: "100%", justifyContent: "space-between" },
  modalBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  cancelBtn: { backgroundColor: "#F3F4F6" },
  confirmBtn: { backgroundColor: "#E74C3C" },
  cancelText: { color: "#333", fontWeight: "600" },
  confirmText: { color: "#fff", fontWeight: "600" },
});