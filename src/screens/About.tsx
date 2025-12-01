import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  ArrowUpRight,
  Bed,
  Building2,
  Award,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";

export default function AboutUs() {
  const timelineData = [
    {
      year: "1950",
      date: "29th May 1950",
      title: "Building Construction Started",
      desc: "Hospital Construction - Bhoomi Pooja for the construction of the hospital was conducted and the foundation was laid by Sri Bheema Naidu.",
      img: require("../assets/1950.jpg"),
    },
    {
      year: "1952",
      date: "1952",
      title: "Inauguration",
      desc: "Hospital inaugurated with blessings and community participation.",
      img: require("../assets/1952.jpg"),
    },
    {
      year: "1954",
      date: "1954",
      title: "Expansion Phase",
      desc: "Added more facilities to serve patients better.",
      img: require("../assets/1954.jpg"),
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () =>
    setActiveIndex((prev) =>
      prev === 0 ? timelineData.length - 1 : prev - 1
    );

  const handleNext = () =>
    setActiveIndex((prev) =>
      prev === timelineData.length - 1 ? 0 : prev + 1
    );

  const [activeTab, setActiveTab] = useState<"vision" | "mission" | "values">(
    "vision"
  );

  const tabs = {
    vision: {
      title: "Our Vision",
      text: "It is the vision of the PUKRA Hospital to be a humane health care service provider...",
      image: require("../assets/vision.jpg"),
    },
    mission: {
      title: "Our Mission",
      text: "Our mission is to provide world-class medical services with compassion...",
      image: require("../assets/mission.jpg"),
    },
    values: {
      title: "Values",
      text: "We value compassion, integrity, excellence, and respect...",
      image: require("../assets/value.jpg"),
    },
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.breadcrumb}>Home / About Us</Text>
        <Text style={styles.title}>About Us</Text>
        <Text style={styles.subtitle}>Our Story of Growth</Text>

        <Image
          source={require("../assets/about-banner.jpg")}
          style={styles.bannerImage}
        />
      </View>

      {/* Stats Section */}
      <View style={styles.statsGrid}>
        <StatBox icon={<ArrowUpRight size={24} />} value="6" label="Lac Sq.ft Infra" />
        <StatBox icon={<Award size={24} />} value="73+" label="Years Experience" />
        <StatBox icon={<Bed size={24} />} value="650+" label="Patient Beds" />
        <StatBox icon={<Building2 size={24} />} value="40+" label="Departments" />
        <StatBox icon={<UserCheck size={24} />} value="250+" label="Doctors" />
      </View>

      {/* Founder Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Our Founder</Text>
        <Text style={styles.sectionText}>
          Inspired by excellence, PUKRA was built under the vision of Dr. Rajendran...
        </Text>

        <Image
          source={require("../assets/founder.jpg")}
          style={styles.founderImage}
        />
        <Text style={styles.founderName}>Dr. Rajendran</Text>
        <Text style={styles.founderRole}>Chief Cardiologist</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {Object.keys(tabs).map((key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.tabButton,
              activeTab === key && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(key as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === key && styles.activeTabText,
              ]}
            >
              {tabs[key as keyof typeof tabs].title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.tabContent}>
        <Text style={styles.tabTitle}>{tabs[activeTab].title}</Text>
        <Text style={styles.sectionText}>{tabs[activeTab].text}</Text>

        <Image source={tabs[activeTab].image} style={styles.tabImage} />
      </View>

      {/* Timeline Section */}
      <View style={styles.timelineWrapper}>
        <Text style={styles.sectionTitle}>Our Growth Timeline</Text>

        <Image
          source={timelineData[activeIndex].img}
          style={styles.timelineImage}
        />

        <Text style={styles.timelineYear}>{timelineData[activeIndex].year}</Text>
        <Text style={styles.timelineTitle}>{timelineData[activeIndex].title}</Text>
        <Text style={styles.sectionText}>{timelineData[activeIndex].desc}</Text>

        <View style={styles.timelineArrowRow}>
          <TouchableOpacity onPress={handlePrev}>
            <ChevronLeft size={32} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext}>
            <ChevronRight size={32} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const StatBox = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) => (
  <View style={styles.statBox}>
    {icon}
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", paddingHorizontal: 20 },
  header: { alignItems: "center", marginTop: 50 },
  breadcrumb: { color: "#888" },
  title: { fontWeight: "bold", fontSize: 28, marginTop: 5, color: "#112" },
  subtitle: { color: "#555", marginBottom: 10 },
  bannerImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    resizeMode: "cover",
  },

  statsGrid: {
    marginTop: 25,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statBox: {
    width: "48%",
    backgroundColor: "#eef3ff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },

  statValue: { fontSize: 22, fontWeight: "bold", marginTop: 5 },
  statLabel: { fontSize: 12, textAlign: "center", marginTop: 3 },

  section: { marginTop: 40, alignItems: "center" },
  sectionTitle: { fontSize: 22, fontWeight: "bold", color: "#111" },
  sectionText: { textAlign: "center", marginVertical: 10, color: "#555" },
  founderImage: {
    width: 220,
    height: 250,
    marginVertical: 10,
    resizeMode: "contain",
  },
  founderName: { fontWeight: "600", fontSize: 18 },
  founderRole: { fontSize: 14, color: "#777" },

  tabsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    flexWrap: "wrap",
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderRadius: 20,
    margin: 6,
  },
  activeTabButton: {
    backgroundColor: "#cddcff",
    borderColor: "transparent",
  },
  tabText: { color: "#000" },
  activeTabText: { fontWeight: "bold" },

  tabContent: { alignItems: "center" },
  tabTitle: { fontSize: 20, fontWeight: "bold" },
  tabImage: { marginTop: 10, width: "100%", height: 180, borderRadius: 12 },

  timelineWrapper: { marginTop: 40, alignItems: "center" },
  timelineImage: { width: "100%", height: 200, borderRadius: 10 },
  timelineYear: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  timelineTitle: { fontSize: 16, marginTop: 4 },
  timelineArrowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 120,
    marginTop: 15,
  },
});
