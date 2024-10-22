import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
import io from 'socket.io-client';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize the Socket.io client
const socket = io("http://192.168.1.13:5001");

export default function ChatScreen({ route }) {
  const { userName, frndId } = route.params;
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
const [selectedMessageId, setSelectedMessageId] = useState(null);


 
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    fetchUserId();
    fetchMessages();

    // Listen for new incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  // Fetch previous messages between the logged-in user and the friend
  const fetchMessages = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
      const response = await axios.get(`http://192.168.1.13:5001/mess/messages/${userId}/${frndId}`);
    //   console.log(response.data);
      setMessages(response.data);
     
      
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Send message
// Send message
const sendMessage = async () => {
    if (!input.trim()) return; // Avoid sending empty messages
  
    const messageData = {
      senderId: userId,
      receiverId: frndId,
      content: input,
    };
  
    try {
      // Emit the message to the server for real-time communication
      socket.emit('sendMessage', messageData);
      // Clear the input after sending, but don't add the message to the state here
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  const renderMessage = ({ item }) => {
    const isMyMessage = item.senderId === userId;


    const handleLongPress = (messageId) => {
        setSelectedMessageId(messageId);
        setIsModalVisible(true);
      };
    
    return (
        <TouchableOpacity
      onLongPress={() => handleLongPress(item._id)} // Show the modal on long press
      style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.theirMessage]}
    >
      <View style={styles.messageTextContainer}>
        <Text style={styles.messageText}>{item.content}</Text>
        <Text style={styles.timestampText}>
          {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No timestamp'}
        </Text>
      </View>
    </TouchableOpacity>
    );
  };

  const renderEmptyMessages = () => (
    <View style={styles.emptyContainer}>
      <Text>No Messages Yet! Start a conversation</Text>
    </View>
  );

  return (
    // <KeyboardAvoidingView
    // //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={styles.container}
    // >
    //   <Text style={styles.title}>Chat with {userName}</Text>
      
    //   <FlatList
    //     data={messages}
    //     renderItem={renderMessage}
    //     keyExtractor={(item, index) => index.toString()}
    //     ListEmptyComponent={renderEmptyMessages}
    //     contentContainerStyle={styles.messageList}
    //   />

    //   <View style={styles.inputContainer}>
    //     <TextInput
    //       style={styles.textInput}
    //       value={input}
    //       onChangeText={setInput}
    //       placeholder="Type a message"
    //       placeholderTextColor="#888"
    //     />
    //     <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
    //       <FontAwesome name="send" size={20} color="#fff" />
    //     </TouchableOpacity>
    //   </View>
    // </KeyboardAvoidingView>
    
    
        <KeyboardAvoidingView
          style={styles.container}
        >
          <Text style={styles.title}>Chat with {userName}</Text>
          
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id} // Use unique ID instead of index
            ListEmptyComponent={renderEmptyMessages}
            contentContainerStyle={styles.messageList}
          />
      
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={input}
              onChangeText={setInput}
              placeholder="Type a message"
              placeholderTextColor="#888"
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <FontAwesome name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
      
          {/* Modal for delete confirmation */}
          {isModalVisible && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text>Are you sure you want to delete this message?</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.cancelButton}>
                    <Text>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity  style={styles.deleteButton}>
                    <Text style={{ color: 'red' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      );
      
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16423C',
    textAlign: 'center',
    marginVertical: 10,
  },
  messageList: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    marginVertical: 5,
    borderRadius: 15,
    padding: 10,
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  theirMessage: {
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
 
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 25,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#16423C',
    padding: 10,
    borderRadius: 25,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
 
    messageTextContainer: {
      alignSelf: 'flex-start', 
      maxWidth: '75%', 
    },
    messageText: {
      fontSize: 16,
      color: '#333',
      marginBottom: 5, 
    },
    timestampText: {
      fontSize: 12,
      color: '#999', 
      textAlign: 'right',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: '100%',
      },
      cancelButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
      },
      deleteButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
      },
    
});

