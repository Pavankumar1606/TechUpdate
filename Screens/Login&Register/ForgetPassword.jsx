import { StyleSheet, Text, View , TextInput,TouchableOpacity, Alert} from 'react-native'
import React, { useState } from 'react'
import axios from 'axios'
import { PassThrough } from 'stream'

export default function ForgetPassword({navigation}) {
    
    const [email, setEmail] = useState('') // For storing the email
    const [isEmailVerified, setIsEmailVerified] = useState(false) // For verifying the email
    const [newPassword, setNewPassword] = useState('') // For storing the new password
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleEmailVerification= async()=>{
        try{
            const response=await axios.post('http://192.168.1.13:5001/password/verifyEmail', {email});
            if(response.data.success){
                setIsEmailVerified(true);
            }else{
                Alert.alert('Error', response.data.message||'Invalid email')
            }
        }catch(error){
            Alert.alert('Error', 'Something went wrong')
        }
    }

    const handleSavePassword=async()=>{
        if(newPassword!=confirmPassword){
            Alert.alert('Error', 'Password do not match')
            return;
        }

        try{
            const response=await axios.post('http://192.168.1.13:5001/password/savePassword', {email, newPassword});
            if(response.data.success){
                Alert.alert('Success', 'Password has been reset');
                navigation.navigate('Login');
            }else{
                Alert.alert('Error', response.data.message||'could not reset password');
            }
        }catch(error){
            Alert.alert('Error', 'Something went wrong')
        }
    }



  return (
    <View style={styles.container}>
      <Text style={styles.text_header}>Forgot Password</Text>

      {!isEmailVerified ? (
        
        <>
          <View style={styles.action}>
            <TextInput
              placeholder="Enter your email"
              style={styles.textInput}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <TouchableOpacity style={styles.inBut} onPress={handleEmailVerification}>
            <Text style={styles.textSign}>Verify Email</Text>
          </TouchableOpacity>
        </>
      ) : (
        
        <>
          <View style={styles.action}>
            <TextInput
              placeholder="Enter new password"
              secureTextEntry
              style={styles.textInput}
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
            />
          </View>
          <View style={styles.action}>
            <TextInput
              placeholder="Confirm new password"
              secureTextEntry
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </View>
          <TouchableOpacity style={styles.inBut} onPress={handleSavePassword}>
            <Text style={styles.textSign}>Save Password</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    text_header: {
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    action: {
      flexDirection: 'row',
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#dcdcdc',
      paddingBottom: 5,
    },
    textInput: {
      flex: 1,
      paddingLeft: 10,
      color: '#05375a',
      fontSize: 18,
    },
    inBut: {
      backgroundColor: '#16423C',
      padding: 15,
      alignItems: 'center',
      borderRadius: 5,
    },
    textSign: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });