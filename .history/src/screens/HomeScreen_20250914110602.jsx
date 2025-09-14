import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  Alert, 
  SafeAreaView, 
  TouchableOpacity
} from 'react-native';
import GuestList from '../components/GuestList';
import AddGuestForm from '../components/AddGuestForm';
import { fetchRandomGuest } from '../services/api';

const HomeScreen = ({navigation}) => {
  const [guests, setGuests] = useState([]);

  const addGuest = (name, rsvpStatus) => {
    const newGuest = {
      id: Date.now().toString(),
      name,
      rsvpStatus: rsvpStatus || 'Maybe',
    };
    setGuests([...guests, newGuest]);
  };

  const deleteGuest = (id) => {
    Alert.alert(
      "Delete Guest",
      "Are you sure you want to delete this guest?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: () => setGuests(guests.filter(guest => guest.id !== id))
        }
      ]
    );
  };

  const handleRandomGuest = async () => {
    try {
      const randomName = await fetchRandomGuest();
      addGuest(randomName, 'Maybe');
    } catch (error) {
      Alert.alert("Error", "Failed to fetch random guest. Please try again.");
    }
  };

  const confirmedGuests = guests.filter(guest => guest.rsvpStatus === 'Yes').length;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Wedding Planner</Text>
      
      <AddGuestForm onAddGuest={addGuest} onRandomGuest={handleRandomGuest} />
      
      <View style={styles.statsContainer}>
        <Text style={styles.stats}>Total Guests: {guests.length}</Text>
        <Text style={styles.stats}>Confirmed: {confirmedGuests}</Text>
      </View>
      
      {/* <GuestList guests={guests} onDeleteGuest={deleteGuest} /> */}
      <TouchableOpacity onPress={navigation.navigate('GuestList')}>
        <Text>View Guests</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  stats: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
});

export default HomeScreen;