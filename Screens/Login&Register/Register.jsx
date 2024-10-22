const { View, Text, Image, TextInput, TouchableOpacity ,ScrollView, Alert,} = require("react-native");
import { useNavigation } from "@react-navigation/native";
import styles from "./style";
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useState } from "react";
import axios from "axios";
import { RadioButton } from "react-native-paper";

function RegisterPage({props}){
    const [name, setName]=useState("");
    const [nameVerify, setNameVerify]=useState("false")
    const [email, setEmail]=useState('');
    const[emailVerify, setEmailVerify]=useState('')
    const[mobile, setMobile]=useState('')
    const[mobileVerify, setMobileVerify]=useState('');
    const[password, setPassword]=useState('');
    const[passwordVerify, setPasswordVerify]=useState('')
    const [showPassword, setShowPassword] = useState(false);
    const[userType, setUserType]=useState('')
    const[secretText, setSecretType]=useState('')
    const navigation=useNavigation()

    
    function handleSubmit(){
      const userData={
        name:name,
        email,
        mobile,
        password,
        userType
      };
       if (nameVerify && emailVerify && mobileVerify && passwordVerify) {
        if(userType=='Admin' && secretText !='2001'){
          return Alert.alert('Invalid Admin')
        }
      axios.post('http://192.168.1.13:5001/register', userData)
      .then((res) => {
        console.log(res.data); 
        if (res.data.status == "ok") {
          Alert.alert("Success", "Registered Successfully");
          navigation.navigate('Login')
        } else {
          Alert.alert("Error", res.data.message || "User already exists");
        }
      })
      .catch((e) => {
        console.log(e);
        Alert.alert("Error", "Something went wrong while registering.");
      });
  } else {
    Alert.alert('Warning', 'Fill mandatory details');
  }
}


    function handleName(e){
     const nameVar=e.nativeEvent.text;
     setName(nameVar);
     setNameVerify(false);
     if(nameVar.length >1){
        setNameVerify(true);
     }
        
    }
    function handleEmail(e){
        const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(false);
    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar)) {
      setEmail(emailVar);
      setEmailVerify(true);
    }
    }
    function handleMobile(e) {
        const mobileVar = e.nativeEvent.text;
        setMobile(mobileVar);
        setMobileVerify(false);
        if (/[1-9]{1}[0-9]{9}/.test(mobileVar)) {
          setMobile(mobileVar);
          setMobileVerify(true);
        }
      }

      function handlePassword(e) {
        const passwordVar = e.nativeEvent.text;
        setPassword(passwordVar);
        setPasswordVerify(false);
        if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
          setPassword(passwordVar);
          setPasswordVerify(true);
        }
      }
    return(
        <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
            <View>
            <View style={styles.logoContainer}>  
                <Image style={styles.logo} source={require('../../assets/logo.png')}/>
            </View>
            <View style={styles.loginContainer1}>
            <Text style={styles.text_header}>Register</Text>

          

          {userType=='Admin' ?(
             <View style={styles.action}> 
             <FontAwesome name="user" color="16423C" style={styles.smallIcon}/>
             <TextInput 
             placeholder="Secret Text" 
             style={styles.textInput}
             onChange={e=>setSecretType(e.nativeEvent.text)}
             />

           </View>
          ):(
            ''
            )}
           




            <View style={styles.action}>
            <FontAwesome name="user" color="#16423C" style={styles.smallIcon} />
            <TextInput placeholder="Name"
             style={styles.textInput} 
             onChange={e=>handleName(e)}
             />
             {name.length<1 ?null:  nameVerify ?(
                <Feather name="check-circle" color="green" size={20}/>
                ):(
                    <Feather name="x-circle" color="red" size={20} />
                )}
            </View>
            {name.length< 1 ? null : nameVerify ?null:
            <Text
            style={{
                marginLeft:20,
                color:'red'
            }}>
                Name should be more than 1 characters
            </Text>
            }

            <View style={styles.action}>
            <FontAwesome name="lock" color="#16423C" style={styles.smallIcon} />
            <TextInput placeholder="Email" 
            style={styles.textInput}
            onChange={e=>handleEmail(e)}
             />
             {email.length<1?null:emailVerify? 
             (<Feather name="check-circle" color="green" size={20}/>
             ):(
             <Feather name="x-circle" color="red" size={20}/>
             )}
            </View>
            {email.length < 1 ? null : emailVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: 'red',
              }}>
              Enter Proper Email Address
            </Text>
          )}
            <View style={styles.action}>
            <FontAwesome name="lock" color="#16423C" style={styles.smallIcon} />
            <TextInput placeholder="Mobile" 
            style={styles.textInput} 
            onChange={(e)=>handleMobile(e)}
            maxLength={10}/>
             {mobile.length < 1 ? null : mobileVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Feather name="x-circle" color="red" size={20} />
            )}
            </View>
            {mobile.length < 1 ? null : mobileVerify ? null : (
            <Text
              style={{
                marginLeft: 20,
                color: 'red',
              }}>
              Mobile number should be minimum 10 digits
            </Text>
          )}

            <View style={styles.action}>
            <FontAwesome name="lock" color="#16423C" style={styles.smallIcon} />
            <TextInput placeholder="Password"
             style={styles.textInput}
             onChange={(e)=>handlePassword(e)}
             secureTextEntry={showPassword}/>

             <TouchableOpacity  onPress={() => setShowPassword(!showPassword)}>
             {password.length < 1 ? null : !showPassword ? (
                <Feather
                  name="eye-off"
                  style={{marginRight: -10}}
                  color={passwordVerify ? 'green' : 'red'}
                  size={23}
                />
              ) : (
                <Feather
                  name="eye"
                  style={{marginRight: -10}}
                  color={passwordVerify ? 'green' : 'red'}
                  size={23}
                />
              )}

             </TouchableOpacity>
            </View>



            <View style={styles.radioButton_div}>
            <Text style={styles.radioButton_title}> Register  as</Text>
            <View style={styles.radioButton_inner_div}>
              <Text style={styles.radioButton_text}>User</Text>
              <RadioButton
                value="User"
                status={userType=='User' ? 'checked':'unchecked'}
                onPress={()=>setUserType('User')}
                />

            </View>
            <View style={styles.radioButton_inner_div}>
              <Text style={styles.radioButton_text}>Admin</Text>
              <RadioButton 
              value="Admin"
              status={userType=='Admin' ? 'checked':'unchecked'}
              onPress={()=>setUserType('Admin')}
              />            
            </View>
          </View>
              
            </View>
            <View style={styles.button}>
                <TouchableOpacity style={styles.inBut} onPress={()=>handleSubmit()}>
                <View>
                    <Text style={styles.textSign}>Register</Text>
                </View>
                </TouchableOpacity>

                </View>
        </View>
        </ScrollView>
    )
}

export default RegisterPage;