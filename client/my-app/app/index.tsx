import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
const bgSwiper = require("../assets/images/bgSwiper.jpg");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <ImageBackground source={bgSwiper} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("../assets/images/swiper.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Swiper</Text>
        <Text style={styles.subtitle}>
          Swipe away your mental health concerns
        </Text>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="person-outline"
              size={24}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={24}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAgreeTerms(!agreeTerms)}
        >
          <View style={styles.checkbox}>
            {agreeTerms && (
              <Ionicons name="checkmark" size={18} color="#4CAF50" />
            )}
          </View>
          <Text style={styles.termsText}>
            I agree to the Terms and Conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !agreeTerms && styles.buttonDisabled]}
          disabled={!agreeTerms}
          onPress={() => {
            if (agreeTerms) {
              router.push("/MainScreen/(tabs)");
            }
          }}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    marginBottom: 10,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 10,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 3,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  termsText: {
    fontSize: 14,
    color: "#444",
  },
  button: {
    backgroundColor: "#FBAA66",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    overflow: "hidden",
    opacity: 1,
  },
  buttonDisabled: {
    backgroundColor: "#FFDFC4",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
