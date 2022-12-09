import React, {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native';
import {TextInput, Button} from 'react-native-paper';

function Create() {
  const [text, setText] = useState("")

  return (
    <View>
        <TextInput style = {styles.inputStyle}
            label = "Text"
            value={text}
            mode = "outlined"

            onChangeText = {text => setText(text)}
        />

        <Button style={{margin:10}}
            icon = "pencil"
            mode = "contained"
            onPress={() => console.log("Button pressed")}
        >Insert article</Button>
    </View>
  )
}

const styles = StyleSheet.create({
    inputStyle: {
        padding:10,
        margin:10
    }
})

export default Create