import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function FeedbackPage() {
  const router = useRouter();
  const [ratings, setRatings] = useState({
    captain: 0,
    councilor1: 0,
    councilor2: 0,
    councilor3: 0,
    councilor4: 0,
    councilor5: 0,
    councilor6: 0,
    councilor7: 0,
  });

  const [comments, setComments] = useState({
    captain: "",
    councilor1: "",
    councilor2: "",
    councilor3: "",
    councilor4: "",
    councilor5: "",
    councilor6: "",
    councilor7: "",
  });

  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const officials = [
    { key: "captain", name: "Barangay Captain", icon: "person" },
    { key: "councilor1", name: "Councilor 1", icon: "people" },
    { key: "councilor2", name: "Councilor 2", icon: "people" },
    { key: "councilor3", name: "Councilor 3", icon: "people" },
    { key: "councilor4", name: "Councilor 4", icon: "people" },
    { key: "councilor5", name: "Councilor 5", icon: "people" },
    { key: "councilor6", name: "Councilor 6", icon: "people" },
    { key: "councilor7", name: "Councilor 7", icon: "people" },
  ];

  const handleRating = (official, rating) => {
    setRatings({ ...ratings, [official]: rating });
  };

  const handleComment = (official, text) => {
    setComments({ ...comments, [official]: text });
  };

  const handleSubmit = () => {
    setSubmitted(true);

    // You can log or send the data here
    console.log("Ratings:", ratings);
    console.log("Comments per official:", comments);
    console.log("Additional Feedback:", feedback);

    setTimeout(() => {
      setRatings({
        captain: 0,
        councilor1: 0,
        councilor2: 0,
        councilor3: 0,
        councilor4: 0,
        councilor5: 0,
        councilor6: 0,
        councilor7: 0,
      });
      setComments({
        captain: "",
        councilor1: "",
        councilor2: "",
        councilor3: "",
        councilor4: "",
        councilor5: "",
        councilor6: "",
        councilor7: "",
      });
      setFeedback("");
      setSubmitted(false);
    }, 3000);
  };

  const RatingStars = ({ official, currentRating }) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleRating(official, star)}
          >
            <Text style={styles.star}>{star <= currentRating ? "⭐" : "☆"}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // ✅ Success screen
  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.headercon}>
            <TouchableOpacity
            style={styles.backButton}
              onClick={() => window.history.back()}>
              onPress={() => router.back()}
            
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>Feedback</Text>
          </View>
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Thank you!</Text>
            <Text style={styles.successMessage}>
              Your feedback helps us improve the services of our barangay.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ✅ Main Feedback Page
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headercon}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Feedback & Rating</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle-outline"
              size={28}
              color="#4A90E2"
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Rate Our Officials</Text>
              <Text style={styles.infoText}>
                Your feedback helps us improve our services and better serve the
                community.
              </Text>
            </View>
          </View>

          {/* Officials Rating Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rate Officials</Text>
            <Text style={styles.sectionSubtitle}>
              Tap on stars to rate and leave a comment for each official.
            </Text>

            {officials.map((official) => (
              <View key={official.key} style={styles.officialCard}>
                <View style={styles.officialHeader}>
                  <View style={styles.officialIconContainer}>
                    <Ionicons name={official.icon} size={24} color="#667eea" />
                  </View>
                  <Text style={styles.officialName}>{official.name}</Text>
                </View>
                <RatingStars
                  official={official.key}
                  currentRating={ratings[official.key]}
                />

                {/* Individual comment box */}
                <TextInput
                  style={styles.commentInput}
                  placeholder={`Write a comment for ${official.name} (optional)...`}
                  placeholderTextColor="#999"
                  value={comments[official.key]}
                  onChangeText={(text) => handleComment(official.key, text)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            ))}
          </View>

          {/* General Feedback Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Comments</Text>
            <Text style={styles.sectionSubtitle}>
              Share your thoughts or suggestions (Optional)
            </Text>
            <View style={styles.feedbackSection}>
              <View style={styles.textInputContainer}>
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color="#666"
                  style={styles.inputIcon}
                />
                <Text style={styles.feedbackLabel}>Your Feedback</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Write your general feedback or suggestion here..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
                value={feedback}
                onChangeText={setFeedback}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
            <Ionicons name="send" size={18} color="white" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headercon: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: "#333",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
  },
  scrollContent: {
    padding: 20,
  },
  infoCard: {
    flexDirection: "row",
    gap: 16,
    padding: 20,
    backgroundColor: "#EBF5FF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#B3D9FF",
    marginBottom: 28,
    alignItems: "flex-start",
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#4A5568",
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
    fontWeight: "400",
  },
  officialCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  officialHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  officialIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  officialName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    flex: 1,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  star: {
    fontSize: 32,
    padding: 4,
  },
  commentInput: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#FFFFFF",
    color: "#333",
  },
  feedbackSection: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  inputIcon: {
    marginTop: 2,
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  textInput: {
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 140,
    backgroundColor: "#F9FAFB",
    color: "#333",
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    backgroundColor: "#667eea",
    borderRadius: 16,
    marginBottom: 40,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  successIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
});
