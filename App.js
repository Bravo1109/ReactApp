import { StyleSheet, View} from 'react-native';
import React, { useState, useEffect } from "react";
import Home from './Screens/Home';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Chat from './Screens/Chat';
import SignUp from './Screens/SignUp';
import StartPage from './Screens/StartPage';
import Profile from './Screens/Profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyProfile from './Screens/MyProfile';
import RatingList from './Screens/RatingList';
import Swipes from './Screens/Swipes';
import LikesList from './Screens/LikesList';

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

const myStyles = {
  title: "Chat List",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "blue"
  }
}

function ChatStackScreen() {
  return(
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name = "Home" component={Home}
          options = {{...myStyles, headerLeft: null}}
        />
        <Stack.Screen name = "Chat" component={Chat}
          options = {{...myStyles, title: "Chat"}}
        />
        <Stack.Screen name = "Profile" component={Profile}
          options = {{...myStyles, title: "Profile"}}
        />

      </Stack.Navigator>
    </View>
  )
}

function RatingListStackScreen() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="RatingStack" component={RatingList}
      options={{...myStyles, title: "Rating List", headerLeft: null}}
      />
      <Stack.Screen name = "Profile" component={Profile}
      options = {{...myStyles, title: "Profile"}}
      />
      <Stack.Screen name = "Chat" component={Chat}
      options = {{...myStyles, title: "Chat"}}
      />
    </Stack.Navigator>
  )
}
function ProfileStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProfile" component={MyProfile}
      options={{...myStyles, title: "My Profile", headerLeft: null}}
       />
    </Stack.Navigator>
  );
}

function SwipeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Swipes page" component={Swipes}
      options={{...myStyles, title: "Swipes", headerLeft: null}}
      />
    </Stack.Navigator>
  )
}

function LikeStackScreen() {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Likes List" component={LikesList}
      options={{...myStyles, title: "Likes", headerLeft: null}}
      />
      <Stack.Screen name = "Profile" component={Profile}
        options = {{...myStyles, title: "Profile"}}
      />
    </Stack.Navigator>
  )
}

function LoginScreen() {
  return(
    <Stack.Navigator>
      <Stack.Screen name = "StartScreen" component={StartPage}
          // options = {myStyles}
        />
      <Stack.Screen name="App" component={App}
          options = {{...myStyles, headerLeft: null, headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen name = "Signup" component={SignUp}
          options = {{...myStyles, title: "Log in", headerLeft: null, gestureEnabled: false}}
        />
    </Stack.Navigator>
  )
}

function App() {

  return (
    <View style={styles.container}>
      <Tab.Navigator
       initialRouteName='Swipes'
       screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ChatList') {
            iconName = focused
              ? 'comments'
              : 'comments';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'user' : 'user';
            
          } else if (route.name === 'RatingList') {
            iconName = focused ? 'users' : 'users';
          } else if (route.name === 'Loading Progress') {
            iconName = focused ? 'star' : 'star';
          } else if (route.name === 'Swipes') {
            iconName = focused ? 'search' : 'search';
          } else if (route.name === 'Likes') {
            iconName = focused ? 'heart' : 'heart';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
      >
        <Tab.Screen name = "RatingList" component={RatingListStackScreen}
        options = {{...myStyles, title: "Rating list", headerShown: false}}
        />
        <Tab.Screen name = "Swipes" component={SwipeStackScreen}
        options = {{...myStyles, title: "Swipes", headerShown: false}}
        />
        <Tab.Screen name = "Likes" component={LikeStackScreen}
        options = {{...myStyles, title: "Likes", headerShown: false}}
        />
        <Tab.Screen name = "ChatList" component={ChatStackScreen}
        options = {{...myStyles, title: "Chats", headerShown: false}}
        />
        <Tab.Screen name = "Settings" component={ProfileStackScreen}
        options = {{...myStyles, title: "Profile", headerShown: false}}
        />
      </Tab.Navigator>
    </View>
  );
}

export default() => {
  return (
    <NavigationContainer>
      <LoginScreen/>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eddfdf',
    // marginTop: Constants.statusBarHeight,
  },
});
