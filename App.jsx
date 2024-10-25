import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./Screens/Login&Register/Login";
import { NavigationContainer } from "@react-navigation/native";
import RegisterPage from "./Screens/Login&Register/Register";
import HomeScreen from "./Screens/users/Home";
import AdminScreens from './Screens/AdminScreens';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchScreen from "./Screens/users/SearchScreen";
import NotificatoinScree from "./Screens/users/NotificatoinScree";
import ProfileScreen from "./Screens/users/ProfileScreen";
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native"; 

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TechNews from "./Screens/users/TechNews";
import ForgetPassword from "./Screens/Login&Register/ForgetPassword";
import Toast from "react-native-toast-message";

import { NotificationProvider } from "./Screens/NotificationContext";
import ChatScreen from "./Screens/users/ChatScreen";
import RequestManagementScreen from "./Screens/RequestManagement";
import Bot from "./Screens/Bot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react"


const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator screenOptions={{
      headerShown:false
   }}>
      
      <Tab.Screen name="HomeTab" component={HomeScreen} 
      options={{
         tabBarIcon:({focused})=>(
            <View>
              <FontAwesome name="home" color="#16423C" size={32} />
            </View>
         )
      }}/>
     
    

      <Tab.Screen name="commu" component={SearchScreen} options={{
         tabBarIcon:({focused})=>(
            <View>
              <FontAwesome name="wechat" color="#16423C" size={27}/>
            </View>
         )
      }}/>


        <Tab.Screen name="Technologies" component={TechNews} options={{
         tabBarIcon:({focused})=>(
            <View>
              <FontAwesome name="code" color="#16423C" size={30}/>
            </View>
         )
      }}/>
        <Tab.Screen name="notification" component={NotificatoinScree} options={{
         tabBarIcon:({focused})=>(
            <View>
              <FontAwesome name="bell" color="#16423C" size={25} />
            </View>
         )
      }}/>
       <Tab.Screen name="profile" component={ProfileScreen} options={{
         tabBarIcon:({focused})=>(
            <View>
              <FontAwesome name="user" color="#16423C" size={30}/>
            </View>
         )
      }}/>
      

    </Tab.Navigator>
  );
}


 function App(){
  const Stack=createNativeStackNavigator()

  




  return(
   <>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationProvider>
    <NavigationContainer>
     
     <Stack.Navigator screenOptions={{
        headerShown:false
     }}>
      <Stack.Screen name="Login" component={LoginPage}/>
      <Stack.Screen name="Register" component={RegisterPage}/>
      <Stack.Screen name="HomeStack" component={MyTabs}/>
      <Stack.Screen name="ForgotPassword" component={ForgetPassword} />
      <Stack.Screen name="AdminScreens" component={AdminScreens}/>
      <Stack.Screen name="RequestManagement" component={RequestManagementScreen} />
      <Stack.Screen name="Chat" component={ChatScreen}/>

     </Stack.Navigator>
     <Toast/>
    </NavigationContainer>
    <Toast />
    {/* <Bot/> */}
    </NotificationProvider>
   
    </GestureHandlerRootView> 
   
   </>
  )
 }

 export default App;