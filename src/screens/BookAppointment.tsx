import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import emailjs from "emailjs-com";
import Api from "../utils/Api";
import API_URLS from "../config/API_URLS";

interface FormState {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  symptoms: string;
  description: string;
}

const BookAppointment: React.FC = () => {
  const [btnLoading, setBtnLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    symptoms: "",
    description: "",
  });

  const handleChange = (key: keyof FormState, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const sendEmail = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.date ||
      !formData.time ||
      !formData.symptoms ||
      !formData.description
    ) {
      Alert.alert("Validation Error", "Please fill all fields");
      return;
    }

    setBtnLoading(true);

    try {
      // Save to Backend
      await Api.post(API_URLS.APPOINTMENTS, formData);

      // Send Email via EmailJS
      await emailjs.send(
        "service_w1td76c", // Service ID
        "template_cs39cld", // Template ID
        {
          patient_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          preferredDate: formData.date,
          timeSlot: formData.time,
          symptoms: formData.symptoms,
          description: formData.description,
        },
        "9IiQILbseS_yDnazv" // Public Key
      );

      Alert.alert("Success ✅", "Consultation request sent successfully!");

      // Reset Form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        symptoms: "",
        description: "",
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error ❌", "Failed to submit request");
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book Appointment</Text>
        <Text style={styles.subtitle}>
          Your easy Hospital Guide, All in One Place
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Book Your Consultation</Text>

      <TextInput
        style={styles.input}
        placeholder="Patient Name"
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Preferred Date (YYYY-MM-DD)"
        value={formData.date}
        onChangeText={(text) => handleChange("date", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Time Slot (HH:MM)"
        value={formData.time}
        onChangeText={(text) => handleChange("time", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Symptoms"
        value={formData.symptoms}
        onChangeText={(text) => handleChange("symptoms", text)}
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={formData.description}
        onChangeText={(text) => handleChange("description", text)}
      />

      <TouchableOpacity
        style={[
          styles.button,
          btnLoading && styles.disabledButton,
        ]}
        onPress={sendEmail}
        disabled={btnLoading}
      >
        {btnLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Submit Consultation Request →
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#606C32",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

