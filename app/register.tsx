import React, { useState, useEffect } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AppleAuthentication from "expo-apple-authentication";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../backend/firebaseConfig";

// Required for Google sign-in to complete properly
WebBrowser.maybeCompleteAuthSession();

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [purok, setPurok] = useState("1");
  const [age, setAge] = useState("");
  const [number, setNumber] = useState("");
  const [idImage, setIdImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Google Auth setup
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "https://talk2kap-f73a0.firebaseapp.com/__/auth/handler",
    webClientId: "897405877837-160fj4ma3h5m0cslkq5tolb580vlhlde.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Google Auth Success:", authentication);
      setModalVisible(true);
    }
  }, [response]);

  // Pick image
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

  // Email register
  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Update display name
      await updateProfile(user, { displayName: name });

      // Save data to Realtime DB
      await set(ref(db, "users/" + user.uid), {
        name,
        email,
        address,
        purok,
        age,
        number,
        idImage: idImage || null,
      });

      setModalVisible(true);
    } catch (error: any) {
      alert(error.message);
    }
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
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
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
            {idImage ? "Change ID Picture" : "Upload ID Picture"}
          </Text>
        </TouchableOpacity>

        {idImage && <Image source={{ uri: idImage }} style={styles.idImage} />}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register with Email</Text>
        </TouchableOpacity>

        {/* Google Sign In */}
        <TouchableOpacity
          style={[styles.registerButton, { backgroundColor: "#DB4437" }]}
          disabled={!request}
          onPress={() => promptAsync()}
        >
          <Text style={styles.registerButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        {/* Apple Sign In */}
        {Platform.OS === "ios" && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={{ width: "100%", height: 50, marginTop: 12 }}
            onPress={async () => {
              try {
                const credential = await AppleAuthentication.signInAsync({
                  requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                  ],
                });
                console.log("Apple login success:", credential);
                setModalVisible(true);
              } catch (e: any) {
                if (e.code === "ERR_CANCELED") return;
                alert("Apple Sign-In failed");
              }
            }}
          />
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>Wait for ID verification...</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
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
    width: 250,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
