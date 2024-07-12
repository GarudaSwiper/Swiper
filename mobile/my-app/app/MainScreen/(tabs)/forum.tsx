import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Make sure to install expo vector icons
import forumDetails from "../../../constants/forum.js";

const bgSwiper = require("../../../assets/images/bgSwiper.jpg");
const user = require("../../../assets/images/user.jpeg");

export default function ForumTab() {
  const [selectedForumTopics, setSelectedForumTopics] = useState(1);
  const [forumTopics, setForumTopics] = useState(forumDetails);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const TopicDetailView = ({ topic, onClose }) => (
    <View style={styles.fullScreenView}>
      <ScrollView style={styles.detailScrollView}>
        <Text style={styles.detailTitle}>{topic.title}</Text>
        <View style={styles.detailAuthorContainer}>
          <Image source={user} style={styles.detailAvatar} />
          <View>
            <Text style={styles.detailAuthor}>{topic.name}</Text>
            <Text style={styles.detailDate}>{topic.date}</Text>
          </View>
        </View>
        <Text style={styles.detailDescription}>{topic.description}</Text>
        <Text style={styles.detailReplies}>{topic.num_reply} Replies</Text>
      </ScrollView>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const toggleLike = (id) => {
    prevTopics = forumTopics.map((topic) => {
      if (topic.id === id) {
        return { ...topic, liked: !topic.liked };
      }
      return topic;
    });
    setForumTopics(prevTopics);
  };

  return (
    <ImageBackground source={bgSwiper} style={styles.background}>
      <View style={styles.container}>
        {selectedTopic ? (
          <TopicDetailView
            topic={selectedTopic}
            onClose={() => setSelectedTopic(null)}
          />
        ) : (
          <>
            <Text style={styles.header}>Forum</Text>

            <ScrollView style={styles.tabContainer} horizontal={true}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedForumTopics === 1 && styles.activeTab,
                ]}
                onPress={() => setSelectedForumTopics(1)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedForumTopics === 1 && styles.activeTabText,
                  ]}
                >
                  For You
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedForumTopics === 2 && styles.activeTab,
                ]}
                onPress={() => setSelectedForumTopics(2)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedForumTopics === 2 && styles.activeTabText,
                  ]}
                >
                  Most Recent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedForumTopics === 3 && styles.activeTab,
                ]}
                onPress={() => setSelectedForumTopics(3)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedForumTopics === 3 && styles.activeTabText,
                  ]}
                >
                  Liked
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedForumTopics === 4 && styles.activeTab,
                ]}
                onPress={() => setSelectedForumTopics(4)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedForumTopics === 4 && styles.activeTabText,
                  ]}
                >
                  Explore
                </Text>
              </TouchableOpacity>
            </ScrollView>

            <ScrollView style={styles.topicsContainer}>
              {forumTopics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={styles.topicCard}
                  onPress={() => setSelectedTopic(topic)}
                >
                  <Image source={user} style={styles.avatar} />
                  <View style={styles.topicInfo}>
                    <Text style={styles.topicTitle}>{topic.title}</Text>
                    <Text style={styles.topicAuthor}>{topic.name}</Text>
                    <Text style={styles.topicDetails}>
                      {topic.num_reply} Replies
                    </Text>
                  </View>
                  <View style={styles.topicRight}>
                    <TouchableOpacity onPress={() => toggleLike(topic.id)}>
                      <Ionicons
                        name={topic.liked ? "heart" : "heart-outline"}
                        size={24}
                        color={topic.liked ? "#FF69B4" : "#D3D3D3"}
                      />
                    </TouchableOpacity>
                    <Text style={styles.topicDate}>{topic.date}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 70,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginLeft: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#4169E1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  tabText: {
    color: "#888",
    fontSize: 16,
  },
  activeTabText: {
    color: "white",
    fontSize: 16,
  },
  topicsContainer: {
    paddingHorizontal: 20,
  },
  topicCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  topicAuthor: {
    fontSize: 14,
    color: "#888",
  },
  topicDetails: {
    fontSize: 12,
    color: "#888",
  },
  topicRight: {
    alignItems: "flex-end",
  },
  topicDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
  fullScreenView: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    paddingTop: 90,
    marginHorizontal: 10,
  },
  detailScrollView: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  detailAuthorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  detailAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  detailAuthor: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  detailDate: {
    fontSize: 14,
    color: "#888",
  },
  detailDescription: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  detailReplies: {
    fontSize: 14,
    color: "#888",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
