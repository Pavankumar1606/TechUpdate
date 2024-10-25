import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Bot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [input, setInput] = useState(''); 
  const [messages, setMessages] = useState([]); // Array to store messages

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSend = async () => {
    if (input.trim() === '') return;
  
    const userMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
  
    
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyANnEZ_b-HQMHV6OxDanqm4Y9T55r8_Qb4', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input }] }],
        }),
      });
  
      // Check if the response is okay
      if (!response.ok) {
        console.error(`HTTP error! status: ${response.status}`);
        return; // Exit if there's an error
      }
  
      const data = await response.json();
  
     
    //   console.log('API Response:', JSON.stringify(data, null, 2));
    
      if (data && data.candidates && data.candidates.length > 0) {
        const botMessage = data.candidates[0].content.parts[0].text; // Extracting the text correctly
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, sender: 'bot' },
        ]);
      } else {
        console.error('Unexpected API response:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  
  
  return (
    <View>
      {/* Floating Button */}
      <TouchableOpacity style={styles.fab} onPress={toggleChat}>
        <Icon name={isChatOpen ? 'close' : 'reddit'} size={30} color="#fff" />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal visible={isChatOpen} animationType="slide" transparent={true} onRequestClose={toggleChat}>
        <View style={styles.overlay}>
          <View style={styles.chatModal}>
            {/* Close button inside modal */}
            <TouchableOpacity style={styles.closeButton} onPress={toggleChat}>
              <Icon name="close" size={24} color="#16423C" />
            </TouchableOpacity>
            <Text style={styles.chatHeader}>Chat with Bot</Text>

            <ScrollView style={styles.chatContainer}>
              {messages.map((message, index) => (
                <Text
                  key={index}
                  style={[
                    styles.chatMessage,
                    message.sender === 'user' ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  {message.text}
                </Text>
              ))}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={input}
                onChangeText={setInput}
                placeholder="Type a message"
                placeholderTextColor="#666"
              />
              <TouchableOpacity onPress={handleSend}>
                <Icon name="send" size={24} color="#16423C" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 70,
    right: 20,
    backgroundColor: '#16423C',
    borderRadius: 50,
    padding: 15,
    elevation: 5,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatModal: {
    width: '90%',
    height: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  chatHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 20,
  },
  chatMessage: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#ECECEC',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  textInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginRight: 10,
    color: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
});

export default Bot;
