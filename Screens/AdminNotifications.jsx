import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Dropdown from './Dropdown'; // Import your custom dropdown

import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function AdminNotifications() {
  const [AllNotifications, setAllNotifications] = useState([]);
  const [sortedNotifications, setSortedNotifications] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState('All'); // Default to "All"



  async function getAllNotifications() {
    try {
      const res = await axios.get('http://192.168.1.13:5001/getAllNotifications');
      const notifications = res.data.data || [];
      setAllNotifications(notifications);
      handleSort(selectedTechnology, notifications);
      
    //   console.log(res.data.data );
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }


  async function deleteNotification(data, dataObj) {
    try{
        const res=  await axios.post('http://192.168.1.13:5001/deleteNotification',  { id: data , objId:dataObj._id })
        if (res.data.status === 'ok') {
            console.log('Notification deleted successfully');
            getAllNotifications(); // This will fetch the updated notifications and trigger sorting.
          }
    }catch (error) {
        console.error('Error fetchdeletinging notifications:', error);

    }
  }


  useEffect(() => {
    getAllNotifications();
  }, []);


  const handleSort=(technology, notifications = AllNotifications)=>{
    setSelectedTechnology(technology);

    const filteredNotifications=technology==='All'
    ?notifications
    :notifications.filter(notification=>notification.technologyName===technology);

    setSortedNotifications(filteredNotifications);

  }

  const uniqueTechnologies = ['All', ...new Set(AllNotifications.map(notification => notification.technologyName))]; // Add "All" option

  const NotificationCard = ({ data }) => (
    <View style={styles.card}>
      <View style={styles.cardDetails}>
        {/* <Text style={styles.name}>ID: {data._id}</Text>
        <Text style={styles.name}>Technology: {data.technology}</Text> */}
        <Text style={styles.name}>Technology Name: {data.technologyName}</Text>

        {/* <Text style={styles.date}>Created At: {new Date(data.createdAt).toLocaleString()}</Text> */}
        <Text style={styles.date}>Updated At: {new Date(data.updatedAt).toLocaleString()}</Text>
      </View>
      <View style={styles.updatesList}>
        <Text style={styles.updatesTitle}>Updates:</Text>
        <Text>{data.data.length}</Text>
        {data.data.map((update, index) => (
           
          <View key={index} style={styles.updateItem}>
             <View style={styles.update}>
             <Text style={styles.updateDetail}>No: {index+1} </Text>
            <Text style={styles.updateDetail}>Detail: {update.message}</Text>
            <Text style={styles.updateDetail}>Id: {update._id}</Text>

            
            <Text style={styles.updateDate}>Date: {new Date(update.createdAt).toLocaleString()}</Text>
             </View>
            
           <TouchableOpacity>
             <FontAwesome name="trash-o" color="#16423C" style={styles.smallIcon}  onPress={() => deleteNotification(update._id, data)}/>
           </TouchableOpacity>

          </View>
        ))}
      </View>
    </View>
  );

  return (



    <View style={styles.container}>
      {/* <View style={styles.userInfo}>
        <Text style={styles.userName}>Admin Notifications</Text>
      </View> */}

     
      <View style={styles.header}>
        <Text style={styles.userName}>All Notifications</Text>
        <Dropdown
          selectedValue={selectedTechnology}
          setSelectedValue={(value) => handleSort(value)}
          options={uniqueTechnologies}
        />
      </View>

      {sortedNotifications.length > 0 ? (
        <FlatList
          data={sortedNotifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <NotificationCard data={item} />}
        />
      ) : (
        <Text style={styles.noData}>No notifications available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  userInfo: {
    marginBottom: 16,
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16423C',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardDetails: {
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#555',
  },
  updatesList: {
    marginTop: 8,
  },
  updatesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 4,
  },
  updateItem: {
    flexDirection: 'row',
    backgroundColor: '#e7f4f3',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  updateDetail: {
    fontSize: 14,
    color: '#333',
  },
  updateDescription: {
    fontSize: 14,
    color: '#666',
  },
  updateDate: {
    fontSize: 12,
    color: '#888',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  smallIcon: {
    alignItems: 'center',
    marginTop:30,
    marginRight: 5,
    fontSize: 24,
  },
  update:{
    flex:1
  }
});
