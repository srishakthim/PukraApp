import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Modal,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import Api from "../utils/Api";
import API_URLS from "../config/API_URLS";

const { width } = Dimensions.get("window");

/* ================= TYPES ================= */

interface Slide {
  id: number;
  name: string;
  image: { original_url: string };
}

interface Doctor {
  name: string;
  degrees: string;
  title: string;
  img: string;
}

interface EventItem {
  id: number;
  title: string;
  month: string;
  date: string;
}

interface NewsItem {
  id: number;
  title: string;
  date: string;
  image?: string;
  description?: string;
}

interface Blog {
  id: number;
  title: string;
  image_url?: string;
  youtube_link?: string;
  doctor_name?: string;
  type: string;
}

/* ================= MAIN ================= */

const Home: React.FC = () => {
  const navigation = useNavigation<any>();
  const sliderRef = useRef<FlatList>(null);

  const [slides, setSlides] = useState<Slide[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);
  const [latestEvents, setLatestEvents] = useState<EventItem[]>([]);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    symptoms: "",
    description: "",
  });

  /* ================= FETCH ALL ================= */

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const slideRes = await Api.get(API_URLS.SLIDES);
      setSlides(slideRes.data.slides || []);

      const docRes = await Api.get(API_URLS.DOCTORS);
      setDoctors(
        docRes.data.doctors.map((doc: any) => ({
          name: doc.name,
          degrees: doc.qualification || "",
          title: doc.specialization || "",
          img: doc.photo?.original_url || "",
        }))
      );

      const eventRes = await Api.get(API_URLS.EVENTS);
      setEvents(eventRes.data.events || []);

      const newsRes = await Api.get(API_URLS.NEWS);
      const mappedNews = (newsRes.data.news || []).map((i: any) => ({
        ...i,
        image: i.image?.original_url,
      }));
      setNews(mappedNews);

      if (mappedNews.length > 0) {
        setFeaturedNews(mappedNews[0]);
        setLatestNews(mappedNews.slice(0, 5));
      }

      const blogRes = await Api.get(API_URLS.BLOG);
      setBlogs(blogRes.data.blogs || []);

      setLatestEvents(eventRes.data.events.slice(0, 5));
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= APPOINTMENT ================= */

  const submitAppointment = async () => {
    try {
      setBtnLoading(true);

      await Api.post(API_URLS.APPOINTMENTS, {
        doctor_name: selectedDoctor?.name,
        ...form,
      });

      Alert.alert("✅ Appointment Booked");
      setShowForm(false);
    } catch (err) {
      Alert.alert("❌ Failed to Submit");
    } finally {
      setBtnLoading(false);
    }
  };

  /* ================= YOUTUBE FIX ================= */

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("watch?v="))
      return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/"))
      return url.replace("youtu.be/", "youtube.com/embed/");
    return url;
  };

  /* ================= RENDERS ================= */

  const renderSlide = ({ item }: { item: Slide }) => (
    <Image
      source={{ uri: item.image.original_url }}
      style={styles.slideImg}
    />
  );

  const renderDoctor = ({ item }: { item: Doctor }) => (
    <View style={styles.docCard}>
      <Image source={{ uri: item.img }} style={styles.docImg} />
      <Text style={styles.docName}>{item.name}</Text>
      <Text style={styles.docDeg}>{item.degrees}</Text>
      <Text style={styles.docTitle}>{item.title}</Text>

      <TouchableOpacity
        style={styles.bookBtn}
        onPress={() => {
          setSelectedDoctor(item);
          setShowForm(true);
        }}
      >
        <Text style={{ color: "#fff" }}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );

  /* ================= UI ================= */

  return (
    <ScrollView style={styles.container}>
      {/* SLIDER */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={slides}
          ref={sliderRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderSlide}
        />
      )}

      {/* HERO TEXT */}
      <View style={styles.heroBox}>
        <Text style={styles.heroTag}>Trusted Care for Healthier Tomorrow</Text>
        <Text style={styles.heroTitle}>
          Your Health is {"\n"}
          <Text style={{ color: "#606C32" }}>Our Priority!</Text>
        </Text>

        <TouchableOpacity
          style={styles.heroBtn}
          onPress={() => navigation.navigate("Specialities")}
        >
          <Text style={{ color: "#606C32" }}>Discover Our Services</Text>
        </TouchableOpacity>
      </View>

      {/* DOCTORS */}
      <Text style={styles.sectionTitle}>Our Doctors</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={doctors}
          renderItem={renderDoctor}
          numColumns={2}
          keyExtractor={(_, i) => i.toString()}
        />
      )}

      {/* NEWS & EVENTS */}
      <Text style={styles.sectionTitle}>News & Events</Text>

      {featuredNews && (
        <View style={styles.newsCard}>
          <Image
            source={{ uri: featuredNews.image }}
            style={styles.newsImg}
          />
          <Text style={styles.newsTitle}>{featuredNews.title}</Text>
        </View>
      )}

      {latestEvents.map((event) => (
        <Text key={event.id} style={styles.eventText}>
          {event.date} {event.month} - {event.title}
        </Text>
      ))}

      {/* BLOGS */}
      <Text style={styles.sectionTitle}>Blogs & Doctor Vlogs</Text>

      {blogs.map((item) => (
        <View key={item.id} style={styles.blogCard}>
          {item.youtube_link ? (
            <WebView
              source={{ uri: getEmbedUrl(item.youtube_link) }}
              style={{ height: 200 }}
            />
          ) : (
            <Image
              source={{ uri: item.image_url }}
              style={styles.blogImg}
            />
          )}
          <Text style={styles.blogTitle}>{item.title}</Text>
        </View>
      ))}

      {/* OUT PATIENT & LAB */}
      <View style={styles.cardRow}>
        <TouchableOpacity
          style={styles.blueCard}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.cardTitle}>Out Patients</Text>
          <Text style={styles.cardSub}>Streamlined Care</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.blueCard}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.cardTitle}>Lab Results</Text>
          <Text style={styles.cardSub}>Instant Access</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={showForm} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              Book With {selectedDoctor?.name}
            </Text>

            {Object.keys(form).map((key) => (
              <TextInput
                key={key}
                placeholder={key}
                style={styles.input}
                onChangeText={(t) =>
                  setForm((p) => ({ ...p, [key]: t }))
                }
              />
            ))}

            <TouchableOpacity
              style={styles.submitBtn}
              onPress={submitAppointment}
              disabled={btnLoading}
            >
              <Text style={{ color: "#fff" }}>
                {btnLoading ? "Processing..." : "Submit"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowForm(false)}>
              <Text style={{ color: "red", marginTop: 10 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Home;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  slideImg: { width, height: 260 },

  heroBox: { padding: 16 },
  heroTag: { color: "#2563EB" },
  heroTitle: { fontSize: 26, fontWeight: "bold", marginVertical: 8 },

  heroBtn: {
    borderWidth: 2,
    borderColor: "#606C32",
    padding: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 16,
  },

  docCard: {
    width: width / 2 - 20,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
  },

  docImg: { width: "100%", height: 120, borderRadius: 12 },
  docName: { fontWeight: "bold", marginTop: 5 },
  docDeg: { fontSize: 12, color: "#555" },
  docTitle: { color: "#0F766E" },

  bookBtn: {
    marginTop: 6,
    backgroundColor: "#606C32",
    padding: 6,
    borderRadius: 12,
  },

  newsCard: { marginHorizontal: 16 },
  newsImg: { height: 160, borderRadius: 12 },
  newsTitle: { marginTop: 6, fontWeight: "bold" },

  eventText: { marginLeft: 16, color: "#555" },

  blogCard: { marginHorizontal: 16, marginBottom: 16 },
  blogImg: { height: 160, borderRadius: 12 },
  blogTitle: { fontWeight: "bold", marginTop: 6 },

  cardRow: { flexDirection: "row", padding: 16 },

  blueCard: {
    flex: 1,
    backgroundColor: "#1556d6",
    margin: 8,
    padding: 16,
    borderRadius: 16,
  },

  cardTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  cardSub: { color: "#fff", fontSize: 12 },

  modalBg: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalBox: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 6,
    padding: 10,
    borderRadius: 8,
  },

  submitBtn: {
    backgroundColor: "#606C32",
    padding: 12,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
});
