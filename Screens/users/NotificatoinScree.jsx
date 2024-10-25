import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNotification } from '../NotificationContext';
import Dropdown from '../Dropdown';
import RenderHtml from 'react-native-render-html'; 

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [sortedNotifications, setSortedNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState('All');
  const { showNotification } = useNotification();
  const [showRecent, setShowRecent] = useState(false); // State for toggling recent updates
  const[expandedNotifications, setExpandedNotifications]=useState('');

  const fetchNotifications = async () => {
    const userId = await AsyncStorage.getItem('userId');
  
    try {
      const response = await axios.get(`http://192.168.1.13:5001/get-notifications/${userId}`);
      // console.log('Response data:', response.data);
  
      const fetchedNotifications = response.data.data || [];
  
      if (response.status === 200 && Array.isArray(fetchedNotifications)) {
        const flattenedNotifications = fetchedNotifications.flatMap(notification => 
          (notification.updates || []).map(update => ({
            _id: update._id || notification._id,
            technologyName: notification.technologyName || 'Unknown Technology',
            message: update.message || update.updateIdentifier|| 'No message',
            createdAt: update.createdAt || notification.createdAt,
          }))
        );
        setNotifications(flattenedNotifications);
        setSortedNotifications(flattenedNotifications);
        // console.log('Flattened Notifications:', flattenedNotifications);
      } else {
        setError(response.data.message || 'Failed to fetch notifications');
      }
    } catch (err) {
      console.error('Fetch notifications error:', err);
      setError(err.response ? err.response.data.message : 'Server error');
    }
  };
  

  const handleSort = (technology) => {
    setSelectedTechnology(technology);
    const filteredNotifications = technology === 'All' 
      ? notifications 
      : notifications.filter(notification => notification.technologyName === technology);
    
    setSortedNotifications(filteredNotifications);
  };

    const toggleExpand=(id)=>{
      setExpandedNotifications(prev=>({
        ...prev,
        [id]:!prev[id],
      }))
    }


    

  
  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
      // console.log('Notifications state:', notifications);
    }, [])
  );

  const uniqueTechnologies = ['All', ...new Set(notifications.map(notification => notification.technologyName))];


 

  const renderItem = ({ item }) => {
    
    const isExpanded =expandedNotifications[item._id]
    const message=isExpanded ?item.message:`${item.message.substring(0,100)}...`;
    

    const htmlContent = message
    .replace(/\n/g, '<br />') // Replace newlines with <br />
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');


    return (
    <View style={styles.notificationCard}>
      <Text style={styles.message}>
        {item.technologyName || 'Unknown Technology'}
      </Text>
      <RenderHtml
          contentWidth={300} // Set this to your FlatList width
          source={{ html: htmlContent }} // Use the formatted HTML
          // onLinkPress={(event, href) => Linking.openURL(href)} // Handle link presses
        />
      {/* <Text style={styles.message1}>{message || 'No message'}</Text> */}
      <View style={styles.flex}>
      <Text style={styles.timestamp}>
        {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'No timestamp'}
      </Text>


      {item.message.length>100 &&(
        <TouchableOpacity onPress={()=> toggleExpand(item._id)}>
          <Text style={styles.readMore}>
            {isExpanded ?'Read Less':'Read More'}
          </Text>

        </TouchableOpacity>
      )}
      </View>
    </View>
  );
}

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // const toggleRecentUpdates = () => {
  //   setShowRecent(prev => !prev);
  // };

  // const notificationsToShow = showRecent
  //   ? notifications.filter(notification => {
  //       const notificationDate = new Date(notification.createdAt);
  //       const now = new Date();
  //       // Show notifications from the last hour
  //       return (now - notificationDate) <= 1 * 60 * 60 * 1000;  
  //     })
  //   : notifications;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <Dropdown
          selectedValue={selectedTechnology}
          setSelectedValue={handleSort}
          options={uniqueTechnologies}
        />
      </View>

      {/* <TouchableOpacity onPress={toggleRecentUpdates}>
        <Text style={styles.recentButton}>
          {showRecent ? 'Show All' : 'Show Recent'}
        </Text>
      </TouchableOpacity> */}

      <FlatList
        // data={selectedTechnology === 'All' ? notificationsToShow : sortedNotifications} // to show recent notification
        data={selectedTechnology === 'All' ? notifications : sortedNotifications}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => (
          <View style={styles.errorContainer}>
            <Text >No notifications available</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  message1: {
    fontSize: 14,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#000',
    marginTop: 5,
    flex:1
  },
  recentButton: {
    color: '#007BFF', // Blue color
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  flex:{
    flexDirection: 'row',
  },
  readMore: {
    color: '#16423C', // Blue color
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
   
  },
});
