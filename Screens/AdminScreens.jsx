import React from 'react';
import { createDrawerNavigator , DrawerItem} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AdminUsers from './AdminUsers';
import AdminTechnologies from './AdminTechnology'; // Ensure you have this component
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {  StyleSheet,View } from 'react-native';
import { Button } from 'react-native-paper';
import AdminNotifications from './AdminNotifications';

const Drawer = createDrawerNavigator();




function AdminScreens({navigation}) {

  function signOut() {
    navigation.navigate("Login");
  }
  
  return (
    
    <SafeAreaProvider>
      
      <Drawer.Navigator
       >
        <Drawer.Screen name="AdminUsers" component={AdminUsers}  options={{
         statusBarColor: '#16423C',
         headerShown: true,
         headerBackVisible:false,
         headerStyle: {
           backgroundColor: '#16423C',
         },
         headerTintColor: '#fff',
         headerTitleAlign: 'center',
       }}/>
        <Drawer.Screen name="AdminTechnologies" component={AdminTechnologies} 
         options={{
          statusBarColor: '#16423C',
          headerShown: true,
          headerBackVisible:false,
          headerStyle: {
            backgroundColor: '#16423C',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}/>
        <Drawer.Screen name="Admin Notifications" component={AdminNotifications} 
         options={{
          statusBarColor: '#16423C',
          headerShown: true,
          headerBackVisible:false,
          headerStyle: {
            backgroundColor: '#16423C',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}/>


{/* <Drawer.Screen
          name="Logout" 
        mode="contained"
        onPress={() => signOut()}
        style={{
          backgroundColor: '#16423C',
          width: '100%',
          borderRadius: 0,
          margin: 0,
        }}
        labelStyle={{fontSize: 18}}>
        Log Out
        </Drawer.Screen> */}

        
      </Drawer.Navigator>
     
       
      <Button
        mode="contained"
        onPress={() => signOut()}
        style={{
          backgroundColor: '#16423C',
          width: '100%',
          borderRadius: 0,
          margin: 0,
        }}
        labelStyle={{fontSize: 18}}>
        Log Out
        </Button>
        

    </SafeAreaProvider>

    
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  userInfo: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  userType: {
    fontSize: 18,
    color: '#777777',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cardDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#777777',
  },
});

export default AdminScreens;
