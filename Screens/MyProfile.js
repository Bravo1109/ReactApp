import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, Image, View, ActivityIndicator, FlatList, } from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import {Card} from 'react-native-paper';
import StartPage from './StartPage';


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
  const removeTokenData = async () => {
    await AsyncStorage.removeItem('token');
  }
  
  const checkToken = () => {
    removeTokenData()
    .then(() => {
      console.log('exittoken',AsyncStorage.getItem('token'))
      props.navigation.navigate('StartScreen', {logged_out:true})
    })
    .catch(
      console.log('error')
    )
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
        <Text style={{margin: 10}}>
          <Text style={{fontSize: 30, fontWeight: '600'}}>{userData.name}</Text><Text style={{fontSize: 25, fontWeight: '400'}}>, {userData.age}</Text>
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
          <View style={{margin: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize:20}}>Appearance</Text>
            <View style={{height: 40}}>
              <View style={{height: `${profileData.appearance * 10}%`, width: 40, position: 'absolute', bottom: 0, backgroundColor: 'darkgreen'}}></View>
              <Image style={{width:40, height:40, backgroundColor: 'transparent'}} source={{
                uri: 'http://172.20.10.3:8000/static/star.png'
              }}/>
            </View>
            <Text style={{fontSize:25}}>{profileData.appearance}/10</Text>
          </View>
          <View style={{margin: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize:20}}>Comunication</Text>
            <View style={{height: 40}}>
              <View style={{height: `${profileData.comunication * 10}%`, width: 40, position: 'absolute', bottom: 0, backgroundColor: 'darkgreen'}}></View>
              <Image style={{width:40, height:40, backgroundColor: 'transparent'}} source={{
                uri: 'http://172.20.10.3:8000/static/star.png'
              }}/>
            </View>
            <Text style={{fontSize:25}}>{profileData.comunication}/10</Text>
          </View>
          <View style={{margin: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize:20}}>Activity</Text>
            <View style={{height: 40}}>
              <View style={{height: `${profileData.activity * 10}%`, width: 40, position: 'absolute', bottom: 0, backgroundColor: 'darkgreen'}}></View>
              <Image style={{width:40, height:40, backgroundColor: 'transparent'}} source={{
                uri: 'http://172.20.10.3:8000/static/star.png'
              }}/>
            </View>
            <Text style={{fontSize:25}}>{profileData.activity}/10</Text>
          </View>
        </View>
        <Text style={{fontSize:25, width: '100%', paddingLeft: 10}}>Location: {userData.city.name}, {userData.city.country}</Text>
        <Text style={{fontSize:25, width: '100%', paddingLeft: 10, marginTop: 15, fontWeight: '600'}}>About myself:</Text>
        <Text style={{fontSize:20, width: '100%', paddingLeft: 15}}>{profileData.description}</Text>
        <Button
            mode='contained'
            icon={'logout'}
            style={{
              position: 'absolute',
              bottom: 20
            }}
            onPress={() => {
              checkToken()
            }}
        >Log Out</Button>
    </View>
      )
}

export default MyProfile