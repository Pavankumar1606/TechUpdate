import { Text, ScrollView, View, ImageBackground, StyleSheet, TouchableOpacity, Alert, TextInput, Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Swiper from 'react-native-swiper';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

function HomeScreen(props) {
  const [technologies, setTechnologies] = useState([]);
  const [allTechnologies, setAllTechnologies] = useState([]); // Store original list
  const [subscribedTechs, setSubscribedTechs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const fetchTechnologies = async () => {
    try {
      const response = await axios.get('http://192.168.1.13:5001/technologies/list');
      setTechnologies(response.data.data);
      setAllTechnologies(response.data.data); // Save the original list
    } catch (error) {
      console.error('Error fetching technologies', error);
    }
  };

  const getSubscribedTechnologies = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');
  
      if (userId && token) {
        const response = await axios.get(`http://192.168.1.13:5001/get-subscribed-technologies/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const techIds = response.data.data.map((tech) => tech._id);
        setSubscribedTechs(techIds);
      }
    } catch (error) {
      console.error('Error fetching subscribed technologies', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTechnologies();
      getSubscribedTechnologies();
    }, [])
  );

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query === '') {
      setTechnologies(allTechnologies); // Reset to original list when query is empty
    } else {
      const filtered = allTechnologies.filter((tech) =>
        tech.name.toLowerCase().includes(query.toLowerCase())
      );
      setTechnologies(filtered);
    }
  };


  const handleSubscribe = async (tech) => {
    const token = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('userId');  

    if (!token || !userId) {
      Alert.alert('Authentication required', 'Please log in to subscribe.');
      return;
    }

    try {
      await axios.post('http://192.168.1.13:5001/sub/subscribe', {
        techId: tech._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscribedTechs([...subscribedTechs, tech._id]);
      Alert.alert('Success', 'Subscribed to the technology!');
    } catch (error) {
      console.error('Error subscribing to technology', error.response?.data);
      Alert.alert('Subscription failed', error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
<ScrollView style={styles.container}>

  <View style={styles.action}>
  
        <FontAwesome name="search" size={20} color="#000" style={styles.icon} />
        <TextInput
            style={styles.textInput}
            placeholder='Search Technologies'
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor='#888'
        />
   
        </View>

  {/* Welcome Section */}


  <View style={styles.slideContainer}>
            <Swiper autoplay={true} autoplayTimeout={4}
            dotColor="#ccc" activeDotColor="red"
            >
              <View style={styles.slider}>
                <Image source={require('../../assets/Images/logo1.jpg')} style={styles.image} />
              </View>
              <View style={styles.slider}>
                <Image source={require('../../assets/Images/logo1.jpg')} style={styles.image} />
              </View>
              <View style={styles.slider}>
                <Image source={require('../../assets/Images/logo1.jpg')} style={styles.image} />
              </View>
              <View style={styles.slider}>
                <Image source={require('../../assets/Images/logo1.jpg')} style={styles.image} />
              </View>
            </Swiper>

           
            </View>


  <Text style={styles.greeting}>Welcome to the Tech Update Platform</Text>

  {/* Technologies Section */}
  <Text style={styles.title}>Explore Technologies</Text>

  <View style={styles.techSection}>
    {technologies.length === 0 ? (
      <View style={styles.noTechContainer}>
        <Text style={styles.noTechText}>No technologies found</Text>
      </View>
    ) : (
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.techScroll}
        contentContainerStyle={{ alignItems: 'center' }} // Align items in center
      >
        {technologies.map((tech) => (
          <View key={tech._id} style={styles.techContainer}>
            <Text style={styles.techName}>{tech.name}</Text>
            {subscribedTechs.includes(tech._id) ? (
              <Text style={styles.subscribedText}>Subscribed</Text>
            ) : (
              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={() => handleSubscribe(tech)}
              >
                <Text style={styles.subscribeButtonText}>Subscribe</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    )}
  </View>

  {/* Promo Banner */}
  <Text style={styles.secondTitle}>Tech News</Text>
  <View style={styles.promoBanner}>
    <Text style={styles.promoText}>Check out our latest feature: AI-Driven Technology Recommendations!</Text>
    <TouchableOpacity style={styles.promoButton} onPress={() => navigation.navigate('News')}>
      <Text style={styles.promoButtonText}>Learn More</Text>
    </TouchableOpacity>
  </View>
</ScrollView>


  );
}



const styles = StyleSheet.create({
  action: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 3,
    marginTop: 15,
    marginBottom:5,
    paddingHorizontal: 15,

    borderWidth: 1,
    borderColor: '#16423C',
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,
    marginLeft:10,
    fontSize:16,
    color: '#05375a',
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginVertical: 15,
  },
  searchInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    marginTop: 40,
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16423C',
    marginBottom: 15,
  },
  techSection: {
    minHeight: 150, // Ensure section takes up space even when empty
  },
  techScroll: {
    flexDirection: 'row',
  },
  noTechContainer: {
    height: 150, // Same height as the technology scroll
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTechText: {
    fontSize: 16,
    color: '#888',
  },
  techContainer: {
    width: 150,
    height: 110, 
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ffffff', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    elevation: 5,
    overflow: 'hidden',
},

  techName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16423C',
    marginBottom: 10,
  },
  subscribeButton: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#16423C',
    borderRadius: 8,
  },
  subscribeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  subscribedText: {
    marginTop: 10,
    color: 'green',
    fontWeight: 'bold',
    fontSize: 14,
  },
  secondTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16423C',
    marginBottom: 15,
  },
  promoBanner: {
    padding: 20,
    backgroundColor: '#2C6B6F',
    borderRadius: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  promoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  promoButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#16423C',
    borderRadius: 8,
  },
  promoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  slideContainer:{
    height:200,
  },
  slider:{
    height:200,
    flex:1,
    alignItems:'center',
    justifyContent:'center',
  },
  image:{
    height:200,
    width:'100%',
      borderRadius:10,
    },
});




export default HomeScreen;
