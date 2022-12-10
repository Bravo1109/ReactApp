import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, View, Button, FlatList, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import Home from './Home';


function StartPage(props) {
  getTokenData = async () => {
    try {
      const tokenData = await AsyncStorage.getItem('token')
      setToken(tokenData)
      setLoading(false)
      return tokenData
    } catch(e) {
      console.log('error', e)
      setLoading(false)
    }
  }
  const [loading, setLoading] = useState(true)
  const isFocused = useIsFocused();
  const [token, setToken] = useState()
  const checkLoading = () => {
    setTimeout(() => {
      if (token == undefined) {
        props.navigation.navigate("Signup")
      }
      else {
        props.navigation.navigate("App")
      }
    }, 100)
  }
  useEffect(() => {
    getTokenData()
  }, [isFocused])

  if (!loading) {
    return (
      checkLoading()
    )
  };
  return (
    <ActivityIndicator/>
  )
}

export default StartPage