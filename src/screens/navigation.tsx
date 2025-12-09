import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./Home";
import FindDoctor from "./FindDoctor";
import Icon from "react-native-vector-icons/Ionicons"; // icons

const Tab = createBottomTabNavigator();
const Navigation: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 5,
        },
        tabBarActiveTintColor: "#0000FF",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = "";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "FindDoctor") {
            iconName = focused ? "medkit" : "medkit-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="FindDoctor" component={FindDoctor} />
    </Tab.Navigator>
  );
};

export default Navigation;
