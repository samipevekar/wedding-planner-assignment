// src/components/AddGuestForm.js
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Button, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Alert,
  Platform 
} from 'react-native';

const AddGuestForm = ({ onAddGuest, onRandomGuest }) => {
  const [name, setName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('Maybe');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a name for the guest");
      return;
    }
    
    onAddGuest(name.trim(), rsvpStatus);
    setName('');
    setRsvpStatus('Maybe');
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter guest name"
        value={name}
        onChangeText={setName}
      />
      
      <View style={styles.rsvpContainer}>
        <Text style={styles.rsvpLabel}>RSVP Status:</Text>
        <View style={styles.rsvpButtons}>
          {['Yes', 'No', 'Maybe'].map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.rsvpButton,
                rsvpStatus === status && styles.rsvpButtonSelected
              ]}
              onPress={() => setRsvpStatus(status)}
            >
              <Text style={[
                styles.rsvpButtonText,
                rsvpStatus === status && styles.rsvpButtonTextSelected
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button 
            title="Add Guest" 
            onPress={handleSubmit} 
            color="#4CAF50" 
          />
        </View>
        <View style={styles.buttonSpacer} />
        <View style={styles.buttonWrapper}>
          <Button 
            title="Add Random Guest" 
            onPress={onRandomGuest} 
            color="#2196F3" 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  rsvpContainer: {
    marginBottom: 15,
  },
  rsvpLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#555',
  },
  rsvpButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rsvpButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  rsvpButtonSelected: {
    backgroundColor: '#2196F3',
  },
  rsvpButtonText: {
    color: '#555',
  },
  rsvpButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginHorizontal: 5,
      },
    }),
  },
  buttonSpacer: {
    width: 10,
  },
});

export default AddGuestForm;