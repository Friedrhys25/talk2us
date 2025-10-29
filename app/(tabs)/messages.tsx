import { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { id: 1, sender: "admin", text: "Hello! How can I assist you today?" },
    { id: 2, sender: "user", text: "Good day! I just want to report a broken streetlight." },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const scrollViewRef = useRef(null);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const userMsg = { id: Date.now(), sender: "user", text: newMessage };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "admin",
          text: "Got it! We’ll forward this to our maintenance team.",
        },
      ]);
    }, 1000);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <View style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Messages</Text>
      </View>

      {/* Chat Section */}
      <View style={styles.chatContainer}>
        <View style={styles.infoCard}>
          <Ionicons name="chatbubble-ellipses-outline" size={26} color="#4A90E2" />
          <View>
            <Text style={styles.infoTitle}>Barangay Chat Support</Text>
            <Text style={styles.infoText}>You’re now chatting with an admin. Please be respectful.</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === "user" ? styles.userBubble : styles.adminBubble,
              ]}
            >
              <Text
                style={{
                  color: msg.sender === "user" ? "#fff" : "#333",
                }}
              >
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={newMessage}
          onChangeText={setNewMessage}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F5F6FA",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 10,
    padding: 6,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },
  chatContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#EBF5FF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B3D9FF",
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  infoText: {
    fontSize: 13,
    color: "#4A5568",
  },
  messagesList: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 16,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#667EEA",
    borderTopRightRadius: 0,
  },
  adminBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E7EB",
    borderTopLeftRadius: 0,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F5F6FA",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#667EEA",
    alignItems: "center",
    justifyContent: "center",
  },
});
