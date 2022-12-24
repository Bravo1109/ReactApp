import React, {useState ,useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Animated, PanResponder, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width

export default class Swipes extends React.Component {
    getTokenData = async () => {
        try {
            tokenData = await AsyncStorage.getItem('token')
            return tokenData
        } catch(e) {
            console.log('error', e)
        }
    }
    loadData = () => {
        console.log('loading')
        fetch('http://172.20.10.3:8000/api/swipes/', {
          method:"GET",
          headers: {
            'Authorization': `${this.token._z}`
          }
        }).then(resp => resp.json())
        .then(data => {
          this.setState({data: [data.results]})
          this.setState({loading: false})
        })
        .catch(error => {
          console.log("Error", error)
        })
    }
    sendLike = async (id) => {
        console.log('like')
        await fetch(`http://172.20.10.3:8000/api/users/${id}/like/create/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `${this.token._z}`
            }
        })
      }
  constructor() {
    super()
    
    this.token = this.getTokenData()
    this.data = []
    this.loading = true

    this.position = new Animated.ValueXY()
    this.state = {
      currentIndex: 0
    }

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      transform: [{
        rotate: this.rotate
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    })
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    })

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.5, 1],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    })

  }
  
  componentDidMount() {
    getTokenData()
    .then(() => this.loadData())
  }
  componentDidUpdate() {
    // this.loadData()
    // console.log(this.state.loading)
    
  }
  
  UNSAFE_componentWillMount() {
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {

        this.position.setValue({ x: gestureState.dx, y: gestureState.dy })
      },
      onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx > 120) {
          Animated.timing(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy },
            useNativeDriver: false
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
              this.sendLike(this.state.data[0][this.state.currentIndex - 1].id)
            //   console.log(this.state.data[0][this.state.currentIndex - 1].id)
            })
          })
        }
        else if (gestureState.dx < -120) {
          Animated.timing(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
            useNativeDriver: false
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        }
        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4,
            useNativeDriver: false
          }).start()
        }
      }
    })
  }

  renderUsers = () => {
    console.log(this.token)
    const data = this.state.data
    console.log(data[0])
    return data[0].map((item, i) => {
      if (i < this.state.currentIndex) {
        return null
      }
      else if (i == this.state.currentIndex) {
        console.log(i)
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} style={[this.rotateAndTranslate, { height: '100%', width: SCREEN_WIDTH, padding: 10, position: 'absolute' }]}>
            <Animated.View style={{ opacity: this.likeOpacity, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>

            </Animated.View>

            <Animated.View style={{ opacity: this.dislikeOpacity, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

            </Animated.View>
            <View style={{flex: 1, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', borderColor:'blue', borderWidth: 2}}>
            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover' }}
              source={{uri: `http://172.20.10.3:8000${item.photo}`}} />
            <Text style={{fontSize: 40, textAlign: 'center', height: '20%'}}>{item.name}, {item.age}</Text>
            </View>

          </Animated.View>
        )
      }
      else {
        return (
          <Animated.View

            key={item.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
              height: '100%', width: SCREEN_WIDTH, padding: 10, position: 'absolute'
            }]}>
            <Animated.View style={{ opacity: 0, transform: [{ rotate: '-30deg' }], position: 'absolute', top: 50, left: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>LIKE</Text>

            </Animated.View>

            <Animated.View style={{ opacity: 0, transform: [{ rotate: '30deg' }], position: 'absolute', top: 50, right: 40, zIndex: 1000 }}>
              <Text style={{ borderWidth: 1, borderColor: 'red', color: 'red', fontSize: 32, fontWeight: '800', padding: 10 }}>NOPE</Text>

            </Animated.View>
            <View style={{flex: 1, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden', borderColor:'blue', borderWidth: 2}}>
            <Image
              style={{ flex: 1, height: null, width: null, resizeMode: 'cover' }}
              source={{uri: `http://172.20.10.3:8000${item.photo}`}} />
            <Text style={{fontSize: 40, textAlign: 'center', height: '20%'}}>{item.name}, {item.age}</Text>
            </View>

          </Animated.View>
        )
      }
    }).reverse()
  }

  render() {
    if (this.state.loading == true || this.state.data == undefined) {
        return(
            <ActivityIndicator/>
        )
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{position:'absolute', width: '100%', height: '100%', justifyContent:'center'}}>
        <Text style={{fontSize: 40, textAlign: 'center'}}>That's All</Text>
        </View>
        <View style={{ flex: 1 }}>
          {this.renderUsers()}
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
