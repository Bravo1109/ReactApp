import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, View, KeyboardAvoidingView, ScrollView, ActivityIndicator, TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {TextInput, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'


function Sex(props) {
    let status = 0
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState('female')
    let sex = 'female'

    return (
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <Text style={{fontSize: 30, textAlign: 'center'}}>Sex:</Text>
            <TouchableOpacity style={{flex: 1, width: '40%'}} onPressIn={() => setLoading(true)}
             onPressOut={() => {
                setTimeout(() => {
                    setLoading(false)
                }, 1000)
                
            }}
             >
            <Picker
            selectedValue={selected}
            onValueChange={(itemValue, itemIndex) => { 
                setSelected(itemValue)  
            }}
            
            mode='dropdown'
            >
                <Picker.Item label='Male' value='male' />
                <Picker.Item label='Female' value='female' />
                <Picker.Item label='Other' value='other' />
            </Picker>
            </TouchableOpacity>
            </View>
            {loading == true ? <ActivityIndicator /> : 
            <Button style={{margin:10}}
                icon = "lock"
                mode = "contained"
                onPress={() => {
                    console.log(selected)
                    props.navigation.navigate('UserInfo', selected)
                }}
            >Next</Button>}
          </View>
      )
    }

    const styles = StyleSheet.create({
        inputStyle: {
            padding:10,
            margin:10
        }
    })

export default Sex