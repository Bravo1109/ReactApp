import { StyleSheet, Text, View, StatusBar, SafeAreaView, Button } from 'react-native';
import React, { useState, useEffect } from "react";
import Home from './Screens/Home';
import ClassA from './Screens/ClassA';
import Create from './Screens/Create';
import Constants from 'expo-constants';
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
        {/* <Stack.Screen name = "StartScreen" component={StartPage}
          // options = {myStyles}
        />
        <Stack.Screen name = "Signup" component={SignUp}
          options = {{...myStyles, title: "Login"}}
        /> */}
        <Stack.Screen name = "Home" component={Home}
          options = {{...myStyles, headerLeft: null}}
        />
        <Stack.Screen name = "Create" component={Create}
          options = {{...myStyles, title: "Create message"}}
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

function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details!</Text>
    </View>
  );
}
function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings screen</Text>
      <Button
        title="Log Out"
        onPress={() => {
          AsyncStorage.removeItem('token')
          navigation.navigate('StartScreen')
        }}
      />
      <Button
        title="Console"
      />
    </View>
  );
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
       initialRouteName='ChatList'
       screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'ChatList') {
            iconName = focused
              ? 'comments'
              : 'comments';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'user' : 'user';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
      >
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
