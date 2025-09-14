import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
  ActivityIndicator
} from 'react-native';


const AddGuestForm = ({ onAddGuest, onRandomGuest, randomGuestLoading }) => {
  const [name, setName] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState('Maybe');

  const handleSubmit = () => {
    if (name.trim()) {
      onAddGuest(name.trim(), rsvpStatus);
      setName('');
      setRsvpStatus('Maybe');
    }
  };

  const getRsvpStatusColor = (status) => {
    switch (status) {
      case 'Yes': return '#E8F5E8';
      case 'No': return '#FFF0F0';
      case 'Maybe': return '#FFF8E1';
      default: return '#F5F5F5';
    }
  };

  const getRsvpStatusBorder = (status) => {
    switch (status) {
      case 'Yes': return '#4CAF50';
      case 'No': return '#F44336';
      case 'Maybe': return '#FF9800';
      default: return '#E0E0E0';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Wedding Guest</Text>
        <Text style={styles.headerSubtitle}>Let's build your guest list together</Text>
      </View>

      {/* Guest Name Input */}
      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Guest Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter guest's full name"
            placeholderTextColor="#B0B0B0"
            value={name}
            onChangeText={setName}
          />
        </View>
      </View>

      {/* RSVP Status Selection */}
      <View style={styles.rsvpSection}>
        <Text style={styles.inputLabel}>RSVP Status</Text>
        <View style={styles.rsvpContainer}>
          {['Yes', 'Maybe', 'No'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.rsvpButton,
                {
                  backgroundColor: rsvpStatus === status 
                    ? getRsvpStatusColor(status) 
                    : '#FAFAFA',
                  borderColor: rsvpStatus === status 
                    ? getRsvpStatusBorder(status)
                    : '#E8E8E8',
                }
              ]}
              onPress={() => setRsvpStatus(status)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.rsvpIndicator,
                { 
                  backgroundColor: rsvpStatus === status 
                    ? getRsvpStatusBorder(status)
                    : 'transparent'
                }
              ]} />
              <Text style={[
                styles.rsvpButtonText,
                {
                  color: rsvpStatus === status 
                    ? getRsvpStatusBorder(status)
                    : '#666',
                  fontWeight: rsvpStatus === status ? '600' : '400'
                }
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Add Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onRandomGuest}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>{randomGuestLoading? <ActivityIndicator color={'#666'} size={'small'} /> : 'Add Random Guest'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 4,
    textAlign: 'center',
  },
  
  headerSubtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  inputSection: {
    marginBottom: 24,
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  inputContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },

  input: {
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: Platform.OS === 'ios' ? 44 : 48,
  },

  rsvpSection: {
    marginBottom: 28,
  },

  rsvpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  rsvpButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 56,
  },

  rsvpIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },

  rsvpButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },

  buttonSection: {
    gap: 12,
  },

  primaryButton: {
    backgroundColor: '#D4A574',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#D4A574',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D4A574',
  },

  secondaryButtonText: {
    color: '#D4A574',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
};

export default AddGuestForm;