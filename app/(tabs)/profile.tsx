import { useState } from "react";

const Ionicons = ({ name, size, color }) => {
  const iconMap = {
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
    "close": "✕"
  };
  return (
    <span style={{ fontSize: size, lineHeight: 1 }}>
      {iconMap[name] || "•"}
    </span>
  );
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState({
    name: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "0912 345 6789",
    address: "Purok 1, Brgy San Roque, Victoria",
    memberSince: "January 2024"
  });

  const stats = [
    { label: "Complaints Filed", value: "12", icon: "📋", color: "#4A90E2" },
    { label: "Resolved", value: "9", icon: "✅", color: "#50C878" },
    { label: "Response Rate", value: "95%", icon: "📈", color: "#F39C12" },
  ];

  const recentActivity = [
    { id: 1, action: "Filed complaint", title: "Road repair needed", time: "2 days ago", status: "In Progress" },
    { id: 2, action: "Received response", title: "Street light issue", time: "5 days ago", status: "Resolved" },
    { id: 3, action: "Submitted feedback", title: "Service improvement", time: "1 week ago", status: "Reviewed" },
  ];

  const menuItems = [
    { id: 1, title: "Change Password", icon: "shield-outline", color: "#667eea" },
  ];

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Redirect to index page
    window.location.href = '/';
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
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
          <h1 style={styles.headerText}>Profile</h1>
          <button style={styles.editButton}>
            <Ionicons name="create-outline" size={22} color="#667eea" />
          </button>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div style={styles.modalOverlay} onClick={cancelLogout}>
            <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalIcon}>
                <Ionicons name="log-out-outline" size={48} color="#E74C3C" />
              </div>
              <h2 style={styles.modalTitle}>Log Out</h2>
              <p style={styles.modalMessage}>
                Are you sure you want to log out? You'll need to sign in again to access your account.
              </p>
              <div style={styles.modalButtons}>
                <button style={styles.cancelButton} onClick={cancelLogout}>
                  Cancel
                </button>
                <button style={styles.confirmButton} onClick={confirmLogout}>
                  Yes, Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.scrollContent}>
          {/* Profile Header Card */}
          <div style={styles.profileCard}>
            <div style={styles.avatarContainer}>
              <div style={styles.avatar}>
                <Ionicons name="person-circle" size={80} color="#667eea" />
              </div>
              <button style={styles.avatarBadge}>
                <Ionicons name="create-outline" size={16} color="white" />
              </button>
            </div>
            <h2 style={styles.userName}>{userData.name}</h2>
            <p style={styles.userEmail}>{userData.email}</p>
            <div style={styles.memberBadge}>
              <Ionicons name="trophy-outline" size={14} color="#F39C12" />
              <span style={styles.memberText}>Member since {userData.memberSince}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} style={styles.statCard}>
                <div style={{ ...styles.statIcon, backgroundColor: `${stat.color}15` }}>
                  <span style={{ fontSize: 24 }}>{stat.icon}</span>
                </div>
                <p style={styles.statValue}>{stat.value}</p>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Personal Information */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Personal Information</h3>
            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>
                  <Ionicons name="person-outline" size={20} color="#666" />
                </div>
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Full Name</p>
                  <p style={styles.infoValue}>{userData.name}</p>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>
                  <Ionicons name="mail-outline" size={20} color="#666" />
                </div>
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Email Address</p>
                  <p style={styles.infoValue}>{userData.email}</p>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>
                  <Ionicons name="call-outline" size={20} color="#666" />
                </div>
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Phone Number</p>
                  <p style={styles.infoValue}>{userData.phone}</p>
                </div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoIcon}>
                  <Ionicons name="location-outline" size={20} color="#666" />
                </div>
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Address</p>
                  <p style={styles.infoValue}>{userData.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Recent Activity</h3>
            <div style={styles.activityList}>
              {recentActivity.map((activity) => (
                <div key={activity.id} style={styles.activityItem}>
                  <div style={styles.activityIcon}>
                    <Ionicons name="document-text-outline" size={20} color="#667eea" />
                  </div>
                  <div style={styles.activityContent}>
                    <p style={styles.activityAction}>{activity.action}</p>
                    <p style={styles.activityTitle}>{activity.title}</p>
                    <div style={styles.activityFooter}>
                      <span style={styles.activityTime}>
                        <Ionicons name="time-outline" size={14} color="#999" />
                        {activity.time}
                      </span>
                      <span
                        style={{
                          ...styles.activityBadge,
                          backgroundColor: activity.status === "Resolved" ? "#D4EDDA" : 
                                          activity.status === "In Progress" ? "#FFF3CD" : "#E3F2FD",
                          color: activity.status === "Resolved" ? "#155724" : 
                                activity.status === "In Progress" ? "#856404" : "#1565C0",
                        }}
                      >
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Change Password */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Security</h3>
            <div style={styles.menuList}>
              {menuItems.map((item) => (
                <button key={item.id} style={styles.menuItem}>
                  <div style={styles.menuLeft}>
                    <div style={{ ...styles.menuIcon, backgroundColor: `${item.color}15` }}>
                      <Ionicons name={item.icon} size={20} color={item.color} />
                    </div>
                    <span style={styles.menuTitle}>{item.title}</span>
                  </div>
                  <div style={styles.menuRight}>
                    <span style={{ fontSize: 18, color: "#999" }}>›</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <button style={styles.logoutButton} onClick={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#E74C3C" />
            <span style={styles.logoutText}>Log Out</span>
          </button>

          <div style={{ height: 40 }} />
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
    position: "relative",
  },
  headercon: {
    padding: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F6FA",
    borderBottom: "1px solid #E0E0E0",
    flexShrink: 0,
  },
  backButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    margin: 0,
    flex: 1,
    textAlign: "center",
  },
  editButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "20px 20px",
    backgroundColor: "#F5F7FA",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: "40px 32px",
    maxWidth: "400px",
    width: "100%",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    margin: "0 0 12px 0",
  },
  modalMessage: {
    fontSize: 15,
    color: "#4A5568",
    lineHeight: 1.6,
    margin: "0 0 28px 0",
  },
  modalButtons: {
    display: "flex",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: "14px 24px",
    backgroundColor: "#F3F4F6",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  confirmButton: {
    flex: 1,
    padding: "14px 24px",
    backgroundColor: "#E74C3C",
    border: "none",
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    display: "inline-block",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    backgroundColor: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "#667eea",
    border: "3px solid white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    margin: "0 0 4px 0",
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
    margin: "0 0 12px 0",
  },
  memberBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFF9E6",
    padding: "6px 12px",
    borderRadius: 20,
    border: "1px solid #FFE082",
  },
  memberText: {
    fontSize: 13,
    color: "#F39C12",
    fontWeight: "600",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 12px",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1A1A1A",
    margin: "0 0 4px 0",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    margin: 0,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    margin: "0 0 16px 0",
  },
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  infoItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    margin: "0 0 4px 0",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    margin: 0,
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  activityItem: {
    display: "flex",
    gap: 14,
    padding: 14,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 13,
    color: "#6B7280",
    margin: "0 0 4px 0",
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    margin: "0 0 8px 0",
  },
  activityFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  activityBadge: {
    padding: "4px 10px",
    borderRadius: 10,
    fontSize: 11,
    fontWeight: "600",
  },
  menuList: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  menuLeft: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  menuRight: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  logoutButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 16,
    backgroundColor: "#FFEBEE",
    border: "none",
    borderRadius: 16,
    cursor: "pointer",
    marginTop: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E74C3C",
  },
};