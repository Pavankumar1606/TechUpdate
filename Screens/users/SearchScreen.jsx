import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList,  Alert, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-paper';

export default function SearchScreen() {
  const [friends, setFriends] = useState([]); // List of users who accepted requests
  const navigation = useNavigation();

  // Fetch friends list when component mounts
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId'); // Get logged-in user ID
        const response = await axios.get(`http://192.168.1.13:5001/friends/friendsList/${userId}`); // Fetch friends from backend
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  // Empty state for Friends
  const renderEmptyFriends = () => (
    <View style={styles.emptyContainer}>
      <Text>No friends available yet. Start sending requests!</Text>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>

        {/* Button to navigate to Request Management screen */}
        <TouchableOpacity
          style={styles.requestButton}
          onPress={() => navigation.navigate('RequestManagement')}>
          <FontAwesome name="user-plus" color="#16423C" style={styles.buttonText} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subTitle}>Friends</Text>
      <FlatList
        data={friends}
        renderItem={({ item }) => (
          
         <TouchableOpacity  onPress={() => navigation.navigate('Chat', { userName: item.name, frndId: item._id })}>
           <View style={styles.userContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <FontAwesome name="angle-right" color="#16423C" style={{fontSize:18,fontWeight:'bold'}} />

            
      
              
          </View>
         </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id || item.id}
        ListEmptyComponent={renderEmptyFriends}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  requestButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  subTitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
  },
  requestButton: {
    backgroundColor: '#16423C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
  },
  userName: {
    fontSize: 18,
   
  },
  action: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 3,
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#16423C',
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,
    marginLeft: 10,
    fontSize: 16,
    color: '#05375a',
  },
  icon: {
    paddingRight: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  btnstyle:{
    buttonColor:"#16423C",
    textColor:"white" 
  }
});
