// import PatientDashboard from "./src/screens/PatientDashboard";

// const App = () => {
//     return <PatientDashboard />;
// }

// export default App;


import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PatientLogin from "./src/screens/PatientLogin";
import MainTabNavigator from "./src/components/MainTabNavigator";

export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={PatientLogin} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
