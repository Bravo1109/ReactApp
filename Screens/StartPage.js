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
  const loadData = () => {
    fetch('http://172.20.10.3:8000/api/chats/', {
      method:"GET",
      headers: {
        'Authorization': `${token}`
      }
    }).then((resp) => {
      if (resp.status == 200) {
        props.navigation.navigate("App")
      }
      else {
        props.navigation.navigate("Signup")
      }
    })
    .catch(error => {
      console.log("Error", error)
      AsyncStorage.removeItem('token')
      props.navigation.navigate('Signup')
    })
  }
  const checkLoading = () => {
    setTimeout(() => {
      if (token == undefined) {
        props.navigation.navigate("Signup")
      }
      else {
        loadData()
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