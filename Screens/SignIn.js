import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, View, FlatList, Alert } from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'


function SignIn(props) {
    let status = 0
    const [data, setData] = useState([])
    let token = ""
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const clickedItem = () => {
        props.navigation.navigate("App")
      }
    const loadData = () => {
        fetch('http://172.20.10.3:8000/api/auth/token/login/', {
          method:"POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        }).then((resp) => {
            status = resp.status
            return resp.json()
        })
        .then(data => {
          console.log(status)
          setData(data)
          token = `Token ${data.auth_token}`
          console.log(data)
          if (status == 200) {
            writeTokenData(token)
            getTokenData()
            clickedItem()
          }
        })
        .catch(error => {
          console.log("Error", error)
        })
      }
      writeTokenData = async (value) => {
        try {
            await AsyncStorage.setItem('token', value)
        } catch(e) {
            console.log('error', e)
        }
        console.log('Done', value)
      }
      getTokenData = async () => {
        try {
            tokenData = await AsyncStorage.getItem('token')
            console.log('Get Done', tokenData)
            return tokenData
        } catch(e) {
            console.log('error', e)
        }
        
      }

    return (
        <View>
            <Text>{token}</Text>
            <TextInput style = {styles.inputStyle}
                label = "Email"
                value={email}
                mode = "outlined"
                onChangeText = {email => setEmail(email)}
            />
            <TextInput style = {styles.inputStyle}
                secureTextEntry={true}
                label = "Password"
                value={password}
                mode = "outlined"
                onChangeText = {password => setPassword(password)}
            />
    
            <Button style={{margin:10}}
                icon = "lock"
                mode = "contained"
                onPress={() => {
                    loadData();
                }}
            >Sign in</Button>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{marginLeft: 10}}>Don't have an account?</Text>
            <Button style={{margin:0}}
                mode = 'text'
                onPress={() => {
                  props.navigation.navigate("Signup")
                }}
            >Sign up</Button>
            </View>
        </View>
      )
    }
    
    const styles = StyleSheet.create({
        inputStyle: {
            padding:10,
            margin:10
        }
    })

export default SignIn