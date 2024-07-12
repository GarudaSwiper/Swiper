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
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const [isLoading, setIsLoading] = useState(false);
  const [showSwipeable, setShowSwipeable] = useState(false);
  const cameraRef = useRef(null);
  const [plannerItems, setPlannerItems] = useState(planner);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
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
        maxDuration: 60, // Set maximum duration to 60 seconds
      };
      const video = await cameraRef.current
        ?.recordAsync(options)
        .then(async (data) => {
          console.log("HALO");
          console.log("Video recorded:", data.uri);
          setVideo(data);
          return data;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
      setIsFullScreen(false);

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setShowSwipeable(true);
      }, 10000); // 10 seconds delay
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

  const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Analyzing your response...</Text>
      <ActivityIndicator size="large" color="#FFB069" />
    </View>
  );

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const bookAppointment = () => {
    Alert.alert("Appointment Booked", "Your place has been reserved!", [
      { text: "OK" },
    ]);
  };

  return (
    <ImageBackground source={bgSwiper} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Swiper</Text>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={32} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.streakContainer}>
          <Text style={styles.streakText}>🔥 7 Day Streak!</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: "70%" }]} />
          </View>
        </View>

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

        {isLoading ? (
          <LoadingScreen />
        ) : (
          !isFullScreen &&
          showSwipeable && (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
            >
              {plannerItems.map((item, index) => (
                <Swipeable
                  key={item.id}
                  ref={swipeableRefs.current[index]}
                  renderRightActions={renderRightActions}
                  renderLeftActions={renderLeftActions}
                  onSwipeableRightOpen={() => {
                    toggleStatus(index, "completed");
                    setTimeout(() => {
                      swipeableRefs.current[index].current?.close();
                    }, 1);
                  }}
                  onSwipeableLeftOpen={() => {
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
                      <View key={taskIndex} style={styles.taskContainer}>
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={24}
                          color="#666"
                        />
                        <View style={styles.taskTextContainer}>
                          <Text style={styles.taskTitle}>{task.taskTitle}</Text>
                          <Text style={styles.taskDuration}>
                            {task.duration} min
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </Swipeable>
              ))}
              <View style={styles.appointmentContainer}>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {date.toLocaleString()}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="datetime"
                    is24Hour={true}
                    display="default"
                    onChange={onChangeDate}
                  />
                )}
                <TouchableOpacity
                  style={styles.appointmentButton}
                  onPress={bookAppointment}
                >
                  <Text style={styles.appointmentButtonText}>
                    Appointment with Live Expert
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )
        )}

        {isFullScreen && (
          <View style={styles.fullScreenGreetingContainer}>
            <Text style={styles.greetingText}>
              <Text style={styles.emoji}>🦊: </Text>
              If your daily routine were a playlist, what kind of songs would be
              on it?
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  streakContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "90%",
  },
  streakText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  progress: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  taskTextContainer: {
    marginLeft: 10,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  taskDuration: {
    fontSize: 12,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  appointmentContainer: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
  },
  datePickerButton: {
    backgroundColor: "#FFB069",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerButtonText: {
    color: "white",
    fontSize: 16,
  },
  appointmentButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    marginTop: 5,
    borderRadius: 5,
  },
  appointmentButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
});
