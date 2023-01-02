import React, { useState, useEffect} from 'react'
import { StyleSheet, Text, Image,
  View, ActivityIndicator, FlatList, 
  Modal, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Button, TextInput, IconButton } from 'react-native-paper';
import {Card} from 'react-native-paper';


function Profile(props) {
  const [profileData, setProfileData] = useState([])
  const as = 50
  const [text, setText] = useState("")
  const [modal, setModal] = useState(false)
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
  const sendMessage = () => {
    fetch(`http://172.20.10.3:8000/api/users/${id}/chats/create/`, {
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token._z}`
        },
        body: JSON.stringify({
          text: text
        })
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
              <View style={{height: `100%`, width: 40, position: 'absolute', bottom: 0, backgroundColor: '#aaa'}}></View>
              <View style={{height: `${profileData.appearance * 10}%`, width: 40, position: 'absolute', bottom: 0, backgroundColor: 'yellow'}}></View>
              <Image style={{width:40, height:40, backgroundColor: 'transparent'}} source={{
                uri: 'http://172.20.10.3:8000/static/star.png'
              }}/>
            </View>
            <Text style={{fontSize:25}}>{profileData.appearance}/10</Text>
          </View>
          <View style={{margin: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize:20}}>Comunication</Text>
            <View style={{height: 40}}>
              <View style={{height: `100%`, width: 40, position: 'absolute', bottom: 0, backgroundColor: '#aaa'}}></View>
              <View style={{height: `${profileData.comunication * 10}%`, width: 40, position: 'absolute', bottom: 0, backgroundColor: 'yellow'}}></View>
              <Image style={{width:40, height:40, backgroundColor: 'transparent'}} source={{
                uri: 'http://172.20.10.3:8000/static/star.png'
              }}/>
            </View>
            <Text style={{fontSize:25}}>{profileData.comunication}/10</Text>
          </View>
          <View style={{margin: 5, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize:20}}>Activity</Text>
            <View style={{height: 40}}>
              <View style={{height: `100%`, width: 40, position: 'absolute', bottom: 0, backgroundColor: '#aaa'}}></View>
              <View style={{height: `${profileData.activity * 10}%`, width: 40, position: 'absolute', bottom: 0, backgroundColor: 'yellow'}}></View>
              <Image style={{width:40, height:40, backgroundColor: 'transparent'}} source={{
                uri: 'http://172.20.10.3:8000/static/star.png'
              }}/>
            </View>
            <Text style={{fontSize:25}}>{profileData.activity}/10</Text>
          </View>
        </View>
        <Text style={{fontSize:25, width: '100%', paddingLeft: 10, fontWeight: '600'}}>Rating: {userData.rating}</Text>
        <Text style={{fontSize:25, width: '100%', paddingLeft: 10, fontWeight: '600'}}>Sex: {userData.sex}</Text>
        <Text style={{fontSize:25, width: '100%', paddingLeft: 10}}>Location: {userData.city.name}, {userData.city.country}</Text>
        <Text style={{fontSize:25, width: '100%', paddingLeft: 10, marginTop: 15, fontWeight: '600'}}>About myself:</Text>
        <Text style={{fontSize:20, width: '100%', paddingLeft: 15}}>{profileData.description}</Text>
        <IconButton
            icon='message'
            iconColor='white'
            containerColor='blue'
            mode='contained'
            size={30}
            style={{
              position: 'absolute',
              bottom: 10,
              borderRadius: 100,
              width:70,
              height:70
            }} onPress={() => setModal(true)}/>

        <Modal
        transparent={true}
        animationType='fade'
        visible={modal}
    >
        <KeyboardAvoidingView style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end'
        }}
        behavior={Platform.OS === 'ios' ? 'height' : 'padding'}>
            
          <TouchableOpacity onPress={() => {
            setModal(false)
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: 'black',
            opacity: 0.5,
            position:'absolute',
            left: 0,
            zIndex: 0
          }}
          activeOpacity={0.5}
          >
          </TouchableOpacity>
          <View style={{
            backgroundColor: 'white',
            borderRadius: 15,
            width: '90%',
            marginBottom: '15%',
            overflow:'hidden'
          }} onPress={() => setModal(false)}>
          <TextInput
            label = "Text"
            value={text}
            multiline={true}
            mode = 'flat'
            onChangeText = {text => setText(text)}
            style={{width: '100%', fontSize: 20, maxHeight: 120, backgroundColor: '#fff'}}
          />
          <Button
            mode='contained'
            color='#000'
            onPress={() => {
                sendMessage()
                setText('')
                setModal(false)
            }}
            style={{
                height: 50,
                width: '100%',
                backgroundColor: 'black',
                borderRadius: 0,
                justifyContent: 'center'
            }}
          >Send Message</Button>
          </View>
        </KeyboardAvoidingView>
    </Modal>
    </View>
    
      )
}

export default Profile