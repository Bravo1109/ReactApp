import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

function Create() {
  const [text, setText] = useState("")

  return (
    <View style={styles.container}>
        
    </View>
  )
}

const styles = {
    container: {
        width: '70%',
        height: 40,
        padding: 3,
        borderColor: '#aaa',
        borderWidth: 3,
        borderRadius: 20,
        justifyContent: 'center'
    },
    inner: {
        width: '70%',
        height: 30,
        borderRadius: 15,
        backgroundColor: 'green'
    }
}

export default Create