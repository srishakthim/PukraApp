import { API_BASE_URL } from "@env";

const API_URLS = {
  BASE_URL: API_BASE_URL || "http://10.0.2.2:8000",

  // Public
  DOCTORS: "/doctors",
  EVENTS: "/events",
  NEWS: "/news",
  SLIDES: "/slides",
  BLOG: "/blogs",
  APPOINTMENTS: "/appointments",

  // Patient Authentication
  PATIENT_REGISTER: "/api/register",
  PATIENT_LOGIN: "/api/login",
  PATIENT_LOGOUT: "/api/patient/logout",
  PATIENT_PROFILE: "/api/patient/profile",
  PATIENT_CHANGE_PASSWORD: "/api/patient/change-password",
};

export default API_URLS;
