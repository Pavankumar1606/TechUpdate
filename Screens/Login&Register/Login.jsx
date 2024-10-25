const { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } = require("react-native");
import { useNavigation } from "@react-navigation/native"; 
import styles from "./style";
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


function LoginPage({props}){
  const navigation=useNavigation();
    const [email, setEmail]=useState();
    const [password, setPassword]=useState();

    // Inside your login function after a successful login
    const handleSubmit = async () => {
      try {
        const userData = { email, password };
        const response = await axios.post('http://192.168.1.13:5001/login-user', userData);
    
        if (response.data.status === 'ok') {
          const token = response.data.data;
          const id = response.data.userId;
    
          if (token === undefined || id === undefined) {
            console.error('Token or userId is undefined');
            Alert.alert('Login failed', 'Token or userId not received from server');
            return;
          }
    
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userId', id);
          Alert.alert('Logged in successfully');
          console.log(token)
          console.log(id)
          if (response.data.userType === 'Admin') {
            navigation.navigate('AdminScreens');
          } else {
            navigation.navigate('HomeStack', { screen: 'HomeTab' });
          }
        } else {
          Alert.alert('Login failed', response.data.message || 'Please check your credentials');
        }
      } catch (error) {
        console.error('Login error:', error);
        Alert.alert('Error', 'An error occurred during login');
      }

      setEmail('')
      setPassword('')
    };
    
      
    return(
     <ScrollView  contentContainerStyle={{flexGrow:1}} keyboardShouldPersistTaps={"always"}>
           <View>
            <View style={styles.logoContainer} c>  
                <Image style={styles.logo} source={require('../../assets/logoo3.png')}/>
            </View>
            <View style={styles.loginContainer}>
            <Text style={styles.text_header}>Login</Text>

            <View style={styles.action}>
            <FontAwesome name="user" color="#16423C" style={styles.smallIcon} />
            <TextInput 
            placeholder="Mobile or Email" 
            style={styles.textInput} 
            onChange={e => setEmail(e.nativeEvent.text)}
            value={email}
            />
            </View>

            <View style={styles.action}>
            <FontAwesome name="lock" color="#16423C" style={styles.smallIcon} />
            <TextInput 
            placeholder="Password"
             style={styles.textInput} 
             onChange={e => setPassword(e.nativeEvent.text)} 
             value={password}/>
            </View>

            <View
                style={{
                justifyContent: 'flex-end',
                lignItems: 'flex-end',
                marginTop: 8,
                marginRight: 10,
                }}>

                
              <View >
                <TouchableOpacity 
                  onPress={() => navigation.navigate('ForgotPassword')} // Add this line
                  style={{ 
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    marginTop: 8,
                    marginRight: 10,
                  }}>
                  <Text style={{color: '#16423C', fontWeight: '700'}}>
                    Forgot Password
                  </Text>
                </TouchableOpacity>
              </View>


           

            
            </View>
            </View>
            <View style={styles.button}>
                <TouchableOpacity style={styles.btn} onPress={()=>handleSubmit()}>
                <View>
                    <Text style={styles.textSign}>Log in</Text>
                </View>
                </TouchableOpacity>
                <View style={{padding: 15}}>
                <Text style={{fontSize: 14, fontWeight: 'bold', color: '#919191'}}>
                    ----Or Continue as----
                </Text>                
             </View>

           
            <TouchableOpacity 
              style={styles.btn}
              onPress={() => {
                navigation.navigate('Register');
              }}>
              <View>
                    <Text style={styles.textSign}>Sign Up</Text>
                </View>
                </TouchableOpacity>
          

                </View>
        </View>
     </ScrollView>
    )
}

export default LoginPage;