import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, View, Button, FlatList, ImageBackground, ActivityIndicator } from 'react-native';
import {Card, FAB} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from "@react-navigation/native";
import Male from '../images/male.png'
import Female from '../images/female.png'

function Home(props) {
  getTokenData = async () => {
    try {
        tokenData = await AsyncStorage.getItem('token')
        console.log('Get Done', tokenData)
        return tokenData
    } catch(e) {
        console.log('error', e)
    }
  }
  const male = Image.resolveAssetSource(Male).uri
  const female = Image.resolveAssetSource(Female).uri
  const isFocused = useIsFocused();
  const token = getTokenData()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadData = () => {
    console.log('TTT',token)
    fetch('http://172.20.10.3:8000/api/chats/', {
      method:"GET",
      headers: {
        'Authorization': `${token._z}`
      }
    }).then(resp => resp.json())
    .then(data => {
      setData(data.results)
      setLoading(false)
    })
    .catch(error => {
      console.log("Error", error)
      AsyncStorage.removeItem('token')
      props.navigation.navigate('StartScreen')
    })
  }
  useEffect(() => {
    getTokenData()
      .then(() => loadData())
  }, [isFocused])

 

  const clickedItem = (data) => {
    props.navigation.navigate("Chat", {data:data})
  }
  const renderData = (item) => {
    return(
    <Card style={styles.cardStyle} onPress = {() => clickedItem(item)} mode='contained'>
      <View style={{flexDirection:"row", alignItems: 'center',}}> 
        <ImageBackground
          source={item.users[0].sex == 'male' ? {uri: male} : {uri: female}}
          resizeMode='contain'
          style={{width:60, height:60, overflow: 'hidden', borderRadius:50}}
        >
          {item.users[0].photo != null ? <Image
            style={{width:'100%', height:'100%'}}
            source={{
              uri: `http://172.20.10.3:8000${item.users[0].photo}`
            }}
                // onLoadEnd={() => setLoadImage(false)}
          /> : <View></View> }
          <ActivityIndicator 
            style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
            animating={false}
          />
        </ImageBackground>
        <View style={{marginLeft: 20}}>
          <Text style = {{fontSize:25}}>{item.users[0].username}</Text>
          <Text numberOfLines={1} style = {{fontSize:20, color:'#aaa', width:'100%'}}>
            {item.messages[0].text.length < 10
              ? `${item.messages[0].text}`
              : `${item.messages[0].text.substring(0, 15)}...`}
            </Text>
        </View>
      </View>
    </Card>
    )
  }
  return (    
    <View style = {{flex:1}}>
      <FlatList
      data={data}
      renderItem = {({item}) => {
        return renderData(item)
      }}
      onRefresh = {() => loadData()}
      refreshing = {loading}
      keyExtractor = {item => `${item.id}`}
      style={{backgroundColor:'#ffffff'}}
      />

     </View>
  )
}

const styles = StyleSheet.create({
    cardStyle: {
        flexDirection:"row",
        padding: 15,
        backgroundColor: '#ffffff'
    },
})

export default Home