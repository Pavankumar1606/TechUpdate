import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Card, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const fetchUserDetails = async (userId, setUserDetails) => {
  try {
    const response = await axios.get(`http://192.168.1.13:5001/get-user/${userId}`);
    if (response.data.status === 'ok') {
      setUserDetails(response.data.data);
    } else {
      Alert.alert('Error', response.data.data);
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
  } 
};

export default function ProfileScreen({ navigation }) {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    mobile: '',
    inAppNotifications: false,
    emailNotifications: false,
  });

  const [editable, setEditable] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
        } else {
          console.error('User ID not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching user ID from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId, setUserDetails);
    }
  }, [userId]);

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://192.168.1.13:5001/update-user/${userId}`, userDetails);
      if (response.data.status === 'ok') {
        setUserDetails(response.data.data);
        setEditable(false);
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        Alert.alert('Error', response.data.data);
      }
    } catch (error) {
      console.error('Error updating user details:', error);
      Alert.alert('Error', 'An error occurred while updating profile');
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('userId');
      await AsyncStorage.removeItem('userToken');
      setUserId(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userDetails.email}
        editable={false}
      />
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={userDetails.name}
        onChangeText={(text) => setUserDetails({ ...userDetails, name: text })}
        editable={editable}
      />
      <Text style={styles.label}>Mobile</Text>
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={userDetails.mobile}
        onChangeText={(text) => setUserDetails({ ...userDetails, mobile: text })}
        editable={editable}
      />

      <Card style={styles.card}>
        <Card.Title title="Notification Preferences" />
        <Divider />
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={userDetails.inAppNotifications ? 'checked' : 'unchecked'}
            onPress={() =>
              setUserDetails({ ...userDetails, inAppNotifications: !userDetails.inAppNotifications })
            }
            disabled={!editable}
          />
          <Text style={styles.checkboxLabel}>In-app Notifications</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={userDetails.emailNotifications ? 'checked' : 'unchecked'}
            onPress={() =>
              setUserDetails({ ...userDetails, emailNotifications: !userDetails.emailNotifications })
            }
            disabled={!editable}
          />
          <Text style={styles.checkboxLabel}>Email Notifications</Text>
        </View>
      </Card>

      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          {editable ? (
            <Button mode="contained" onPress={handleSave} style={styles.button}>
              Save
            </Button>
          ) : (
            <Button mode="contained" onPress={() => setEditable(true)} style={styles.button}>
              Edit
            </Button>
          )}
        </View>
        <View style={styles.buttonWrapper}>
          <Button mode="contained" onPress={signOut} style={styles.logoutButton}>
            Log Out
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9', // Light background color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#16423C', // Dark color for title
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333', // Darker text color for labels
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize:18,
    color:'#000',
    backgroundColor: '#fff', // White background for input fields
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#16423C',
    borderRadius: 8,
    elevation: 3, // Add elevation for shadow effect
  },
  logoutButton: {
    backgroundColor: '#16423C', 
    borderRadius: 8,
    elevation: 3,
  },
  card: {
    marginVertical: 20,
    borderRadius: 8,
    elevation: 1,
    backgroundColor: '#fff', 
  },
});
