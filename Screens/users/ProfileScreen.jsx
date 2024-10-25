import { StyleSheet, Text, View, TextInput, Alert, Image, Modal, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Card, Divider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

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
    profilePic: null, // Store the profile picture URL or file path
  });

  const [editable, setEditable] = useState(false);
  const [userId, setUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
        setModalVisible(false);
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

  const handleProfilePicEdit = () => {
    // Logic for selecting a new profile picture
    Alert.alert('Profile Picture', 'This is where you can implement profile picture selection logic.');
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {/* Top 30% of the screen for wallpaper and profile picture */}
        <ImageBackground
          source={require('../../assets/Images/logo1.jpg')} // Replace with your background image URL
          style={styles.wallpaperContainer}
        >
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: userDetails.profilePic || 'data:image/jpeg;base64,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' }} // Placeholder image
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editIcon} onPress={handleProfilePicEdit}>
              <FontAwesome name="camera" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* User details section */}
        <View style={styles.detailsContainer}>
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
            editable={false}
          />
          <Text style={styles.label}>Mobile</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile"
            value={userDetails.mobile}
            editable={false}
          />

          <Card style={styles.card}>
            <Card.Title title="Notification Preferences" />
            <Divider />
            
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={userDetails.emailNotifications ? 'checked' : 'unchecked'}
                onPress={() =>
                  setUserDetails({ ...userDetails, emailNotifications: !userDetails.emailNotifications })
                }
                disabled
              />
              <Text style={styles.checkboxLabel}>Email Notifications</Text>
            </View>
          </Card>

          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => setModalVisible(true)} style={styles.button}>
              Edit
            </Button>
            <Button mode="contained" onPress={signOut} style={styles.logoutButton}>
              Log Out
            </Button>
          </View>
        </View>

        {/* Modal for editing user details */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={userDetails.name}
                onChangeText={(text) => setUserDetails({ ...userDetails, name: text })}
              />
              <TextInput
                style={styles.input}
                placeholder="Mobile"
                value={userDetails.mobile}
                onChangeText={(text) => setUserDetails({ ...userDetails, mobile: text })}
              />
              <Button mode="contained" onPress={handleSave} style={styles.modalButton}>
                Save
              </Button>
              <Button mode="text" onPress={() => setModalVisible(false)}>
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({  
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  wallpaperContainer: {
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 5,
  },
  detailsContainer: {
    marginTop: 30,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  card: {
    marginVertical: 20,
    borderRadius: 8,
    backgroundColor: '#fff',
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
    marginTop: 20,
  },
  button: {
    backgroundColor: '#16423C',
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#16423C',
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: '#16423C',
  },
});
