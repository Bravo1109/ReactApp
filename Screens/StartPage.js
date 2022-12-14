import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, View, Button, FlatList, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from "@react-navigation/native";
import Home from './Home';


function StartPage(props) {
  getTokenData = async () => {
    try {
      const tokenData = await AsyncStorage.getItem('token')
      // console.log('tokenbd',token)
      return tokenData
    } catch(e) {
      console.log('error', e)
      setLoading(false)
    }
  }
  const [loading, setLoading] = useState(true)
  const isFocused = useIsFocused();
  const token = getTokenData()
  const loadData = () => {
    console.log('logout', token._z)
    fetch('http://172.20.10.3:8000/api/chats/', {
      method:"GET",
      headers: {
        'Authorization': `${token._z}`
      }
    }).then((resp) => {
      console.log('tokenLoad', token._z)
      if (resp.status == 200) {
        props.navigation.navigate("App")
        setLoading(false)
      }
      else {
        props.navigation.navigate("Signin")
        setLoading(false)
      }
    })
    .catch(error => {
      console.log("Error", error)
      AsyncStorage.removeItem('token')
      props.navigation.navigate('Signin')
      setLoading(false)
    })
  }
  const checkLoading = () => {
    getTokenData()
    setTimeout(() => {
      if (token == undefined || token == null) {
        props.navigation.navigate("Signin")
        return
      }
      else {
        loadData()
      }
    }, 1000)
  }
  useEffect(() => {
    getTokenData()
      .then(() => loadData())
  }, [isFocused])

  if (!loading) {
    return (
      // checkLoading()
      <View></View>
    )
  };
  return (
    <ActivityIndicator/>
  )
}

export default StartPage