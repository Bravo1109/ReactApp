import React, { Component } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native';

export class ClassA extends Component {

  state = {
    name: "Brivo"
  }

  render() {
    return (
      <View>
        <Text>Hello from ClassA! email: {this.props.email}</Text>
        <Text>{this.state.name}</Text>
        <Button title = "Click me" onPress={() => this.setState({name:"Bravo"})}/>
      </View>
    )
  }
}

export default ClassA