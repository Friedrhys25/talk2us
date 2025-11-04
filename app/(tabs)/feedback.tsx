import { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { db } from "../../backend/firebaseConfig";
import { ref, get, update } from "firebase/database"; // ✅ changed from push,set to update

export default function FeedbackPage() {
  const router = useRouter();
  const [officials, setOfficials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ✅ Fetch officials from Firebase
  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const officialsRef = ref(db, "officials");
        const snapshot = await get(officialsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const officialsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setOfficials(officialsArray);
        }
      } catch (error) {
        console.error("Error fetching officials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficials();
  }, []);

  const handleRating = (id: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }));
  };

  const handleComment = (id: string, text: string) => {
    setComments((prev) => ({ ...prev, [id]: text }));
  };

  // ✅ Submit feedback to Firebase (per official)
  const handleSubmit = async () => {
  try {
    // ✅ Loop through each official that has a rating
    for (const id of Object.keys(ratings)) {
      const officialRef = ref(db, `officials/${id}/feedback/${Date.now()}`);

      const feedbackData = {
        rating: ratings[id],
        comment: comments[id] || "",
        timestamp: Date.now(),
      };

      // ✅ Save the feedback as an object
      await update(officialRef, feedbackData);
    }

    // ✅ Store general feedback separately if provided
    if (feedback.trim()) {
      const generalFeedbackRef = ref(db, `generalFeedback/${Date.now()}`);
      const feedbackData = {
        feedback,
        timestamp: Date.now(),
      };
      await update(generalFeedbackRef, feedbackData);
    }

    setSubmitted(true);
    console.log("✅ Feedback saved successfully!");
  } catch (error) {
    console.error("Error saving feedback:", error);
  }

  // ✅ Reset after a short delay
  setTimeout(() => {
    setRatings({});
    setComments({});
    setFeedback("");
    setSubmitted(false);
  }, 3000);
};


  const RatingStars = ({
    id,
    currentRating,
  }: {
    id: string;
    currentRating: number;
  }) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => handleRating(id, star)}>
          <Text style={styles.star}>{star <= currentRating ? "⭐" : "☆"}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (submitted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Thank you!</Text>
          <Text style={styles.successMessage}>
            Your feedback helps us improve the services of our barangay.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headercon}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Feedback & Rating</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#667eea" style={{ marginTop: 40 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {officials.map((official) => (
              <View key={official.id} style={styles.officialCard}>
                <View style={styles.officialHeader}>
                  <View style={styles.officialIconContainer}>
                    <Ionicons name="person" size={24} color="#667eea" />
                  </View>
                  <View>
                    <Text style={styles.officialName}>{official.name}</Text>
                    <Text style={styles.officialPosition}>
                      {official.position}
                    </Text>
                  </View>
                </View>

                <RatingStars
                  id={official.id}
                  currentRating={ratings[official.id] || 0}
                />

                <TextInput
                  style={styles.commentInput}
                  placeholder={`Write a comment for ${official.name}...`}
                  placeholderTextColor="#999"
                  value={comments[official.id] || ""}
                  onChangeText={(text) => handleComment(official.id, text)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            ))}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Feedback</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Write your general feedback here..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={5}
                value={feedback}
                onChangeText={setFeedback}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Submit Feedback</Text>
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

// ✅ Keep your existing styles
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F5F7FA" },
  container: { flex: 1, backgroundColor: "white" },
  headercon: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: { padding: 8, marginRight: 12 },
  backIcon: { fontSize: 24, color: "#333" },
  headerText: { fontSize: 24, fontWeight: "700", color: "#333" },
  scrollContent: { padding: 20 },
  officialCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  officialHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  officialIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  officialName: { fontSize: 16, fontWeight: "600", color: "#1A1A1A" },
  officialPosition: { fontSize: 13, color: "#6B7280" },
  starsContainer: { flexDirection: "row", justifyContent: "center", gap: 8 },
  star: { fontSize: 32, padding: 4 },
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
  section: { marginTop: 30, marginBottom: 40 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A", marginBottom: 10 },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    minHeight: 120,
    backgroundColor: "#FFFFFF",
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
  submitButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  successContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  successIcon: { fontSize: 80, marginBottom: 20 },
  successTitle: { fontSize: 28, fontWeight: "700", color: "#1A1A1A", marginBottom: 12 },
  successMessage: { fontSize: 16, color: "#6B7280", textAlign: "center", lineHeight: 24 },
});
