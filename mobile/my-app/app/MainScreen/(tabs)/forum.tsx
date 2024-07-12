import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeTab() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6E6FA",
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
});
