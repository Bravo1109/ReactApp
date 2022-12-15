import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Image, View, ActivityIndicator, FlatList, } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Card} from 'react-native-paper';


function MyProfile(props) {
  const [profileData, setProfileData] = useState([])
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(true);
  const token = getTokenData()
  const loadProfileData = () => {
    console.log('userData: ', userData)
    fetch(`http://172.20.10.3:8000/api/users/${userData.id}/profile/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._z}`
      }
    }).then(resp => resp.json())
    .then(res => {
      setProfileData(res)
      setLoading(false)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }
  const loadUserData = () => {
    setLoading(true)
    fetch(`http://172.20.10.3:8000/api/users/me/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._z}`
      }
    }).then((resp) => {
        return resp.json()
    })
    .then(res => {
      setUserData(res)
      setLoading(false)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }
  getTokenData = async () => {
    try {
        tokenData = await AsyncStorage.getItem('token')
        return tokenData
    } catch(e) {
        console.log('error', e)
    }
  }
  
  useEffect(() => {
    getTokenData()
      .then(() => loadUserData())
  }, [])

  useEffect(() => {
    if(userData) {
        return loadProfileData()
    }
  }, [userData])

  const renderData = (item) => {
    console.log('Here')
    return(
        <Card>
        <Text>City: {item.name}</Text>
        </Card>
    )
  }
  if(!userData) {
    return <ActivityIndicator/>
  };
  console.log("profData: ", profileData)
  return (
    <View style={{flex:1, alignItems: 'center', backgroundColor: '#fff'}}>
        <Image style={{width:'100%', height:'40%', backgroundColor: '#aaa'}} source={{
            uri: `http://172.20.10.3:8000${profileData.profile_photo}`
        }}/>
        <Text style={{fontSize:25}}>Name: {userData.name}</Text>
        <Text style={{fontSize:25}}>Age: {userData.age}</Text>
        <Text style={{fontSize:25}}>Location: {userData.city.name}, {userData.city.country}</Text>
        <Text style={{fontSize:25}}>About myself: {profileData.description}</Text>
        <Button
            mode='contained'
            onPress={() => {
                AsyncStorage.removeItem('token')
                props.navigation.navigate('StartScreen')
              }}
        >Log Out</Button>
    </View>
      )
}

export default MyProfile