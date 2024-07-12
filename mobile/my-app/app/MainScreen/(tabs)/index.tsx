import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import * as FileSystem from "expo-file-system";
import Swipeable from "react-native-gesture-handler/Swipeable";
import planner from "../../../constants/planner.js";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const bgSwiper = require("../../../assets/images/bgSwiper.jpg");
const foxAvatar = require("../../../assets/images/foxAvatar.jpeg");

export default function HomeTab() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [video, setVideo] = useState(null);
  const cameraRef = useRef(null);
  const [plannerItems, setPlannerItems] = useState(planner);
  const swipeableRefs = useRef(planner.map(() => React.createRef()));

  const requestPermissions = async () => {
    const cameraPermissionResult = await requestCameraPermission();
    const microphonePermissionResult = await requestMicrophonePermission();
    return cameraPermissionResult.granted && microphonePermissionResult.granted;
  };

  if (!cameraPermission || !microphonePermission) {
    return <View />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermissions} title="grant permission" />
      </View>
    );
  }

  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const options = {
        quality: "1080p",
        maxDuration: 60, // Set maximum duration to 60 seconds
        mute: false,
      };
      const video = await cameraRef.current
        ?.recordAsync(options)
        .then(async (data) => {
          console.log("Video recorded:", data.uri);
          setVideo(data);
          return data;
        });
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
      return;
    }
  };

  const toggleRecording = () => {
    console.log(isRecording);
    if (isRecording) {
      stopRecording();
      setIsFullScreen(false);
    } else {
      startRecording();
      setIsFullScreen(true);
    }
  };

  const deleteTemporaryFile = async (uri) => {
    try {
      await FileSystem.deleteAsync(uri);
      console.log("Temporary file deleted:", uri);
    } catch (error) {
      console.error("Error deleting temporary file:", error);
    }
  };

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });
    return (
      <View style={styles.rightAction}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Completed
        </Animated.Text>
      </View>
    );
  };

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0, 1],
      outputRange: [-1, 0, 0, 0],
    });
    return (
      <View style={styles.leftAction}>
        <Animated.Text
          style={[
            styles.actionText,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          Todo
        </Animated.Text>
      </View>
    );
  };

  const toggleStatus = (index, status) => {
    const newPlannerItems = [...plannerItems];
    newPlannerItems[index].status = status;
    setPlannerItems(newPlannerItems);
  };

  return (
    <ImageBackground source={bgSwiper} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.cameraContainer,
            isFullScreen && styles.fullScreenCamera,
          ]}
        >
          <CameraView
            style={styles.camera}
            facing={"front"}
            ref={cameraRef}
            video={true}
            audio={true}
          />
          <Image
            source={foxAvatar}
            style={[
              styles.foxAvatar,
              isFullScreen && styles.fullScreenFoxAvatar,
            ]}
          />
        </View>
        <TouchableOpacity
          style={[styles.button, isFullScreen && styles.fullScreenButton]}
          onPress={toggleRecording}
        >
          <Text style={styles.text}>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
        {!isFullScreen && (
          <>
            {video && (
              <Text style={styles.videoInfo}>
                Recorded video file: {video.uri}
              </Text>
            )}
            <ScrollView style={styles.scrollView}>
              {plannerItems.map((item, index) => (
                <Swipeable
                  key={item.id}
                  ref={swipeableRefs.current[index]}
                  renderRightActions={renderRightActions}
                  renderLeftActions={renderLeftActions}
                  onSwipeableRightOpen={() => {
                    console.log(`Completed: ${item.day}`);
                    toggleStatus(index, "completed");
                    setTimeout(() => {
                      swipeableRefs.current[index].current?.close();
                    }, 1);
                  }}
                  onSwipeableLeftOpen={() => {
                    console.log(`Todo: ${item.day}`);
                    toggleStatus(index, "todo");
                    setTimeout(() => {
                      swipeableRefs.current[index].current?.close();
                    }, 1);
                  }}
                >
                  <View
                    style={[
                      styles.swipeableContent,
                      item.status === "completed" &&
                        styles.swipeableContentCompleted,
                    ]}
                  >
                    <Text style={styles.dayText}>{item.day}</Text>
                    {item.task.map((task, taskIndex) => (
                      <Text key={taskIndex} style={styles.taskText}>
                        {task.taskTitle} ({task.duration} min)
                      </Text>
                    ))}
                  </View>
                </Swipeable>
              ))}
            </ScrollView>
          </>
        )}
        {isFullScreen && (
          <View style={styles.fullScreenGreetingContainer}>
            <Text style={styles.greetingText}>
              <Text style={styles.emoji}>🦊: </Text>
              How do you feel after a tiring weekend?
            </Text>
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

// ... styles remain the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 30,
  },
  cameraContainer: {
    marginTop: 10,
    width: windowWidth * 0.4,
    height: windowHeight * 0.3,
    overflow: "hidden",
    borderRadius: 20,
    marginBottom: 20,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  foxAvatar: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3, // Add this line
    borderColor: "#4CAF50",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#FFB069",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  videoInfo: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
  scrollView: {
    width: "100%",
    marginTop: 20,
  },
  swipeableContent: {
    backgroundColor: "white",
    padding: 15,
    width: windowWidth * 0.8,
    marginBottom: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  swipeableContentCompleted: {
    backgroundColor: "#FFC591", // Light green color
  },
  taskText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 10,
    marginBottom: 5,
  },
  rightAction: {
    backgroundColor: "#ebb390",
    justifyContent: "center",
    alignItems: "flex-end",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 10,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 20,
  },
  leftAction: {
    backgroundColor: "#A9A9A9", // Dark gray color for "Todo"
    justifyContent: "center",
    alignItems: "flex-start",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  emoji: {
    fontSize: 24,
    marginRight: 5,
  },
  fullScreenCamera: {
    position: "absolute",
    top: 40,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: 0,
    zIndex: 1,
  },
  fullScreenFoxAvatar: {
    width: 100,
    height: 100,
    borderRadius: 10,
    top: 40,
    left: 20,
    // bottom: 100,
    // right: 20,
  },
  fullScreenButton: {
    position: "absolute",
    bottom: 40,
    zIndex: 2,
    alignSelf: "center",
  },
  fullScreenGreetingContainer: {
    position: "absolute",
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
  },
});
