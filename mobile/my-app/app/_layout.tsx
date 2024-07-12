import React from "react";
import { Stack } from "expo-router";
import { View, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="MainScreen" options={{ headerShown: false }} />
    </Stack>
  );
}
