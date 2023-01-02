import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, Image, View, KeyboardAvoidingView, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {TextInput, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'


function SignUp(props) {
    let status = 0
    const [selected, setSelected] = useState('female')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [city, setCity] = useState('')
    const [birthDate, setBirthDate] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const registration = () => {
        fetch('http://172.20.10.3:8000/api/users/', {
          method:"POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email,
            password: password,
            city: city,
            name: name,
            birth_date: birthDate,
            city: city,
            username: username
          })
        }).then((resp) => {
            status = resp.status
            return resp.json()
        })
        .then(data => {
          console.log(status)
          if (status == 201) {
            props.navigation.navigate("Signin")
          }
        })
        .catch(error => {
          console.log("Error", error)
        })
      }

    return (
        
        <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <ScrollView style={{flex: 1}}>
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 30, textAlign: 'center'}}>Sex</Text>
            <Picker
            selectedValue={selected}
            onValueChange={(itemValue, itemIndex) => {
                setSelected(itemValue)
            }}
            style={{width: '40%'}}
            >
                <Picker.Item label='Male' value='male' />
                <Picker.Item label='Female' value='female' />
                <Picker.Item label='Other' value='other' />
            </Picker>
            </View>
            
            <TextInput style = {styles.inputStyle}
                label = "Email"
                value={email}
                mode = "outlined"
                onChangeText = {email => setEmail(email)}
            />
            <TextInput style = {styles.inputStyle}
                label = "Username"
                value={username}
                mode = "outlined"
                onChangeText = {username => setUsername(username)}
            />
            <TextInput style = {styles.inputStyle}
                label = "Name"
                value={name}
                mode = "outlined"
                onChangeText = {name => setName(name)}
            />
            <TextInput style = {styles.inputStyle}
                label = "City"
                value={city}
                mode = "outlined"
                onChangeText = {city => setCity(city)}
            />
            <TextInput style = {styles.inputStyle}
                label = "Birth date"
                value={birthDate}
                mode = "outlined"
                onChangeText = {birthDate => setBirthDate(birthDate)}
            />
            <TextInput style = {styles.inputStyle}
                secureTextEntry={true}
                label = "Password"
                value={password}
                mode = "outlined"
                onChangeText = {password => setPassword(password)}
            />
            <TextInput style = {styles.inputStyle}
                secureTextEntry={true}
                label = "Confirm password"
                value={confirmPassword}
                mode = "outlined"
                onChangeText = {confirmPassword => setConfirmPassword(confirmPassword)}
            />
            <Button style={{margin:10}}
                icon = "lock"
                mode = "contained"
                onPress={() => {
                    registration()
                }}
            >Log in</Button>
          </ScrollView>
        </KeyboardAvoidingView>
      )
    }
    
    const styles = StyleSheet.create({
        inputStyle: {
            padding:10,
            margin:10
        }
    })

export default SignUp