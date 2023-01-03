import React, {useState ,useEffect} from 'react'
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import Male from '../images/male.png'
import Female from '../images/female.png'
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
  const male = Image.resolveAssetSource(Male).uri
  const female = Image.resolveAssetSource(Female).uri
  const [loadImage, setLoadImage] = useState(true)
  const isFocused = useIsFocused();
  const token = getTokenData()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const loadData = () => {
    console.log('loading')
    fetch('http://172.20.10.3:8000/api/rating/', {
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
      <ImageBackground
        source={item.sex == 'male' ? {uri: male} : {uri: female}}
        resizeMode='contain'
        style={{width:110, height:110, borderRadius:100, overflow: 'hidden'}}
        >
          {item.photo != null ? <Image
            style={{width:'100%', height:'100%'}}
            source={{
             uri: `http://172.20.10.3:8000${item.photo}`
            }}
            onLoadEnd={() => setLoadImage(false)}
           /> : <View></View> }
        <ActivityIndicator 
        style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
        animating={loadImage}
        />

      </ImageBackground>
        <View style={{marginTop: 5}}>
          <Text style = {{fontSize:13}}>{item.name}, {item.age}</Text>
        </View>
      </View>
    </TouchableOpacity>
    )
  }
  if(loading || !data) {
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