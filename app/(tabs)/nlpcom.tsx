import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

// ===============================
// Notification Type (IMPORTANT)
// ===============================
interface NotificationItem {
  id: number;
  message: string;
  label: string;
  type: string;
  timestamp: string;
}

export default function App() {
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Handle API submit
  // ===============================
  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://192.168.68.101:5000/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        Alert.alert(`Server error: ${response.status} - ${errorText}`);
        return;
      }

      const data = await response.json();

      const normalizedLabel = String(data.label).toLowerCase().trim();
      const normalizedType = String(data.type).toLowerCase().trim();

      // Push new notification
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: data.message,
          label: normalizedLabel,
          type: normalizedType,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      setMessage("");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Failed to connect to API: " + error.message);
      } else {
        Alert.alert("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Group notifications
  // ===============================
  const urgentNotifications = notifications.filter(
    (n) => n.label === "urgent"
  );

  const nonUrgentNotifications = notifications.filter(
    (n) => n.label === "non-urgent"
  );

  // ===============================
  // UI
  // ===============================
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Complaint Notifications</Text>

        {/* Input Form */}
        <View style={styles.form}>
          <TextInput
            style={styles.textarea}
            multiline
            numberOfLines={3}
            placeholder="Enter complaint message..."
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.5 }]}
            disabled={loading}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>{loading ? "..." : "Send"}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ maxHeight: 500 }}>
          {/* Urgent Section */}
          <Text style={styles.urgentTitle}>
            Urgent ({urgentNotifications.length})
          </Text>

          {urgentNotifications.length === 0 ? (
            <Text style={styles.emptyText}>No urgent complaints</Text>
          ) : (
            urgentNotifications.map((n) => (
              <View key={n.id} style={styles.urgentBox}>
                <Text style={styles.msgText}>{n.message}</Text>

                <View style={styles.badges}>
                  <Text style={styles.urgentBadge}>{n.label}</Text>
                  <Text style={styles.grayBadge}>{n.type}</Text>
                </View>

                <Text style={styles.timestamp}>{n.timestamp}</Text>
              </View>
            ))
          )}

          {/* Non-Urgent Section */}
          <Text style={styles.nonUrgentTitle}>
            Non-Urgent ({nonUrgentNotifications.length})
          </Text>

          {nonUrgentNotifications.length === 0 ? (
            <Text style={styles.emptyText}>No non-urgent complaints</Text>
          ) : (
            nonUrgentNotifications.map((n) => (
              <View key={n.id} style={styles.nonUrgentBox}>
                <Text style={styles.msgText}>{n.message}</Text>

                <View style={styles.badges}>
                  <Text style={styles.nonUrgentBadge}>{n.label}</Text>
                  <Text style={styles.grayBadge}>{n.type}</Text>
                </View>

                <Text style={styles.timestamp}>{n.timestamp}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

// ===============================
// STYLES
// ===============================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef2f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 500,
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2563eb",
    marginBottom: 15,
  },
  form: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  textarea: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    textAlignVertical: "top",
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  urgentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#dc2626",
    marginBottom: 5,
  },
  nonUrgentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#16a34a",
    marginTop: 15,
    marginBottom: 5,
  },

  emptyText: {
    color: "#6b7280",
    marginBottom: 10,
  },

  urgentBox: {
    backgroundColor: "#fee2e2",
    borderLeftWidth: 5,
    borderLeftColor: "#dc2626",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  nonUrgentBox: {
    backgroundColor: "#dcfce7",
    borderLeftWidth: 5,
    borderLeftColor: "#16a34a",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  msgText: { fontSize: 14 },

  badges: { flexDirection: "row", gap: 8, marginTop: 5 },

  urgentBadge: {
    backgroundColor: "#dc2626",
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
  },
  nonUrgentBadge: {
    backgroundColor: "#16a34a",
    color: "white",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
  },
  grayBadge: {
    backgroundColor: "#d1d5db",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    fontSize: 12,
  },

  timestamp: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },
});
