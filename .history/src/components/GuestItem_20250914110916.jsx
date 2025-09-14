// src/components/GuestItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// Remove the vector icons import and use built-in icon instead

const GuestItem = ({ guest, onDelete }) => {
  const getStatusColor = () => {
    switch (guest.rsvpStatus) {
      case 'Yes': return '#4CAF50';
      case 'No': returnz '#F44336';
      case 'Maybe': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{guest.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{guest.rsvpStatus}</Text>
        </View>
      </View>
      
      <TouchableOpacity onPress={() => onDelete(guest.id)} style={styles.deleteButton}>
        {/* Using text as a simple delete icon */}
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },
  deleteIcon: {
    fontSize: 22,
  },
});

export default GuestItem;