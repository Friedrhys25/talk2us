import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { auth, db } from "../backend/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [purok, setPurok] = useState("1");
  const [age, setAge] = useState("");
  const [number, setNumber] = useState("");
  const [idImage, setIdImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Pick image (to follow upload later)
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setIdImage(result.assets[0].uri);
    }
  };

  // Register user
  const handleRegister = async () => {
    console.log("Register button pressed");

    if (!email || !password || !name) {
      Alert.alert("Missing fields", "Please fill in all required fields!");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      Alert.alert("Weak Password", "Password must be at least 6 characters long");
      return;
    }

    try {
      console.log("Creating user with email:", email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("✅ User created successfully:", user.uid);

      // Save additional user data to Realtime Database
      await set(ref(db, `users/${user.uid}`), {
        name,
        email,
        address,
        purok,
        age,
        number,
        idImage: null, // Will implement image upload later
        createdAt: new Date().toISOString(),
      });

      console.log("✅ User data saved to database");
      setModalVisible(true);
    } catch (error: any) {
      console.error("❌ Firebase Error:", error.code, error.message);
      
      // Show user-friendly error messages
      let errorMessage = "Something went wrong";
      
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already registered";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/Password sign-in is not enabled. Please contact support.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection.";
          break;
        default:
          errorMessage = error.message || "Registration failed";
      }
      
      Alert.alert("Registration Error", errorMessage);
    }
  };

  // When OK is pressed, go back to index.tsx
  const handleSuccessClose = () => {
    setModalVisible(false);
    router.push("/"); // goes back to index.tsx
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password (min 6 characters)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select Purok:</Text>
          <Picker
            selectedValue={purok}
            onValueChange={(itemValue) => setPurok(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Purok 1" value="1" />
            <Picker.Item label="Purok 2" value="2" />
            <Picker.Item label="Purok 3" value="3" />
            <Picker.Item label="Purok 4" value="4" />
            <Picker.Item label="Purok 5" value="5" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          keyboardType="phone-pad"
          value={number}
          onChangeText={setNumber}
        />

        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>
            {idImage ? "Change ID Picture" : "Upload ID Picture (Optional)"}
          </Text>
        </TouchableOpacity>

        {idImage && <Image source={{ uri: idImage }} style={styles.idImage} />}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>✅ Registration Successful!</Text>
              <Text style={styles.modalSubText}>You can now log in with your credentials</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleSuccessClose}
              >
                <Text style={styles.closeButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
    overflow: "hidden",
  },
  label: {
    padding: 8,
    fontWeight: "bold",
  },
  picker: { width: "100%" },
  imageButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#3498db",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  idImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  registerButton: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#2ecc71",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalBox: {
    width: 280,
    padding: 25,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalSubText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});