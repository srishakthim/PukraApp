import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Swiper from "react-native-swiper";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { WebView } from "react-native-webview";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Api from "../Api";
import { API_URLS } from "../ApiUrls";
import styles from "./styles/HomeStyles";
import { specialities } from "../data/specialitiesData";

// ----- Type Definitions -----
interface Slide {
  image: { original_url: string };
}

interface Doctor {
  name: string;
  degrees: string;
  title: string;
  img: string;
}

interface Event {
  id: string | number;
  title: string;
  date: string;
  month: string;
}

interface NewsItem {
  id: string | number;
  title: string;
  description: string;
  date: string;
  image: string;
}

interface Blog {
  id: string | number;
  title: string;
  type: string;
  image_url?: string;
  youtube_link?: string;
  doctor_name?: string;
}

const { width } = Dimensions.get("window");
const cardWidth = width * 0.7;
const gap = 16;

const Home: React.FC = () => {
  const navigation = useNavigation<any>();
  const swiperRef = useRef<any>(null);
  const scrollRef = useRef<ScrollView>(null);

  // ----- State -----
  const [slides, setSlides] = useState<Slide[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // ----- Fetch Slides -----
  const fetchSlides = async () => {
    try {
      const res = await Api.get(API_URLS.SLIDES);
      setSlides(res?.data?.slides || []);
    } catch (err) {
      console.error("Error fetching slides:", err);
    }
  };

  // ----- Fetch Doctors -----
  const fetchDoctors = async () => {
    try {
      const res = await Api.get(API_URLS.DOCTORS);
      const mappedDoctors = res.data.doctors.map((doc: any) => ({
        name: doc.name,
        degrees: doc.qualification || "",
        title: doc.specialization || "",
        img: doc.photo?.original_url || "",
      }));
      setDoctors(mappedDoctors);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  // ----- Fetch Events & News -----
  const fetchEventsAndNews = async () => {
    try {
      const eventRes = await Api.get(API_URLS.EVENTS);
      const eventData: Event[] = eventRes.data.events || [];
      setEvents(eventData);

      const newsRes = await Api.get(API_URLS.NEWS);
      const newsData: NewsItem[] = (newsRes.data.news || []).map((n: any) => ({
        ...n,
        image: n.image?.original_url,
      }));
      setNews(newsData);
      setFeaturedNews(newsData[0] || null);
    } catch (err) {
      console.error("Failed to fetch events/news:", err);
    }
  };

  // ----- Fetch Blogs -----
  const fetchBlogs = async () => {
    try {
      const res = await Api.get(API_URLS.BLOG);
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchSlides(), fetchDoctors(), fetchEventsAndNews(), fetchBlogs()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  // ----- Group specialities for Swiper -----
  const groupedSpecialities: typeof specialities[][] = [];
  for (let i = 0; i < specialities.length; i += 4) {
    groupedSpecialities.push(specialities.slice(i, i + 4));
  }

  // ----- Latest Events & News -----
  const latestEvents = [...events]
    .sort((a, b) => new Date(`${b.month} ${b.date}`).getTime() - new Date(`${a.month} ${a.date}`).getTime())
    .slice(0, 5);

  const latestNews = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // ----- Blogs Youtube Embed -----
  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/embed/")) return url.split("?")[0];
    if (url.includes("youtube.com/watch?v=")) return url.replace("watch?v=", "embed/").split("?")[0];
    if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/").split("?")[0];
    return url;
  };

  const renderBlogItem = ({ item }: { item: Blog }) => {
    const embedUrl = item.youtube_link ? getEmbedUrl(item.youtube_link) : null;
    return (
      <View style={styles.card}>
        {embedUrl ? (
          <WebView source={{ uri: embedUrl }} style={styles.video} javaScriptEnabled />
        ) : (
          <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
        )}
        <View style={styles.cardContent}>
          <Text style={styles.title}>{item.title}</Text>
          {item.doctor_name && <Text style={styles.doctorName}>{item.doctor_name}</Text>}
          <Text style={styles.type}>{item.type}</Text>
        </View>
      </View>
    );
  };

  // ----- Feature cards -----
  const features = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/2966/2966485.png",
      title: "PUKRA Integrated Cardiac Care Centre",
      highlight: "PUKRA",
      link: "PatientCare",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/2920/2920244.png",
      title: "Find a Doctor",
      highlight: "Doctor",
      link: "FindDoctor",
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/387/387561.png",
      title: "Book an Appointment",
      highlight: "Appointment",
      link: "Contact",
    },
  ];

  // ----- Technology Cards -----
  const cards = [
    { title: "", img: require("../assets/technology1.png") },
    { title: "", img: require("../assets/technology2.png") },
    { title: "", img: require("../assets/technology3.png") },
    { title: "", img: require("../assets/technology4.png") },
  ];
  const testimonials = [
  {
    doctor: "Dr.Rajendran",
    dept: "Cardiology",
    image:
      "https://static.vecteezy.com/system/resources/previews/026/576/128/non_2x/smiling-young-woman-isolated-png.png",
    review:
      "Very friendly and replying to all the queries patiently. Affordable treatment and far better than KMCH , Royal care or Ganga. Good parking space, canteen , neat and clean.",
    patient: "Google Reviews",
    rating: 5,
  },
  {
    doctor: "Dr.Rajendran",
    dept: "Cardiology",
    image:
      "https://plus.unsplash.com/premium_photo-1690407617686-d449aa2aad3c?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d29tYW4lMjBwbmd8ZW58MHx8MHx8fDA%3D",
    review:
      "My father was admitted this hospital,very good treatment and well experience doctors,Dr.Rajendren sir and team is doing great job",
    patient: "Google Reviews",
    rating: 5,
  },
  {
    doctor: "Dr. Kalaimani",
    dept: "Obstetrics and Gynaecology",
    image:
      "https://static.vecteezy.com/system/resources/previews/051/555/261/non_2x/smiling-professional-woman-indoors-png.png",
    review:
      "We recently had our baby delivered under the care of Dr. Kalaimani, and we are extremely thankful for the support and care she provided throughout the journey.",
    patient: "Google Reviews",
    rating: 5,
  },
  {
    doctor: "General",
    dept: "",
    image:
      "https://png.pngtree.com/png-vector/20231103/ourmid/pngtree-happy-corporate-business-professional-one-man-clipart-white-background-png-image_10329231.png",
    review:
      "New hospital with advanced equipments for detailed investigation and right treatment and care provided by highly experienced medical professionals team.",
    patient: "Google Reviews",
    rating: 5,
  },
];

const featureCards = [
  {
    title: "Out Patients",
    description: "Streamlined Care Anytime @ Your Fingertips",
    icon: <MaterialIcons name="medical-services" size={32} color="white" />,
    bgColor: "#243c94",
  },
  {
    title: "Lab Results",
    description: "Instant Access To Your Health – Track It At Ease",
    icon: <FontAwesome5 name="vials" size={32} color="white" />,
    bgColor: "#1556d6",
  },
];
  return (
    <>
    {/* First Section */}
    <View style={styles.section}>
      <View style={styles.container}>

        {/* LEFT SWIPER */}
        <View style={styles.leftBox}>
          {loading ? (
            <View style={styles.loaderBox}>
              <Text>Loading slides...</Text>
            </View>
          ) : slides.length === 0 ? (
            <View style={styles.loaderBox}>
              <Text>No slides available</Text>
            </View>
          ) : (
            <Swiper
              showsPagination
              autoplay
              autoplayTimeout={3}
              loop
              style={styles.swiper}
            >
              {slides.map((slide, i) => (
                <View key={i} style={styles.slide}>
                  <Image
                    source={{ uri: slide?.image?.original_url || "" }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </Swiper>
          )}
        </View>

        {/* RIGHT CONTENT */}
        <View style={styles.rightBox}>
          <Text style={styles.subText}>Trusted Care for Healthier Tomorrow</Text>

          <Text style={styles.heading}>
            Your Health is,
            {'\n'}
            <Text style={styles.gradientText}>Our Priority!</Text>
          </Text>

          <Text style={styles.description}>
            Pukra is a state-of-the-art super-speciality hospital established
            under the esteemed <Text style={styles.bold}>Kovai Heart Foundation</Text> -
            a trusted name in cardiac care since 2009. With 16 years of excellence,
            Pukra delivers holistic, world-class healthcare with a patient-centric approach.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Specialities' as never)}
          >
            <LinearGradient
              colors={['#606C32', '#827145']}
              style={styles.buttonBg}
            >
              <Text style={styles.buttonText}>Discover Our Services</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    </View>
    {/* Features Section */}
    <View style={styles.featuresContainer}>
      {features.map((feature, index) => {
        const parts = feature.title.split(feature.highlight);

        return (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(feature.link as never)}
          >
            <Image
              source={{ uri: feature.icon }}
              style={styles.icon}
            />

            {/* Safe highlighted text handling */}
            <Text style={styles.title}>
              {parts[0]}
              <Text style={styles.highlight}>{feature.highlight}</Text>
              {parts[1]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
    {/* /*Intro Section */}
     <View style={styles.section}>
      {/* Intro Content */}
      <View style={styles.row}>

        {/* LEFT CONTENT */}
        <View style={styles.leftBox}>
          <Text style={styles.heading}>
            Welcome to{" "}
            <Text style={styles.gradientText}>PUKRA</Text>
          </Text>

          <Text style={styles.subHeading}>
            — Where every HEART is touched by a legacy of care.
          </Text>

          <Text style={styles.description}>
            Today, we live in a world of striking contrasts - where more
            people than ever are aware of their health, yet face increasingly
            complex challenges. At Pukra, we exist to bridge that gap.{"\n\n"}
            <Text style={styles.highlight}>
              We are committed to delivering healthcare that is advanced,
              innovative, accessible, and deeply compassionate.
            </Text>
            {"\n\n"}
            Pukra is more than a healthcare provider — we are a partner in
            your health journey.
          </Text>

          {/* BUTTONS */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => navigation.navigate("About")}
            >
              <Text style={styles.primaryBtnText}>View More</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => navigation.navigate("FindDoctor")}
            >
              <Text style={styles.secondaryBtnText}>Find Us</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* RIGHT VIDEO */}
        <View style={styles.videoBox}>
          <WebView
            style={{ width: "100%", height: "100%" }}
            javaScriptEnabled
            domStorageEnabled
            source={{
              uri: "https://www.youtube.com/embed/4D8wcAgbknU",
            }}
          />
        </View>
      </View>

      {/* STATS SECTION */}
      <View style={styles.statsRow}>
        {[
          { value: "26+", label: "Years of Experience" },
          { value: "110+", label: "Patient Beds" },
          { value: "20+", label: "Departments" },
          { value: "30+", label: "Doctors" },
        ].map((item, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statNumber}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
    {/* Specialties Section */}
    <View style={styles.section}>
      <Swiper
        ref={swiperRef}
        loop
        autoplay
        autoplayTimeout={2}
        showsPagination={false}
        onIndexChanged={(index) => {
          const p = ((index + 1) / groupedSpecialities.length) * 100;
          setProgress(p);
        }}
        style={{ height: 260 }}
      >
        {groupedSpecialities.map((group, index) => (
          <View key={index} style={styles.slide}>
            <View style={styles.grid}>
              {group.map((item, i) => (
                <View key={i} style={styles.card}>
                  <Image
                    source={{ uri: item.icon }}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                  <Text style={styles.cardText}>{item.title}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </Swiper>

      {/* Progress Bar + Arrows */}
      <View style={styles.actionsRow}>
        {/* Progress Bar */}
        <View style={styles.progressBarOuter}>
          <View
            style={[styles.progressBarInner, { width: `${progress}%` }]}
          />
        </View>

        {/* Arrows */}
        <View style={styles.arrowRow}>
          <TouchableOpacity
            onPress={() => swiperRef.current?.scrollBy(-1)}
            style={styles.arrowBtn}
          >
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => swiperRef.current?.scrollBy(1)}
            style={styles.arrowBtn}
          >
            <Text style={styles.arrowText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    {/* Our Doctors Section */}
    <View style={styles.section}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Our Doctors</Text>
          <Text style={styles.subHeading}>Our Highly skilled Doctors!</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("FindDoctor" as never)}
        >
          <LinearGradient
            colors={["#606C32", "#827145"]}
            style={styles.exploreButton}
          >
            <Text style={styles.exploreText}>Explore Our Medical Team</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Doctors List */}
      <ScrollView contentContainerStyle={styles.grid}>
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#606C32" />
            <Text style={styles.loaderText}>Loading doctors...</Text>
          </View>
        ) : (
          doctors.map((doc, idx) => (
            <TouchableOpacity key={idx} style={styles.card} activeOpacity={0.8}>
              <Image
                source={{ uri: doc.img }}
                style={styles.image}
                resizeMode="cover"
              />

              <View style={styles.cardContent}>
                <Text style={styles.name}>{doc.name}</Text>
                <Text style={styles.degrees}>{doc.degrees}</Text>
                <Text style={styles.title}>{doc.title}</Text>
              </View>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() =>
                  navigation.navigate("BookAppointment" as never, {
                    doctor: doc,
                  })
                }
              >
                <LinearGradient
                  colors={["#606C32", "#827145"]}
                  style={styles.bookGradient}
                >
                  <Text style={styles.bookText}>Book an Appointment</Text>
                </LinearGradient>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
    {/* Personalized Comprehensive */}
     <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Personalized Comprehensive Care for All
        </Text>
      </View>

      {/* Specialties Cards */}
      <View style={styles.gridContainer}>
        {specialties.map((spec, idx) => (
          <View key={idx} style={[styles.card, { backgroundColor: spec.bg }]}>
            {/* Title + Description + Icon */}
            <View style={styles.cardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{spec.title}</Text>
                <Text style={styles.cardDesc}>{spec.description}</Text>
              </View>

              <Image source={spec.img} style={styles.icon} />
            </View>

            {/* Items */}
            <View style={styles.itemsGrid}>
              {spec.items.map((item, i) => (
                <View key={i} style={styles.itemBox}>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
    {/* Technology and Advanced Cardiac care */}
    <View style={styles.section}>
      {/* Heading */}
      <View style={styles.header}>
        <Text style={styles.smallHeading}>Cutting-Edge</Text>
        <Text style={styles.largeHeading}>
          Technology and Advanced Cardiac Care Excellence
        </Text>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + gap}
        decelerationRate="fast"
        contentContainerStyle={styles.carouselContainer}
      >
        {cards.map((card, index) => (
          <View key={index} style={styles.card}>
            <Image source={card.img} style={styles.cardImage} />

            {/* Gradient Overlay */}
            <View style={styles.overlay} />

            {/* Text & Button */}
            <View style={styles.bottomContent}>
              <Text style={styles.cardTitle}>{card.title || " "}</Text>

              <TouchableOpacity style={styles.arrowButton}>
                <Text style={styles.arrowText}>{">"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
    {/* Map Section Doctors */}
     <LinearGradient
      colors={["#2563eb", "#60a5fa"]} // from-blue-600 to-blue-400
      style={styles.section}
    >
      {/* Left Content */}
      <View style={styles.leftContent}>
        <Text style={styles.title}>Beyond Boundaries</Text>
        <Text style={styles.desc}>
          Trusted Care Beyond Borders{"\n"}For Our International Patients
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Explore</Text>
        </TouchableOpacity>
      </View>

      {/* Right World Map + Doctor Images */}
      <View style={styles.rightContent}>
        {/* World Map */}
        <Image
          source={require("../assets/Maps.png")}
          style={styles.worldMap}
        />

        {/* Doctor background */}
        <Image
          source={require("../assets/doctor.png")}
          style={styles.doctorBg}
          resizeMode="cover"
        />

        {/* Profile Image */}
        <View style={styles.profileWrapper}>
          <Image
            source={require("../assets/doctor.png")}
            style={styles.profileImage}
          />
        </View>
      </View>
    </LinearGradient>
    {/* News & Events section */}
     <ScrollView style={styles.section} contentContainerStyle={{ paddingVertical: 16 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>News & Events</Text>
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => navigation.navigate("NewsEvents")}
        >
          <Text style={styles.viewAllText}>View All News & Events</Text>
        </TouchableOpacity>
      </View>

      {/* Content Grid */}
      <View style={styles.grid}>
        {/* Events */}
        <View style={styles.eventsBox}>
          <Text style={styles.subHeading}>Events</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#606C32" />
          ) : latestEvents.length > 0 ? (
            latestEvents.map((event) => (
              <View key={event.id} style={styles.eventItem}>
                <View style={styles.eventDateBox}>
                  <Text style={styles.eventDate}>{event.date}</Text>
                  <Text style={styles.eventMonth}>{event.month}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No events currently.</Text>
          )}
        </View>

        {/* Featured News */}
        <View style={styles.featuredBox}>
          {loading ? (
            <ActivityIndicator size="large" color="#606C32" />
          ) : featuredNews ? (
            <>
              <Image
                source={{ uri: featuredNews.image }}
                style={styles.featuredImage}
              />
              <Text style={styles.newsDate}>{featuredNews.date}</Text>
              <Text style={styles.newsTitle}>{featuredNews.title}</Text>
              <Text style={styles.newsDesc}>{featuredNews.description}</Text>
            </>
          ) : (
            <Text style={styles.emptyText}>No featured news yet.</Text>
          )}
        </View>

        {/* Recent News */}
        <View style={styles.recentBox}>
          {loading ? (
            <ActivityIndicator size="large" color="#606C32" />
          ) : latestNews.length > 0 ? (
            latestNews.map((newsItem) => (
              <View key={newsItem.id} style={styles.recentItem}>
                <Image
                  source={{ uri: newsItem.image }}
                  style={styles.recentImage}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.newsDate}>{newsItem.date}</Text>
                  <Text style={styles.newsTitle}>{newsItem.title}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No recent news yet.</Text>
          )}
        </View>
      </View>
    </ScrollView>
    {/* Blogs & Doctor Vlogs */}
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Blogs & Doctor Vlogs</Text>
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => navigation.navigate("BlogsVlogs")}
        >
          <Text style={styles.viewAllText}>View All Blogs & Vlogs</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#606C32"
          style={{ marginTop: 20 }}
        />
      ) : blogs.length === 0 ? (
        <Text style={styles.noData}>No blogs or vlogs available right now.</Text>
      ) : (
        <FlatList
          data={blogs}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={renderBlogItem}
        />
      )}
    </View>
    {/* Testimonials   */}
     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Title */}
      <Text style={styles.heading}>Testimonials</Text>

      {/* Testimonials Slider */}
      <FlatList
        data={testimonials}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Doctor Info */}
            <View style={styles.doctorInfo}>
              <View style={styles.doctorLeft}>
                <Image source={{ uri: item.image }} style={styles.avatar} />
                <View>
                  <Text style={styles.doctorName}>{item.doctor}</Text>
                  <Text style={styles.dept}>{item.dept}</Text>
                </View>
              </View>
              <FontAwesome5 name="google" size={28} color="#4285F4" />
            </View>

            {/* Review */}
            <Text style={styles.review}>{item.review}</Text>

            {/* Patient + Rating */}
            <View style={styles.patientRating}>
              <Text style={styles.patient}>{item.patient}</Text>
              <View style={styles.rating}>
                {Array.from({ length: item.rating }).map((_, i) => (
                  <FontAwesome5 key={i} name="star" size={16} color="#FACC15" />
                ))}
              </View>
            </View>
          </View>
        )}
      />

      {/* Feature Cards */}
      <View style={styles.featureGrid}>
        {featureCards.map((f, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.featureCard, { backgroundColor: f.bgColor }]}
            onPress={() => console.log("Navigate to login")}
          >
            {f.icon}
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </>
  );
};

export default Home;
