import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PatientDashboard: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Patient Dashboard</Text>
      <Text style={styles.text}>
        Welcome to the patient dashboard! Here you can manage everything.
      </Text>
    </View>
  );
};

export default PatientDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  text: {
    fontSize: 16,
    color: "#555",
  },
});
