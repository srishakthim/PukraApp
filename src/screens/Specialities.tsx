import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from "react-native"; 
import Icon from 'react-native-vector-icons/FontAwesome';
import { FaThumbsUp } from "react-icons/fa";
import Dermatology from "../assets/specialities/Dermatology.jpg";
import Diagnostic from "../assets/specialities/diagnostic.jpg";
import Emergency from "../assets/specialities/Emergency.jpg";
import Endocrinology from "../assets/specialities/Endocrinology.jpg";
import ENT from "../assets/specialities/ENT.jpg";
import Gastroenterology from "../assets/specialities/Gastroenterology.jpg";
import HPB from "../assets/specialities/HPB.jpg";
import GeneralMedicine from "../assets/specialities/GeneralMedicine.jpg";
import GeneralSurgery from "../assets/specialities/GeneralSurgery.jpg";
import HealthCare from "../assets/specialities/HealthCare.jpg";
import IntensiveCare from "../assets/specialities/IntensiveCare.jpg";
import InterventionalRadiology from "../assets/specialities/InterventionalRadiology.jpg";
import LaboratoryMedicine from "../assets/specialities/LaboratoryMedicine.jpg";
import Nephrology from "../Assets/specialities/Nephrology.jpg";
import Neurology from "../assets/specialities/Neurology.jpg";
import Neurosurgery from "../assets/specialities/Neurosurgery.jpg";
import Molecular from "../assets/specialities/Molecular.jpg";
import Obstetrics from "../assets/specialities/Obstetrics.jpg";
import Oncology from "../assets/specialities/Oncology.jpeg";
import Ophthalmology from "../assets/specialities/Ophthalmology.jpg";
import Orthopedics from "../assets/specialities/Orthopedics.jpg";
import Paediatrics from "../assets/specialities/Paediatrics.jpg";
import PainMedicine from "../assets/specialities/PainMedicine.jpg";
import Palliative from "../assets/specialities/Palliative.jpg";

export default function Specialities() {
  const departments = [
     { name: "Dermatology Aesthetics and Lasers", icon: Dermatology },
    { name: "Diagnostic Radiology", icon: Diagnostic },
    { name: "Emergency Medicine", icon: Emergency },
    { name: "Endocrinology and Diabetology", icon: Endocrinology },
    { name: "ENT and Skull Base Surgery", icon: ENT },
    { name: "Gastroenterology", icon: Gastroenterology },
    { name: "Gastrointestinal and HPB Surgery", icon: HPB },
    { name: "General Medicine", icon: GeneralMedicine },
    { name: "General Surgery", icon: GeneralSurgery },
    { name: "Home Health Care Services", icon: HealthCare },
    { name: "Intensive Care Unit", icon: IntensiveCare },
    { name: "Interventional Radiology", icon: InterventionalRadiology },
    { name: "Laboratory Medicine", icon: LaboratoryMedicine },
    { name: "Nephrology", icon: Nephrology },
    { name: "Neurology", icon: Neurology },
    { name: "Neurosurgery", icon: Neurosurgery },
    { name: "Nuclear Medicine and Molecular Imaging", icon: Molecular },
    { name: "Obstetrics and Gynaecology", icon: Obstetrics },
    { name: "Oncology", icon: Oncology },
    { name: "Ophthalmology", icon: Ophthalmology },
    { name: "Orthopedics", icon: Orthopedics },
    { name: "Paediatrics", icon: Paediatrics },
    { name: "Pain Medicine", icon: PainMedicine },
    { name: "Palliative Care Service", icon: Palliative },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.breadcrumb}>Home / Specialities</Text>
        <Text style={styles.title}>Specialities</Text>
        <Text style={styles.subtitle}>
          Every Care You Need, Right Here – Where You Feel Right At Home
        </Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Enquiry Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Tele Consultation</Text>
          </TouchableOpacity>
        </View>

        {/* Image */}
        <Image
          source={{
            uri: "https://img.freepik.com/free-photo/doctor-with-stethoscope-hand-touching-icons-medical-technology-network-connection-medical-technology-concept-blue-background-copy-space_150455-14291.jpg",
          }}
          style={styles.mainImage}
        />
      </View>

      {/* Departments Grid */}
      <View style={styles.grid}>
        {departments.map((dept, index) => (
          <View key={index} style={styles.card}>
            <Image source={dept.icon} style={styles.icon} />
            <Text style={styles.cardText}>{dept.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f5f7ff", padding: 20 },
  topSection: { marginBottom: 20 },
  breadcrumb: { color: "gray", marginBottom: 6 },
  title: { fontSize: 26, fontWeight: "bold", color: "#102a6d", marginBottom: 10 },
  subtitle: { color: "#555", marginBottom: 15 },
  buttonRow: { flexDirection: "row", gap: 10 },
  primaryBtn: {
    backgroundColor: "#102a6d",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  primaryBtnText: { color: "white", fontWeight: "600" },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: "#102a6d",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  secondaryBtnText: { color: "#102a6d", fontWeight: "600" },
  mainImage: { width: "100%", height: 200, borderRadius: 12, marginTop: 20 },

  /** Grid **/
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    height: 140,
    backgroundColor: "#eaf0ff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { width: 50, height: 50, marginBottom: 10, borderRadius: 6 },
  cardText: { textAlign: "center", fontSize: 12, fontWeight: "600", color: "#001f5c" },
});
