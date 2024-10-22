const cron = require("node-cron");
const axios = require("axios");
const Technology = require("./models/technologyModel");
const Notification = require("./models/notificationModel");
const { notifySubscribedUsers } = require("./emailServices"); // Import notification email logic
const parsers=require('./parser');
const { parse } = require("path");
// Cron job to fetch updates every 30 minutes
cron.schedule("*/30 * * * * ", async () => {
  console.log("Running cron job to fetch technology updates");

  try {
    const technologies = await Technology.find();
    
    for (const tech of technologies) {
      try {
        const response = await axios.get(tech.apiUrl);
        const responseData = response.data;

        // Determine the correct parser based on the API URL or technology name
        let parsedData;
        if (tech.apiUrl.includes("api.github.com")) {
          parsedData = parsers.githubReleaseParser(responseData);
        } else if (tech.apiUrl.includes("randomuser.me")) {
          parsedData = parsers.randomUserParser(responseData);
        }

        if (parsedData) {
          const newData = {
            message: `New update for ${parsedData.name || parsedData.tagName  || "unknown"} fetched at ${new Date().toISOString()}`,
            details: parsedData,
            // fetchedAt: new Date(),
          };

          let notification = await Notification.findOne({ technology: tech._id });

          if (notification) {
            notification.technologyName = tech.name;
            notification.data.push(newData);
          } else {
            notification = new Notification({
              technology: tech._id,
              technologyName: tech.name,
              data: [newData],
            });
          }

          await notification.save();
          console.log(`Notification updated for technology: ${tech.name}`);

          // Notify users who are subscribed
          newData.notificationId = notification._id;
          await notifySubscribedUsers(tech._id, tech.name, newData);
        }
      } catch (error) {
        console.error(`Error fetching data for ${tech.name}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error("Error fetching technologies:", error.message);
  }
});





















import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useNotification } from '../NotificationContext';
import Dropdown from '../Dropdown';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [sortedNotifications, setSortedNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState('All');
  const { showNotification } = useNotification();
  const [showRecent, setShowRecent] = useState(false); // State for toggling recent updates

  const fetchNotifications = async () => {
    const userId = await AsyncStorage.getItem('userId');

    try {
      const response = await axios.get(`http://192.168.1.13:5001/get-notifications/${userId}`);
      const fetchedNotifications = response.data.data;

      if (response.status === 200) {
        // Flatten notifications
        const flattenedNotifications = fetchedNotifications.flatMap(notification =>
          notification.data.map(update => ({
            _id: update._id, // Assuming each update has a unique ID
            technologyName: notification.technologyName,
            message: update.message,
            createdAt: update.createdAt, // Include the timestamp from update
          }))
        );

        setNotifications(flattenedNotifications);
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

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const uniqueTechnologies = ['All', ...new Set(notifications.map(notification => notification.technologyName))];

  const renderItem = ({ item }) => (
    <View style={styles.notificationCard}>
      <Text style={styles.message}>
        {item.technologyName || 'Unknown Technology'}
      </Text>
      <Text style={styles.message1}>{item.message || 'No message'}</Text>
      <Text style={styles.timestamp}>
        {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'No timestamp'}
      </Text>
    </View>
  );

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
    fontSize: 12,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  recentButton: {
    color: '#007BFF', // Blue color
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});
