import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Dropdown = ({ selectedValue, setSelectedValue, options }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdown} onPress={toggleDropdown}>
        <Text style={styles.selectedText}>{selectedValue || 'Select Technology'}</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.option}
              onPress={() => {
                setSelectedValue(option);
                setIsOpen(false);
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'relative',
    width:130, // Ensure container is positioned relative
   
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    
    
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  optionsContainer: {
    position: 'absolute', 
    width:130,// Position options absolutely 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    // maxHeight: 150,
    // overflow: 'hidden',
    backgroundColor: '#fff',
    zIndex: 1000, // Ensure it is on top of other elements
  },
  option: {
    padding: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Dropdown;
