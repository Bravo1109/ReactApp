import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from "react";
import Home from './Screens/Home';
import ClassA from './Screens/ClassA';
import Create from './Screens/Create';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Chat from './Screens/Chat';
import SignUp from './Screens/SignUp';
import StartPage from './Screens/StartPage';
import Profile from './Screens/Profile';



const Stack = createStackNavigator()

const myStyles = {
  title: "Chat List",
  headerTintColor: "white",
  headerStyle: {
    backgroundColor: "blue"
  }
}

function App() {

  return (
    <View style={styles.container}>
      <Stack.Navigator>
        <Stack.Screen name = "StartScreen" component={StartPage}
          // options = {myStyles}
        />
        <Stack.Screen name = "Signup" component={SignUp}
          options = {{...myStyles, title: "Login"}}
        />
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
  );
}

export default() => {
  return (
    <NavigationContainer>
      <App/>
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
