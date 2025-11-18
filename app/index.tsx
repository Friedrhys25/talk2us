import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../backend/firebaseConfig";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🟢 Login function with comprehensive error handling
  const handleLogin = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Sign in the user
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login successful!");
      
      // Don't show alert, just navigate
      router.replace("/(tabs)/home");
    } catch (error: any) {
      
      // Detailed error handling based on Firebase error codes
      let errorTitle = "Login Failed";
      let errorMessage = "Something went wrong. Please try again.";
      
      switch (error.code) {
        case "auth/user-not-found":
          errorTitle = "Account Not Found";
          errorMessage = "No account exists with this email address. Please check your email or register a new account.";
          break;
          
        case "auth/wrong-password":
          errorTitle = "Incorrect Password";
          errorMessage = "The password you entered is incorrect. Please try again or reset your password.";
          break;
          
        case "auth/invalid-email":
          errorTitle = "Invalid Email";
          errorMessage = "The email address is not valid. Please check and try again.";
          break;
          
        case "auth/user-disabled":
          errorTitle = "Account Disabled";
          errorMessage = "This account has been disabled. Please contact support.";
          break;
          
        case "auth/too-many-requests":
          errorTitle = "Too Many Attempts";
          errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
          break;
          
        case "auth/network-request-failed":
          errorTitle = "Network Error";
          errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
          break;
          
        case "auth/invalid-credential":
          errorTitle = "Invalid Credentials";
          errorMessage = "The email or password is incorrect. Please check your credentials and try again.";
          break;
          
        case "auth/operation-not-allowed":
          errorTitle = "Login Unavailable";
          errorMessage = "Email/password login is currently disabled. Please contact support.";
          break;
          
        default:
          errorMessage = error.message || "An unexpected error occurred. Please try again.";
      }
      
      Alert.alert(errorTitle, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#f9f9f9" }}>
      <Text style={{ 
        fontSize: 30, 
        fontWeight: "bold", 
        marginBottom: 10, 
        textAlign: "center",
        color: "#333"
      }}>
        Talk2us
      </Text>
      
      <Text style={{ 
        fontSize: 14, 
        color: "#666", 
        textAlign: "center", 
        marginBottom: 30 
      }}>
        Sign in to continue
      </Text>

      {/* Email Input */}
      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" }}>
          Email Address
        </Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          style={{
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            padding: 12,
            backgroundColor: "#fff",
            fontSize: 15,
          }}
        />
      </View>

      {/* Password Input */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" }}>
          Password
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            style={{
              flex: 1,
              padding: 12,
              fontSize: 15,
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ paddingHorizontal: 12 }}
            disabled={loading}
          >
            <Text style={{ color: "#007AFF", fontWeight: "600" }}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#99c2ff" : "#007AFF",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 15,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Log In
          </Text>
        )}
      </TouchableOpacity>

      {/* Forgot Password Link */}
      <TouchableOpacity 
        onPress={() => Alert.alert("Forgot Password", "Password reset feature coming soon!")}
        disabled={loading}
        style={{ marginBottom: 20 }}
      >
        <Text style={{ color: "#007AFF", textAlign: "center", fontSize: 14 }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
        <Text style={{ marginHorizontal: 10, color: "#666", fontSize: 13 }}>
          Don't have an account?
        </Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
      </View>

      {/* Register Button */}
      <TouchableOpacity 
        onPress={() => router.push("/register")} 
        disabled={loading}
        style={{
          backgroundColor: "#fff",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#007AFF",
        }}
      >
        <Text style={{ color: "#007AFF", fontSize: 16, fontWeight: "bold" }}>
          Create New Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}