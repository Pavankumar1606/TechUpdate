import React, { useState, useEffect } from 'react';
import { View, Text, TextInput,  FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { Button } from 'react-native-paper';

const AdminTechnologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [apiurl, setapiurl]=useState('')

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const fetchTechnologies = async () => {
    try {
      const response = await axios.get('http://192.168.1.13:5001/technologies/list');
      setTechnologies(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {
    try {
      await axios.post('http://192.168.1.13:5001/technologies/add', { name, description, apiUrl: apiurl , });

      if (!name || !description || !apiurl) {
        Alert.alert('Error', 'All fields are required.');
        return;
      }


      Alert.alert('Success', 'Technology added');
      resetForm();
      fetchTechnologies();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add technology');
    }
  };



  const resetForm = () => {
    setName('');
    setDescription('');
    setapiurl('')
    
    setIsAdding(false);
   
  };

  const renderTechnology = ({ item }) => (
    <View style={styles.techItem}>
      <Text style={styles.techName}>{item.name}</Text>
      <Text style={styles.techDescription}>{item.description}</Text>
      <Text style={styles.techApiUrl}>{item.apiUrl}</Text> 

      <View style={styles.buttonContainer}>
 
        <Button buttonColor="#16423C"  textColor="white" onPress={() => handleDelete(item._id)}>Delete</Button>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isAdding ? (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
           <TextInput
            style={styles.input}
            placeholder="API URL"
            value={apiurl}
            onChangeText={setapiurl}
          />
          
         
          <Button
            buttonColor="#16423C" textColor="white"
            onPress={handleAdd}
          >Add Technology</Button>
         <View style={{marginTop:10}}>
         <Button buttonColor="#16423C" textColor="white" onPress={resetForm} >Cancel</Button>
         </View>
        </View>
      ) : (
        <View>
          <Button  buttonColor="#16423C" textColor="white" marginTop={10} onPress={() => setIsAdding(true)} >Add Technology</Button>
          <FlatList
            data={technologies}
            keyExtractor={(item) => item._id}
            renderItem={renderTechnology}
            contentContainerStyle={styles.list}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  techItem: {
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  techName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  techDescription: {
    fontSize: 16,
    marginVertical: 5,
  },
  techCategory: {
    fontSize: 14,
    color: '#666',
  },
  techApiUrl: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    paddingBottom: 20,
  },
});

export default AdminTechnologies;
