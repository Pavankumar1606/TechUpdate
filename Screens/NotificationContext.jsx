
import React, { createContext, useContext, useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log } from 'console';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const lastNotificationIdRef = useRef('');

  
  const showNotification = (notification) => {
    Toast.show({
      type: 'success',
      text1: `New Notification: ${notification.technologyName}`,
      text2: notification.message || 'No message',
      visibilityTime: 4000,
      position: 'top',
    });
  };

  // Function to fetch notifications
  const fetchNotifications = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.error('No userId found in AsyncStorage');
      return;
    }
  
    try {
      console.log(`Fetching notifications for userId: ${userId}`);
      const response = await axios.get(`http://192.168.1.13:5001/get-notifications/${userId}`);
      
      console.log(`Response status: ${response.status}`);
      if (response.status !== 200) {
        console.error(`Unexpected response status: ${response.status}`);
        return;
      }
  
      const fetchedNotifications = response.data.data;
      // console.log('Fetched notifications:', fetchedNotifications);
  
      if (!Array.isArray(fetchedNotifications)) {
        // console.error('Fetched notifications are not an array:', fetchedNotifications);
        return;
      }
  
      if (fetchedNotifications.length > 0) {
        // Flatten updates from the data arrays if they exist
        const flattenedNotifications = fetchedNotifications.flatMap(notification =>
          (notification.updates || []).map(update => ({
            _id: update._id,
            technologyName: notification.technologyName,
            message: update.message,
            createdAt: update.createdAt || notification.createdAt,
          }))
        );
  
        // console.log('Flattened notifications:', flattenedNotifications);
  
        if (flattenedNotifications.length === 0) {
          console.log('No updates found in notifications');
          return;
        }
  
        // Find the most recent update based on createdAt
        const latestNotification = flattenedNotifications.reduce((latest, current) => {
          return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
        }, flattenedNotifications[0]);
  
        console.log('Latest notification:', latestNotification);
  
        // Only show the notification if it is new
        if (latestNotification && lastNotificationIdRef.current !== latestNotification._id) {
          lastNotificationIdRef.current = latestNotification._id;
          console.log('New notification detected, displaying:', latestNotification);
          showNotification(latestNotification); // Show notification using context
        } else {
          console.log('No new notifications to display.');
        }
      } else {
        console.log('No notifications found for this user');
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
    }
  };
  
  
  
  // Polling mechanism to fetch notifications every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchNotifications, 10000000); // {1000}
    return () => clearInterval(intervalId); // Cleaning up the interval on unmount
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
