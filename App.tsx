import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Base, Typography, NavigationStyle } from "./styles";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Delays from './components/delays/Delays.tsx';
import Map from "./components/map/Map.tsx"
import Search from './components/search/Search';
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from 'react-native';
import Auth from "./components/auth/Auth.tsx";
import FlashMessage from "react-native-flash-message";
import { useState, useEffect } from 'react';
import Favorites from './components/favorites/Favorites.tsx';
import stationsModel from './models/stations';



const routeIcons = {
  "Sök": "search",
  "Förseningar": "time-outline",
  "Logga in": "log-in-outline",
  "Mina sidor": "person-circle-outline"
};

const CustomTabButton = (props) => (
  <TouchableOpacity
    {...props}
    style={
      props.accessibilityState.selected
        ? [props.style, { borderTopColor: '#c8272f', borderTopWidth: 2, borderTopLeftRadius:100, borderTopRightRadius:100 }]
        : props.style
    }
  />
);

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<Boolean>(false);
  const [stations, setStations] = useState([]);
  const [favDelays, setFavDelays] = useState([]);
  const [favStations, setFavStations] = useState([]);

  useEffect(() => {
    (async () => {
        setStations(await stationsModel.getStations());
    })();
  }, []);



  // useEffect(() => {
  //   (async () => {
  //     setIsLoggedIn(await authModel.loggedIn() );
  //   })();
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = routeIcons[route.name] || "alert";
            
            return <Ionicons name={iconName} size={size} color={color} style={styles.tabBarItem} />;
          },
          tabBarActiveTintColor: '#c8272f',
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle:{fontWeight:"500"}
        })}
        >
          <Tab.Screen name="Sök" options={{tabBarButton: CustomTabButton, headerShown: false }} >
            {() => <Search stations={stations} favStations={favStations} setFavStations={setFavStations} isLoggedIn={isLoggedIn} />}
          </Tab.Screen>
          <Tab.Screen name="Förseningar" options={{tabBarButton: CustomTabButton, headerShown: false}} >
            {() => <Delays stations={stations} isLoggedIn={isLoggedIn} favDelays={favDelays} setFavDelays={setFavDelays} />}
          </Tab.Screen>
          {isLoggedIn ?
          <Tab.Screen name="Mina sidor" options={{tabBarButton: CustomTabButton}} >
            {() => <Favorites setIsLoggedIn={setIsLoggedIn} favDelays={favDelays} setFavDelays={setFavDelays} stations={stations} favStations={favStations} setFavStations={setFavStations} />}
          </Tab.Screen> :
          <Tab.Screen name="Logga in" options={{tabBarButton: CustomTabButton, headerShown: false}} >
            {() => <Auth setIsLoggedIn={setIsLoggedIn} setFavDelays={setFavDelays} setFavStations={setFavStations} /> }
          </Tab.Screen>
          
          }
        </Tab.Navigator>
      </NavigationContainer>
      <FlashMessage position="top" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  border: {
  },
  tabBarItem: {
    fontWeight:"bold"
  }
});
