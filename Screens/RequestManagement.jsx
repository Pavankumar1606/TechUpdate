import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet ,TextInput} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
export default function RequestManagementScreen() {
 
  const [users, setUsers] = useState([]); // Filtered list of users
  const [searchQuery, setSearchQuery] = useState(''); // Track search input
  const [allUserData, setAllUserData] = useState([]); // Full list of all users
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]); 
  const[isVewing, setIsViewing]=useState('')
  
  async function getallUsers() {;

    try{
      const userId= await AsyncStorage.getItem('userId')
      if(userId){
        const res=await axios.get('http://192.168.1.13:5001/friends/chatScrenUsers',{
          params:{userId}
        })
        setAllUserData(res.data.data);
      }
    }catch(error) {
      console.error('Error fetching users', error);
    }
  }


  async function getFriendsList(){

    try{
      const userId = await AsyncStorage.getItem('userId'); // Get logged-in user ID
      if(userId){
        const res = await axios.get(`http://192.168.1.13:5001/friends/friendsList/${userId}`); 
        setFriends(res.data);
      }
    }catch(error) {
      console.error('Error fetching users', error);
    }
    // try {
      
    //   const response = await axios.get(`http://192.168.1.13:5001/friends/friendsList/${userId}`); // Fetch friends from backend
      
    // } catch (error) {
    //   console.error('Error fetching friends:', error);
    // }
  };

  async function getPendingRequests() {
    const userId = await AsyncStorage.getItem('userId');  // Simulate logged-in user ID
    axios.get(`http://192.168.1.13:5001/friends/pending-requests/${userId}`)
      .then(res => {
        setFriendRequests(res.data);
      })
      .catch(error => {
        console.error("Error fetching pending requests", error);
      });
  }



  useEffect(() => {
    getallUsers();
     getPendingRequests();
     getFriendsList();
  }, []);

  useEffect(() => {
    setUsers(allUserData);
  }, [allUserData]);

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query === '') {
      setUsers(allUserData);
    } else {
      const filtered = allUserData.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filtered);
    }
  };

  const isFriend=(userId)=>{
    return friends.some((friend)=>friend._id===userId)
  }

  const sendFriendRequest = async (receiverId) => {
    try {
      const senderId = await AsyncStorage.getItem('userId'); // Simulate logged-in user ID
      await axios.post('http://192.168.1.13:5001/friends/send-request', { senderId, receiverId });
      Alert.alert('Request Sent', 'Friend request has been sent.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send friend request.');
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.post('http://192.168.1.13:5001/friends/accept-request', { requestId });
      Alert.alert('Request Accepted', 'Friend request has been accepted.');
      getPendingRequests();  // Refresh the pending requests list
    } catch (error) {
      Alert.alert('Error', 'Failed to accept friend request.');
    }
  };

  return (
    <>
      <View style={styles.container}>
        {/* Search Users */}
        <View style={styles.action}>
          <FontAwesome name="search" size={20} color="#000" style={styles.icon} />
          <TextInput
            style={styles.textInput}
            placeholder='Search Users'
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor='#888'
          />
        </View>
        {isVewing ?(
          <View>
            {/* <Button  buttonColor="#16423C" textColor="white" marginTop={10} onPress={() => setIsViewing(false)} >Hide Pending</Button> */}
            
            <TouchableOpacity onPress={() => setIsViewing(false)}>
                  <View style={styles.userContainer}>
                    <Text style={styles.userName}>Hide Pending Requests</Text>
                    <FontAwesome name="chevron-up" color="#16423C" style={styles.smallIcon} />

                  </View>
                </TouchableOpacity>
          <FlatList
          data={friendRequests}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <Text style={styles.userName}>{item.sender.name} sent you a  request</Text>
              <Button buttonColor="#16423C" textColor="white" onPress={() => acceptFriendRequest(item._id)}>Accept Request</Button>
              
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
          </View>
        ):(
            <>
              <TouchableOpacity onPress={() => setIsViewing(true)}>
                    <View style={styles.userContainer}>
                      <Text style={styles.userName}>Show Pending Requests</Text>
                      <FontAwesome name="chevron-down" color="#16423C" style={styles.smallIcon} />

                    </View>
                  </TouchableOpacity>
            
            </>
        )}
        {/* User List */}

        <Text style={styles.subTitle}>All Users</Text>
        <FlatList
          data={users}
          renderItem={({ item }) => (
            <View style={styles.userContainer}>
              <Text style={styles.userName}>{item.name}</Text>
              {isFriend(item._id) ? (
                <Text style={styles.friendText}>Friends</Text>
              ) : (
               
                <Button buttonColor="#16423C" textColor="white" onPress={() => sendFriendRequest(item._id)}>Send Request</Button>
              )}
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
  friendText: {
    color: '#16423C',
    fontWeight: 'bold',
  },
});
