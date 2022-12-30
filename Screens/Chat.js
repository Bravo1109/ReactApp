import React, {useState, useEffect, useRef} from 'react'
import { StyleSheet, Text, View,
     KeyboardAvoidingView, FlatList, Platform,
      ActivityIndicator, TouchableOpacity, Modal, Image} from 'react-native';
import {Card, IconButton, TextInput, Button,} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome';

function Chat(props) {
  const [itemId, setItemId] = useState(0)
  const [modal, setModal] = useState(false)
  const [changeS, setChangeS] = useState(0)
  const [currentPage, setCurrentPage] = useState(30);
  const token = getTokenData()
  const [text, setText] = useState("")
  const [data, setData] = useState([])
  const textInput = useRef()
  const {id, messages, users} = props.route.params.data
  let pubId = 0
  const url = `http://172.20.10.3:8000/api/chats/${id}/?limit=${currentPage}`
  const [loading, setLoading] = useState(true)
  const loadData = () => {
    console.log('loading data on', currentPage)
    fetch(url, {
      method:"GET",
      headers: {
        'Authorization': `${token._z}`
      }
    }).then(resp => resp.json())
    .then(res => {
        console.log('data:', data)
      setData(res.results)
      setLoading(false)
    })
    .catch(error => {
      console.log("Error", error)
    })
  }
  const sendMessage = () => {
    fetch(`http://172.20.10.3:8000/api/chats/${id}/messages/`, {
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `${token._z}`
        },
        body: JSON.stringify({
          text: text
        })
      }).then(() => {
        loadData()
      })
  }
  const deleteMessage = () => {
    fetch(`http://172.20.10.3:8000/api/chats/${id}/messages/${itemId}/`, {
        method:"DELETE",
        headers: {
          'Authorization': `${token._z}`
        }
      }).then(() => {
        console.log('delete')
        loadData()
      }).catch(error => {
        console.log("Error", error)
      })
  }
  getTokenData = async () => {
    try {
        tokenData = await AsyncStorage.getItem('token')
        // console.log('Get Done', tokenData)
        return tokenData
    } catch(e) {
        console.log('error', e)
    }
  }

  const renderLoader = () => {
    return (
        <View style={loadingCircleStyle(changeS)}>
            <ActivityIndicator size='large' color='#aaa' />
        </View>
    )
  }

  const LoadMoreItem = () => {
    setCurrentPage(currentPage + 30);
    setChangeS(1)
    setTimeout(() => {setChangeS(0)}, 1000)
    console.log(currentPage)
  }

  const loadingCircleStyle = (display) => {
    return {
        opacity: display,
        position: 'absolute',
        top: -50,
        width: '100%',
        alignItems:'center',
        justifyContent:'center'
    }
  }

  useEffect(() => {
    getTokenData()
      .then(() => loadData())
  }, [currentPage])

  const renderData = (item) => {
    let a  = 0
    let mesDate = pubId
    let itemStyle =  StyleSheet.create({
        myCardStyle: {
            fontSize: 20,
            padding: 15,
            textAlign: "left",
            color: "white"
        },
        userCardStyle: {
            fontSize: 20,
            padding: 15,
            color: "white"
        }
    })
    if (item.pub_date != pubId) {
      a = 1
      pubId = item.pub_date
    }
    if (item.author.id != users[0].id) {
        return(
          <View>
            {(item.id == messages.at(-1).id) && <Text style={styles.dateStyleMessages}>{item.pub_date}</Text>}
          <Card style={{justifyContent: "right", alignItems:'flex-end', backgroundColor: 'transparent'}}>
          <TouchableOpacity
            style={{margin:5, maxWidth:'80%', borderRadius:`25`, backgroundColor: "blue"}}
            onLongPress={() => {
              setModal(true)
              setItemId(item.id)
              console.log(itemId)
            }}
            delayLongPress={800}
            activeOpacity={0.7}
            >
              <Text style = {itemStyle.myCardStyle}>{item.text}</Text> 
          </TouchableOpacity>
      </Card>
      {(a == 1 && item.id != data[0].id) && <Text style={styles.dateStyleMessages}>{mesDate}</Text>}
      </View>
  )
      }
    else {
        return(
          <View>
            {(item.id == messages.at(-1).id) && <Text style={styles.dateStyleMessages}>{item.pub_date}</Text>}
          <Card style={{justifyContent: "left", alignItems:'flex-start', backgroundColor: 'transparent'}}>
              <View style={{margin:5, maxWidth:'80%', borderRadius:`25`, backgroundColor: "#222222"}}>
                  <Text style = {itemStyle.userCardStyle}>{item.text}</Text> 
              </View>
          </Card>
          {(a == 1 && item.id != data[0].id) && <Text style={styles.dateStyleMessages}>{mesDate}</Text>}
          </View>
      ) 
       }
  }

  return (
    <View style={{flex:1, zIndex:1, backgroundColor: 'white'}}>
    <TouchableOpacity
      onPress={() => props.navigation.navigate("Profile", {id:users[0]})}
      style={[styles.Shadows, {justifyContent:'center', backgroundColor: 'white', alignItems: 'center', elevation: 2, shadowColor: '#52006A'}]}
      activeOpacity={1}
    >
    <Image 
     style={{marginTop:10, width:40, height:40, borderRadius:100}}
     source={{
          uri: `http://172.20.10.3:8000${users[0].photo}`
        }}/>
    <Text style={{padding:5, textAlign: 'center', fontSize: 15, color: 'black'}}>
        {users[0].username}
    </Text>
    </TouchableOpacity>
    <KeyboardAvoidingView
     style={{flex: 1}}
     behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
     keyboardVerticalOffset={Platform.OS === 'ios' ? 75 : 0}
    >
    
    <FlatList
      data={data}
      renderItem = {({item}) => {
        return renderData(item)
      }}
      inverted = {-1}
    //   onRefresh = {() => loadData()}
    //   refreshing = {loading}
      keyExtractor = {item => `${item.id}`}
      ListFooterComponent = {renderLoader}
      onEndReached={LoadMoreItem}
      onEndReachedThreshold={0.8}
      />
      <View style={{
        flexDirection:"row",
        alignItems: 'center',
        marginBottom: 30,
        marginTop:10,
        paddingLeft:10,
        paddingRight: 10,
        width: '100%'}}>
      <TextInput
            label = "Text"
            multiline={true}
            value={text}
            mode = "outlined"
            ref={textInput}
            onChangeText = {text => setText(text)}
            style={{width: '85%', borderRadius:100, maxHeight: 120}}
        />
        <IconButton
            icon='send'
            iconColor='white'
            containerColor='blue'
            size={25}
            style={{
              borderRadius: 100,
              width:50,
              height:50
            }}
            onPress={() => {
              sendMessage()
              textInput.current.clear()
            }}
        />
        </View>
    </KeyboardAvoidingView>
    <Modal
        transparent={true}
        animationType='fade'
        visible={modal}
    >
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end'
        }}>
            
          <TouchableOpacity onPress={() => {
            setItemId(0)
            console.log(itemId)
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
            height: 100,
            width: '90%',
            marginBottom: '15%',
            justifyContent: 'flex-end',
            overflow:'hidden'
          }}>
          <Button
            mode='outlined'
            color='#000'
            onPress={() => {
                deleteMessage()
                setModal(false)
            }}
            style={{
                height: 50,
                width: '100%',
                backgroundColor: 'transparent',
                color: '#000',
                borderRadius: 0,
                fontSize: 10,
                justifyContent: 'center',
                borderColor: '#000',
                borderWidth: 0,
                borderTopWidth: 1
            }}
          >Delete Message</Button>
          </View>
        </View>
    </Modal>
    </View>
  )
}
const styles = StyleSheet.create({
  loadingCircle: {
    display: 'none'
  },
  Shadows: {
    shadowColor: '#aaa',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    elevation: 3
  },
  dateStyleMessages: {
    textAlign: 'center',
    fontSize: 15,
    margin: 20,
    color: '#0aa'
  }
});
export default Chat