import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";

// ✅ Emoji-based Ionicons (no dependency)
type IoniconsProps = {
  name: keyof typeof iconMap | string;
  size: number;
  color?: string;
};

const iconMap : { [key: string]: string } = {
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
  close: "✕",
};

const Ionicons: React.FC<IoniconsProps> = ({ name, size, color = "#000" }) => {
  return <Text style={{ fontSize: size, color }}>{iconMap[name]}</Text>;
};

export default function ProfilePage() {
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userData, setUserData] = useState({
    name: "Juan Dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "0912 345 6789",
    address: "Purok 1, Brgy San Roque, Victoria",
    memberSince: "January 2024",
  });

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
  const confirmLogout = () => router.push("/");
  const cancelLogout = () => setShowLogoutModal(false);

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

        {/* Modal */}
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
              { icon: "location-outline", label: "Address", value: userData.address },
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
