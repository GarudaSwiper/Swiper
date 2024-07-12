import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const bgSwiper = require("../../../assets/images/bgSwiper.jpg");
const medal = require("../../../assets/images/goldmedal.png");
const profileImage = require("../../../assets/images/caca.jpeg"); // Add your profile image

export default function ExploreTab() {
  return (
    <ImageBackground source={bgSwiper} style={styles.background}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.profileContainer}>
          <Image source={profileImage} style={styles.profileImage} />
          <Text style={styles.name}>Hi, Carlline</Text>
          <Text style={styles.joinDate}>Joined Jul, 2024</Text>
        </View>

        <View style={styles.quoteContainer}>
          <Text style={styles.quoteTitle}>Quote of the day</Text>
          <Text style={styles.quote}>
            Do the best, and God will give you a rest. Keep going, don't give
            up.
          </Text>
          <Text style={styles.quoteAuthor}>KEVIN</Text>
        </View>

        <View style={styles.zenMasterContainer}>
          <Text style={styles.zenMasterTitle}>TASK COMPLETED</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: "71.42857%" }]} />
          </View>
          <Text style={styles.zenMasterProgress}>5/7</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Completed Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>94</Text>
            <Text style={styles.statLabel}>Minutes Spent</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15 days</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share My Stats</Text>
        </TouchableOpacity>

        <View style={styles.medalContainer}>
          <Image source={medal} style={{ width: 60, height: 60 }} />
          <Text style={styles.medalNumber}>3</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  profileContainer: {
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 90,
  },
  settingsButton: {
    position: "absolute",
    paddingTop: 20,
    top: 40,
    right: 20,
  },
  profileImage: {
    width: 125,
    height: 125,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  joinDate: {
    fontSize: 14,
    color: "#666",
  },
  quoteContainer: {
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  quoteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  quote: {
    textAlign: "center",
    marginVertical: 10,
  },
  quoteAuthor: {
    fontWeight: "bold",
  },
  zenMasterContainer: {
    backgroundColor: "#FF9849",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: "80%",
  },
  zenMasterTitle: {
    color: "white",
    fontWeight: "bold",
  },
  progressBar: {
    height: 10,
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 5,
  },
  progress: {
    height: "100%",
    backgroundColor: "#ffd700",
    borderRadius: 5,
  },
  zenMasterLevel: {
    color: "white",
    alignSelf: "flex-start",
  },
  zenMasterProgress: {
    color: "white",
    alignSelf: "flex-end",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  tab: {
    backgroundColor: "#4a0e4e",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabText: {
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  statLabel: {
    fontSize: 12,
    color: "black",
  },
  shareButton: {
    backgroundColor: "#FF9849",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  shareButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  medalContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  medalNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
});
