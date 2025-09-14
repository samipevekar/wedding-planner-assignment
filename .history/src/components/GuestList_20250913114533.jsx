// src/components/GuestList.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput 
} from 'react-native';
import GuestItem from './GuestItem';

const GuestList = ({ guests, onDeleteGuest }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredGuests = guests.filter(guest => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'All' || guest.rsvpStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search guests..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter by:</Text>
          <View style={styles.filterButtons}>
            {['All', 'Yes', 'No', 'Maybe'].map(status => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.filterButton,
                  filterStatus === status && styles.filterButtonSelected
                ]}
                onPress={() => setFilterStatus(status)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterStatus === status && styles.filterButtonTextSelected
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      
      {filteredGuests.length === 0 ? (
        <Text style={styles.emptyText}>
          {guests.length === 0 ? 'No guests added yet' : 'No guests match your search'}
        </Text>
      ) : (
        <FlatList
          data={filteredGuests}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GuestItem guest={item} onDelete={onDeleteGuest} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 5,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#555',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  filterButtonSelected: {
    backgroundColor: '#2196F3',
  },
  filterButtonText: {
    color: '#555',
    fontSize: 12,
  },
  filterButtonTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default GuestList;