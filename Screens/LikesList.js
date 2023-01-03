import React, {useState ,useEffect} from 'react'
import { Text, View, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native'
import { useIsFocused } from "@react-navigation/native";
import Male from '../images/male.png'
import Female from '../images/female.png'
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
      const male = Image.resolveAssetSource(Male).uri
      const female = Image.resolveAssetSource(Female).uri
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
            <ImageBackground
              source={item.sender.sex == 'male' ? {uri: male} : {uri: female}}
              resizeMode='contain'
              style={{width:'100%', aspectRatio:1/1, overflow: 'hidden', borderColor: 'blue', borderRadius:15,
              borderWidth: 1
              }}
            >
              {item.sender.photo != null ? <Image
                style={{width:'100%', height:'100%'}}
                source={{
                  uri: `http://172.20.10.3:8000${item.sender.photo}`
                }}
                // onLoadEnd={() => setLoadImage(false)}
              /> : <View></View> }
              <ActivityIndicator 
                style={{position: 'absolute', left:0, top:0, right:0, bottom:0}}
                animating={false}
              />
            </ImageBackground>
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