import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, View, Button, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './Home';

function StartPage(props) {
  getTokenData = async () => {
    try {
      const tokenData = await AsyncStorage.getItem('token')
      setToken(tokenData)
      return tokenData
    } catch(e) {
      console.log('error', e)
    }
  }
  const [token, setToken] = useState()
  const clickedItem = () => {
    props.navigation.navigate("Home")
  }
  getTokenData()
  setTimeout(() => {
    if (token != undefined) {
        clickedItem()
    }
  }, 1000)
  

  return (
    <Text></Text>
  )
}

export default StartPage