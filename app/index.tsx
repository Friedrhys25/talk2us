import { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (username === "Admin" && password === "Admin") {
      router.replace("/(tabs)/home"); // ✅ go to Home tab after login
    } else {
      Alert.alert("Login Failed", "Invalid username or password");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: "bold", marginBottom: 20 , textAlign: "center"}}>
        Talk2us
      </Text>

      {/* Username */}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 15,
        }}
      />

      {/* Password */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 15,
        }}
      >
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={{
            flex: 1,
            padding: 10,
          }}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ paddingHorizontal: 10 }}
        >
          <Text style={{ color: "blue" }}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login button */}
      <TouchableOpacity
        onPress={handleLogin}
        style={{
          backgroundColor: "#007AFF",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 10,
          marginTop: 10,
        }}
      >
        <Text style={{ color: "white", fontSize: 15, fontWeight: "bold" ,}}>
          Login
        </Text>
      </TouchableOpacity>

      {/* Register button */}
      <TouchableOpacity
        onPress={() => router.push("/register")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "blue", textAlign: "center" }}>
          Don’t have an account? Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}