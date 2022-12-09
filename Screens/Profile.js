import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Image, View, ActivityIndicator, Button, FlatList, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Card} from 'react-native-paper';


function Profile(props) {
  const [profileData, setProfileData] = useState([])
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(true);
  const token = getTokenData()
  const {id} = props.route.params.id
  const loadProfileData = () => {
    fetch(`http://172.20.10.3:8000/api/users/${id}/profile/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._z}`
      }
    }).then(resp => resp.json())
    .then(res => {
      setProfileData(res)
      // setLoading(false)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }
  const loadUserData = () => {
    setLoading(true)
    fetch(`http://172.20.10.3:8000/api/users/${id}/`, {
      method:"GET",
      headers: {
        'Authorization': `${token._z}`
      }
    }).then(resp => resp.json())
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
      .then(() => loadProfileData())
  }, [])

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
  console.log("userData: ", userData)
  return (
    <View style={{flex:1, alignItems: 'center'}}>
        <Image style={{width:'100%', height:'40%', borderRadius:5}} source={{
            uri: `http://172.20.10.3:8000${profileData.profile_photo}`
        }}/>
        <Text style={{fontSize:25}}>Name: {userData.name}</Text>
        <Text style={{fontSize:25}}>Age: {userData.age}</Text>
        <Text style={{fontSize:25}}>City: {userData.city.name}, {userData.city.country}</Text>
        <Text style={{fontSize:25}}>About myself: {profileData.description}</Text>
    </View>
      )
}

export default Profile