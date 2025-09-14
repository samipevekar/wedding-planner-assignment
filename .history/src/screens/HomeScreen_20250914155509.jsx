import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import GuestList from '../components/GuestList';
import AddGuestForm from '../components/AddGuestForm';
import { fetchRandomGuest } from '../services/api';
import { saveGuestsToStorage, loadGuestsFromStorage, clearGuestsFromStorage } from '../services/storage';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load guests from storage on component mount
  useEffect(() => {
    const loadGuests = async () => {
      try {
        const savedGuests = await loadGuestsFromStorage();
        setGuests(savedGuests);
      } catch (error) {
        Alert.alert("Error", "Failed to load guest data");
        console.error("Loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadGuests();
  }, []);

  // Save guests to storage whenever guests array changes
  useEffect(() => {
    if (!loading) {
      const saveGuests = async () => {
        try {
          await saveGuestsToStorage(guests);
        } catch (error) {
          Alert.alert("Error", "Failed to save guest data");
          console.error("Saving error:", error);
        }
      };

      saveGuests();
    }
  }, [guests, loading]);

  const addGuest = (name, rsvpStatus) => {
    const newGuest = {
      id: Date.now().toString(),
      name,
      rsvpStatus: rsvpStatus || 'Maybe',
      createdAt: new Date().toISOString(),
    };
    setGuests([...guests, newGuest]);
  };

  const deleteGuest = (id) => {setGuests(guests.filter(guest => guest.id !== id))}
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

  const clearAllGuests = async () => {
    Alert.alert(
      "Clear All Guests",
      "Are you sure you want to delete ALL guests? This cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearGuestsFromStorage();
              setGuests([]);
              Alert.alert("Success", "All guests have been cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear guests");
            }
          }
        }
      ]
    );
  };

  const confirmedGuests = guests.filter(guest => guest.rsvpStatus === 'Yes').length;
  const maybeGuests = guests.filter(guest => guest.rsvpStatus === 'Maybe').length;
  const declinedGuests = guests.filter(guest => guest.rsvpStatus === 'No').length;

  const StatCard = ({ title, value, color, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4A574" />
        <Text style={styles.loadingText}>Loading your guest list...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F4F0" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerContent}>
            <Text style={styles.greeting}>Welcome Back</Text>
            <Text style={styles.title}>Wedding Planner</Text>
            <Text style={styles.subtitle}>Let's make your special day perfect</Text>
          </View>
          <View style={styles.headerDecoration}>
            <View style={styles.decorationCircle} />
            <View style={[styles.decorationCircle, styles.decorationCircleSmall]} />
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Guest Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard 
              title="Total Guests" 
              value={guests.length} 
              color="#D4A574"
              subtitle="invited"
            />
            <StatCard 
              title="Confirmed" 
              value={confirmedGuests} 
              color="#4CAF50"
              subtitle="attending"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard 
              title="Maybe" 
              value={maybeGuests} 
              color="#FF9800"
              subtitle="undecided"
            />
            <StatCard 
              title="Declined" 
              value={declinedGuests} 
              color="#F44336"
              subtitle="not attending"
            />
          </View>
        </View>

        {/* Add Guest Form */}
        <View style={styles.formSection}>
          <AddGuestForm onAddGuest={addGuest} onRandomGuest={handleRandomGuest} />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('GuestList', { 
              guests: guests,
              onDeleteGuest: deleteGuest
            })}
            activeOpacity={0.8}
          >
            <View style={styles.actionContent}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>👥</Text>
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>View All Guests</Text>
                <Text style={styles.actionSubtitle}>
                  Manage your complete guest list
                </Text>
              </View>
              <View style={styles.actionArrow}>
                <Text style={styles.actionArrowText}>›</Text>
              </View>
            </View>
          </TouchableOpacity>

          {guests.length > 0 && (
            <TouchableOpacity 
              style={[styles.actionCard, styles.clearActionCard]}
              onPress={clearAllGuests}
              activeOpacity={0.8}
            >
              <View style={styles.actionContent}>
                <View style={[styles.actionIcon, styles.clearActionIcon]}>
                  <Text style={styles.actionIconText}>🗑️</Text>
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionTitle}>Clear All Guests</Text>
                  <Text style={styles.actionSubtitle}>
                    Remove all guests from your list
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F0',
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 20,
  },

  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  headerContent: {
    flex: 1,
  },

  greeting: {
    fontSize: 16,
    color: '#7A7A7A',
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    fontStyle: 'italic',
  },

  headerDecoration: {
    position: 'relative',
  },

  decorationCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D4A574',
    opacity: 0.1,
  },

  decorationCircleSmall: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.2,
  },

  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 16,
    paddingHorizontal: 4,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  statContent: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 4,
  },

  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    textAlign: 'center',
  },

  statSubtitle: {
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 2,
  },

  formSection: {
    marginBottom: 20,
  },

  actionsSection: {
    paddingHorizontal: 16,
  },

  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },

  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8F4F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  actionIconText: {
    fontSize: 20,
  },

  actionText: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },

  actionSubtitle: {
    fontSize: 14,
    color: '#7A7A7A',
  },

  actionArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionArrowText: {
    fontSize: 20,
    color: '#D4A574',
    fontWeight: '300',
  },
});

export default HomeScreen;