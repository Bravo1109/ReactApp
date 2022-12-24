import React, {useState ,useEffect} from 'react'
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import { Card } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

function LikesList(props) {
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
        fetch('http://172.20.10.3:8000/api/likes/', {
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
        <View style={{width: '50%'}}>
        <TouchableOpacity style={styles.cardStyle} activeOpacity = {1} onPress = {() => clickedItem(item.sender)}>
          <View style={{flexDirection:"column", alignItems: 'center', width: '100%'}}> 
            <Image style={{width:'100%', aspectRatio:1/1, borderRadius:15, backgroundColor: 'black',
            borderColor: 'blue', borderWidth: 1}} source={{
              uri: `http://172.20.10.3:8000${item.sender.photo}`
            }}/>
            <View style={{marginTop: 5}}>
              <Text style = {{fontSize:15}}>{item.sender.name}, {item.sender.age}</Text>
            </View>
          </View>
        </TouchableOpacity>
        </View>
        )
      }
      if(loading) {
        return <ActivityIndicator/>
      };
      return (
        <View style = {{flex: 1, backgroundColor: '#fff'}}>
          <FlatList
          data={data}
          numColumns={2}
          contentContainerStyle={{justifyContent: 'flex-start'}}
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
        padding: 10,
        width: '100%'
    },
})

export default LikesList