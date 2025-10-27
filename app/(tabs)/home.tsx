import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// ✅ Custom Ionicons replacement using emojis
const Ionicons = ({ name, size, color }) => {
  const iconMap = {
    "mail-outline": "✉️",
    "alert-circle-outline": "🚨",
    "analytics-outline": "📊",
    "people-outline": "👤",
    "shield-outline": "🛡️",
    "medical-outline": "🏥",
    "flame-outline": "🔥",
    "chevron-forward": "→",
    "chatbubble-outline": "💬"
  };
  return (
    <Text style={{ fontSize: size, color, lineHeight: size }}>
      {iconMap[name] || "•"}
    </Text>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const services = [
    {
      id: 1,
      name: "Complaints",
      icon: "mail-outline",
      gradient: ["#FF6B6B", "#FF8E8E"],
      route: "/complaints",
    },
    {
      id: 2,
      name: "Emergency",
      icon: "alert-circle-outline",
      gradient: ["#FF6B6B", "#FF8E8E"],
      route: "/emergency",
    },
    {
      id: 3,
      name: "Feedback",
      icon: "analytics-outline",
      gradient: ["#FF6B6B", "#FF8E8E"],
      route: "/feedback",
    },
    {
      id: 4,
      name: "Profile",
      icon: "people-outline",
      gradient: ["#FF6B6B", "#FF8E8E"],
      route: "/profile",
    },
    {
      id: 5,
      name: "Messages",
      icon: "chatbubble-outline",
      gradient: ["#FF6B6B", "#FF8E8E"],
      route: "/messages",
    },
  ];

  const handleServiceClick = (id) => {
    switch (id) {
      case 1:
        router.push("/complaints");
        break;
      case 2:
        router.push("/emergency");
        break;
      case 3:
        router.push("/feedback");
        break;
      case 4:
        router.push("/profile");
        break;
      case 5:
        router.push("/messages");
        break;
      default:
        console.warn("No route found for this service");
    }
  };

  const parallaxTranslate = scrollY.interpolate({
    inputRange: [0, 300],
    outputRange: [0, 150],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Parallax Header */}
        <View style={styles.parallaxContainer}>
          <Animated.View
            style={[
              styles.parallaxBackground,
              { transform: [{ translateY: parallaxTranslate }] },
            ]}
          />
          <View style={styles.overlay} />
          <View style={styles.headerContent}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Municipal Services</Text>
            </View>
            <Text style={styles.headerText}>Welcome to Talk2Kap</Text>
            <Text style={styles.subtitle}>
              Your voice matters. Connect with us anytime.
            </Text>
          </View>
        </View>

        {/* Services Grid */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>What would you like?</Text>
          <Text style={styles.sectionSubtitle}>
            Choose a service to get started
          </Text>
          <View style={styles.grid}>
            {services.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.card,
                  activeCard === service.id && styles.activeCard,
                ]}
                onPress={() => handleServiceClick(service.id)}
                onPressIn={() => setActiveCard(service.id)}
                onPressOut={() => setActiveCard(null)}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={service.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientCard}
                >
                  <Ionicons name={service.icon} size={48} color="#fff" />
                  <Text style={styles.cardLabel}>{service.name}</Text>
                  <Text style={styles.cardDesc}>{service.description}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={40}
                    color="rgba(255,255,255,0.8)"
                    style={styles.arrowIcon}
                  />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Feature Card */}
        <View style={[styles.content, { marginTop: 20, marginBottom: 60 }]}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>💡</Text>
            <Text style={styles.featureTitle}>Did you know?</Text>
            <Text style={styles.featureText}>
              You can track the status of your complaints and receive real-time
              updates through our platform.
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  parallaxContainer: {
    height: 150,
    position: "relative",
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  parallaxBackground: { ...StyleSheet.absoluteFillObject, backgroundColor: "#667eea" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.2)" },
  headerContent: { padding: 20 }, 
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  headerText: { color: "#fff", fontSize: 26, fontWeight: "800" },
  subtitle: { color: "rgba(255,255,255,0.9)", fontSize: 13 },
  content: {
    backgroundColor: "#fff",
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },
  sectionSubtitle: { fontSize: 13, color: "#6B7280", marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  card: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  gradientCard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 12,
  },
  activeCard: { transform: [{ scale: 0.95 }] },
  cardLabel: { color: "#fff", fontSize: 20, fontWeight: "700", marginTop: 6 },
  cardDesc: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
  },
  arrowIcon: { position: "absolute", bottom: 6, right: 6 },
  featureCard: {
    backgroundColor: "#FFF9E6",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 193, 7, 0.2)",
  },
  featureIcon: { fontSize: 42, marginBottom: 8 },
  featureTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A" },
  featureText: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
});
