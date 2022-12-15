import React, {useState ,useEffect} from 'react'
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import { Card } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

function RatingList(props) {
  getTokenData = async () => {
    try {
        tokenData = await AsyncStorage.getItem('token')
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
    console.log('loading')
    fetch('http://172.20.10.3:8000/api/users/', {
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
    })
  }
  useEffect(() => {
    getTokenData()
      .then(() => loadData())
  }, [isFocused])

  const clickedItem = (id) => {
    props.navigation.navigate("Profile", {id: id})
  }

  const renderData = (item) => {
    return(
    <TouchableOpacity style={styles.cardStyle} activeOpacity = {1} onPress = {() => clickedItem(item)}>
      <View style={{flexDirection:"column", alignItems: 'center',}}> 
        <Image style={{width:110, height:110, borderRadius:100, backgroundColor: 'black'}} source={{
          uri: `http://172.20.10.3:8000${item.photo}`
        }}/>
        <View style={{marginTop: 5}}>
          <Text style = {{fontSize:15}}>{item.name}, {item.age}</Text>
        </View>
      </View>
    </TouchableOpacity>
    )
  }
  if(loading) {
    return <ActivityIndicator/>
  };
  return (
    <View style = {{flex:1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
      <FlatList
      data={data}
      numColumns={3}
      contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
      renderItem = {({item}) => {
        return renderData(item)
      }}
      onRefresh = {() => loadData()}
      refreshing = {loading}
      keyExtractor = {item => `${item.id}`}
      />

     </View>
  )
}

const styles = StyleSheet.create({
    cardStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
})

export default RatingList