import { useState } from "react";

const Ionicons = ({ name, size, color }) => {
  const iconMap = {
    "arrow-back": "←",
    "alert-circle": "🚨",
    "call": "📞",
    "location": "📍",
    "time": "🕐",
    "shield": "🛡️",
    "medical": "🏥",
    "flame": "🔥",
    "car": "🚗",
    "warning": "⚠️",
    "pulse": "💓",
    "megaphone": "📢"
  };
  return (
    <span style={{ fontSize: size, lineHeight: 1 }}>
      {iconMap[name] || "•"}
    </span>
  );
};

export default function EmergencyPage() {
  const [selectedEmergency, setSelectedEmergency] = useState(null);

  const emergencyTypes = [
    { id: 1, name: "Police", icon: "🛡️", number: "100", color: "#4A90E2", description: "Crime, security threats" },
    { id: 2, name: "Fire", icon: "🔥", number: "101", color: "#FF6B35", description: "Fire incidents, rescue" },
    { id: 3, name: "Ambulance", icon: "🏥", number: "102", color: "#50C878", description: "Medical emergencies" },
    { id: 4, name: "Disaster", icon: "⚠️", number: "911", color: "#E74C3C", description: "Natural disasters, floods" },
    { id: 5, name: "Traffic", icon: "🚗", number: "136", color: "#F39C12", description: "Accidents, road incidents" },
    { id: 6, name: "Rescue", icon: "💓", number: "143", color: "#9B59B6", description: "Search and rescue" },
  ];

  const recentEmergencies = [
    { id: 1, type: "Medical", location: "Purok 1", time: "5 mins ago", status: "Responding" },
    { id: 2, type: "Fire", location: "Purok 2", time: "15 mins ago", status: "Resolved" },
    { id: 3, type: "Traffic", location: "Purok 4", time: "30 mins ago", status: "Responding" },
  ];

  const safetyTips = [
    { id: 1, title: "Stay Calm", description: "Keep calm and assess the situation before acting" },
    { id: 2, title: "Location Info", description: "Know your exact location to report accurately" },
    { id: 3, title: "Follow Instructions", description: "Listen carefully to emergency responders" },
  ];

  const handleEmergencyCall = (service) => {
    alert(`Calling ${service.name} at ${service.number}\n\nIn your React Native app, use:\nLinking.openURL('tel:${service.number}')`);
  };

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.headercon}>
          <button style={styles.backButton}
            onClick={() => window.history.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />

          </button>
          <h1 style={styles.headerText}>Emergency Services</h1>
        </div>

        <div style={styles.scrollContent}>
          {/* Alert Banner */}
          <div style={styles.alertBanner}>
            <div style={styles.alertIcon}>
              <Ionicons name="alert-circle" size={32} color="#E74C3C" />
            </div>
            <div style={styles.alertContent}>
              <h3 style={styles.alertTitle}>In case of emergency</h3>
              <p style={styles.alertText}>
                Call immediately or use quick dial buttons below. Help is available 24/7.
              </p>
            </div>
          </div>

          {/* Emergency Services Grid */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Quick Emergency Dial</h2>
            <div style={styles.emergencyGrid}>
              {emergencyTypes.map((service) => (
                <div
                  key={service.id}
                  style={{
                    ...styles.emergencyCard,
                    borderColor: selectedEmergency === service.id ? service.color : "#E0E0E0",
                    backgroundColor: selectedEmergency === service.id ? `${service.color}10` : "white",
                  }}
                  onClick={() => setSelectedEmergency(service.id)}
                >
                  <div style={styles.emergencyIcon}>{service.icon}</div>
                  <h3 style={styles.emergencyName}>{service.name}</h3>
                  <p style={styles.emergencyNumber}>{service.number}</p>
                  <p style={styles.emergencyDescription}>{service.description}</p>
                  <button
                    style={{
                      ...styles.callButton,
                      backgroundColor: service.color,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEmergencyCall(service);
                    }}
                  >
                    <Ionicons name="call" size={20} color="white" />
                    <span style={styles.callButtonText}>Call Now</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Safety Tips</h2>
            <div style={styles.tipsGrid}>
              {safetyTips.map((tip) => (
                <div key={tip.id} style={styles.tipCard}>
                  <div style={styles.tipNumber}>{tip.id}</div>
                  <div style={styles.tipContent}>
                    <h4 style={styles.tipTitle}>{tip.title}</h4>
                    <p style={styles.tipDescription}>{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Emergencies */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Recent Emergency Reports</h2>
            <div style={styles.recentList}>
              {recentEmergencies.map((emergency) => (
                <div key={emergency.id} style={styles.recentItem}>
                  <div style={styles.recentIcon}>
                    <Ionicons name="megaphone" size={20} color="#666" />
                  </div>
                  <div style={styles.recentContent}>
                    <div style={styles.recentHeader}>
                      <h4 style={styles.recentType}>{emergency.type}</h4>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: emergency.status === "Resolved" ? "#D4EDDA" : "#FFF3CD",
                          color: emergency.status === "Resolved" ? "#155724" : "#856404",
                        }}
                      >
                        {emergency.status}
                      </span>
                    </div>
                    <div style={styles.recentDetails}>
                      <span style={styles.recentLocation}>
                        <Ionicons name="location" size={14} color="#999" />
                        {emergency.location}
                      </span>
                      <span style={styles.recentTime}>
                        <Ionicons name="time" size={14} color="#999" />
                        {emergency.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Note */}
          <div style={styles.noteCard}>
            <div style={styles.noteIcon}>⚠️</div>
            <div style={styles.noteContent}>
              <h4 style={styles.noteTitle}>Important Reminder</h4>
              <p style={styles.noteText}>
                Only call emergency services for genuine emergencies. False reports may be subject to penalties and delay help to those in real need.
              </p>
            </div>
          </div>
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
  },
  container: {
    width: "100%",
    height: "100%",
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
  scrollContent: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "20px 20px",
  },
  alertBanner: {
    display: "flex",
    flexDirection: "row",
    gap: 16,
    padding: 20,
    backgroundColor: "#FFEBEE",
    borderRadius: 16,
    border: "2px solid #FF5252",
    marginBottom: 28,
  },
  alertIcon: {
    flexShrink: 0,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#C62828",
    margin: "0 0 6px 0",
  },
  alertText: {
    fontSize: 14,
    color: "#D32F2F",
    margin: 0,
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  emergencyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
  },
  emergencyCard: {
    padding: 20,
    borderRadius: 16,
    border: "2px solid #E0E0E0",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  emergencyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emergencyName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    margin: "0 0 4px 0",
  },
  emergencyNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#333",
    margin: "0 0 8px 0",
  },
  emergencyDescription: {
    fontSize: 12,
    color: "#666",
    margin: "0 0 16px 0",
    lineHeight: 1.4,
  },
  callButton: {
    width: "100%",
    padding: "10px 20px",
    border: "none",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  callButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
  },
  tipsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  tipCard: {
    display: "flex",
    gap: 16,
    padding: 18,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
  },
  tipNumber: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    backgroundColor: "#667eea",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: "700",
    flexShrink: 0,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    margin: "0 0 4px 0",
  },
  tipDescription: {
    fontSize: 14,
    color: "#666",
    margin: 0,
    lineHeight: 1.5,
  },
  recentList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  recentItem: {
    display: "flex",
    gap: 16,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    border: "1px solid #E5E7EB",
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  recentContent: {
    flex: 1,
  },
  recentHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  recentType: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    margin: 0,
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  recentDetails: {
    display: "flex",
    gap: 16,
  },
  recentLocation: {
    fontSize: 13,
    color: "#666",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  recentTime: {
    fontSize: 13,
    color: "#666",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  noteCard: {
    display: "flex",
    gap: 16,
    padding: 20,
    backgroundColor: "#FFF9E6",
    borderRadius: 16,
    border: "1px solid #FFE082",
    marginBottom: 20,
  },
  noteIcon: {
    fontSize: 32,
    flexShrink: 0,
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F57C00",
    margin: "0 0 6px 0",
  },
  noteText: {
    fontSize: 14,
    color: "#E65100",
    margin: 0,
    lineHeight: 1.6,
  },
};