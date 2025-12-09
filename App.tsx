// import Home from "./src/screens/Home";
// import PatientDashboard from "./src/screens/PatientDashboard";


// const App = () => {
    
//     // return <PatientDashboard/>;
//     return<Home/>;
// }

// export default App;

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Navigation from "./src/screens/navigation";
import Home from "./src/screens/Home";
import PatientDashboard from "./src/screens/PatientDashboard";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={Navigation}/>
        <Stack.Screen name="Home" component={Home} />       
        <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
