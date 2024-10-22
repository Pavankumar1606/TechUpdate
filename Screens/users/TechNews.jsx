import { StyleSheet, Text, View, FlatList, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const fetchSubscribedTechnologies = async (userId, setSubscribedTechnologies, setLoading) => {
  setLoading(true); 
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get(`http://192.168.1.13:5001/get-subscribed-technologies/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.status === 'ok') {
      setSubscribedTechnologies(response.data.data);
    } else {
      Alert.alert('Error', response.data.data);
    }
  } catch (error) {
    console.error('Error fetching subscribed technologies:', error);
  } finally {
    setLoading(false); 
  }
};

const handleUnsubscribe = async (userId, technologyId, setSubscribedTechnologies) => {
  try {
    const response = await axios.post('http://192.168.1.13:5001/unsubscribe', { userId, technologyId });
    if (response.data.status === 'ok') {
      setSubscribedTechnologies((prevTechs) => prevTechs.filter((tech) => tech._id !== technologyId));
      Alert.alert('Success', 'Unsubscribed successfully');
    } else {
      Alert.alert('Error', response.data.data);
    }
  } catch (error) {
    console.error('Error unsubscribing:', error);
  }
};

export default function TechNews() {
  const [subscribedTechnologies, setSubscribedTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
        } else {
          console.error('User ID not found');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };
    fetchUserId();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchSubscribedTechnologies(userId, setSubscribedTechnologies, setLoading);
      }
    }, [userId])
  );

  const ListHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.subTitle}>Subscribed Technologies</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0f4c75" />
      </View>
    );
  }

  return (
    <FlatList
      data={subscribedTechnologies}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.technologyContainer}>
          <Text style={styles.technologyText}>{item.name}</Text>
          <Button
            mode="contained"
            onPress={() => handleUnsubscribe(userId, item._id, setSubscribedTechnologies)}
            style={styles.unsubscribeButton}
            labelStyle={styles.buttonLabel}
          >
            Unsubscribe
          </Button>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>No subscribed technologies available.</Text>}
      ListHeaderComponent={ListHeader}
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    backgroundColor: '#16423C',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  subTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  technologyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
    padding: 10, 
    marginVertical: 6, 
    marginHorizontal: 12, 
    borderRadius: 8, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3, 
    elevation: 3,
  },
  technologyText: {
    fontSize: 16, 
    color: '#333',
    fontWeight: '500',
  },
  unsubscribeButton: {
    backgroundColor: '#16423C',
    borderRadius: 6, 
    paddingHorizontal: 8, 
    paddingVertical: 6,
  },
  buttonLabel: {
    fontSize: 12, 
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#bbb',
    fontSize: 14, // Reduced font size
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

