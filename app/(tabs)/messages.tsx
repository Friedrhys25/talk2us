import { useState, useEffect, useRef } from "react";

const Ionicons = ({ name, size, color }) => {
  const iconMap = {
    "arrow-back": "←",
    "send": "➤",
    "chatbubble-ellipses-outline": "💬",
    "person-circle-outline": "👤",
  };
  return (
    <span style={{ fontSize: size, lineHeight: 1, color }}>{iconMap[name] || "•"}</span>
  );
};

export default function MessagesPage() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "admin", text: "Hello! How can I assist you today?" },
    { id: 2, sender: "user", text: "Good day! I just want to report a broken streetlight." },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const userMsg = { id: Date.now(), sender: "user", text: newMessage };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "admin", text: "Got it! We’ll forward this to our maintenance team." },
      ]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.headercon}>
          <button style={styles.backButton} 
          onClick={() => window.history.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </button>
          <h1 style={styles.headerText}>Messages</h1>
        </div>

        {/* Chat Area */}
        <div style={styles.chatContainer}>
          <div style={styles.infoCard}>
            <Ionicons name="chatbubble-ellipses-outline" size={26} color="#4A90E2" />
            <div>
              <h3 style={styles.infoTitle}>Barangay Chat Support</h3>
              <p style={styles.infoText}>You’re now chatting with an admin. Please be respectful.</p>
            </div>
          </div>

          <div style={styles.messagesList}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...styles.messageBubble,
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#667EEA" : "#E5E7EB",
                  color: msg.sender === "user" ? "white" : "#333",
                  borderTopRightRadius: msg.sender === "user" ? 0 : 16,
                  borderTopLeftRadius: msg.sender === "admin" ? 0 : 16,
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div style={styles.inputContainer}>
          <input
            type="text"
            style={styles.input}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button style={styles.sendButton} onClick={sendMessage}>
            <Ionicons name="send" size={22} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  safeArea: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#F5F7FA",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },
  headercon: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderBottom: "1px solid #E0E0E0",
    flexShrink: 0,
  },
  backButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 8,
    marginRight: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    margin: 0,
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: 20,
    backgroundColor: "#F9FAFB",
  },
  infoCard: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    backgroundColor: "#EBF5FF",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #B3D9FF",
    marginBottom: 20,
  },
  infoTitle: {
    margin: 0,
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  infoText: {
    margin: "4px 0 0 0",
    fontSize: 13,
    color: "#4A5568",
  },
  messagesList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    flexGrow: 1,
    overflowY: "auto",
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: "10px 16px",
    borderRadius: 16,
    fontSize: 15,
    lineHeight: 1.4,
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    wordBreak: "break-word",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#F5F6FA",
    borderTop: "1px solid #E0E0E0",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    fontSize: 15,
    borderRadius: 20,
    border: "2px solid #E0E0E0",
    outline: "none",
    marginRight: 10,
  },
  sendButton: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    border: "none",
    borderRadius: "50%",
    width: 44,
    height: 44,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
};
