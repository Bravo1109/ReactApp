import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, View, Button, FlatList, Alert } from 'react-native';
import {Card, FAB} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from "@react-navigation/native";



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
      Alert.alert("Error", error)
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
    <Card style={styles.cardStyle} onPress = {() => clickedItem(item)}>
      <View style={{flexDirection:"row", alignItems: 'center',}}> 
        <Image style={{width:60, height:60, borderRadius:50}} source={{
          uri: `http://172.20.10.3:8000${item.users[0].photo}`
        }}/>
        <View style={{marginLeft: 20}}>
          <Text style = {{fontSize:25}}>{item.users[0].username}</Text>
          <Text style = {{fontSize:20, color:'#aaa'}}>{item.messages[0].text}</Text>
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
      />

      {/* <FAB
        style={styles.fab}
        small = {false}
        icon = "plus"
        theme={{colors:{accent:'blue'}}}

        onPress = {() => props.navigation.navigate("Create")}
      /> */}

     </View>
  )
}

const styles = StyleSheet.create({
    cardStyle: {
        flexDirection:"row",
        padding: 10,
        margin: 10,
    },
    // fab: {
    //   position: 'absolute',
    //   margin:16,
    //   right:0,
    //   bottom:0,
    //   backgroundColor:'blue'
    // }
})

export default Home