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
  ActivityIndicator
} from 'react-native';
import GuestList from '../components/GuestList';
import AddGuestForm from '../components/AddGuestForm';
import { fetchRandomGuest } from '../services/api';
import { loadGuests, addGuest, deleteGuest, clearAllGuests, getGuestStats, getGuests } from '../services/GuestService';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, maybe: 0, declined: 0 });

  // Load guests from service on component mount
  useEffect(() => {
    const initializeGuests = async () => {
      try {
        await loadGuests();
        updateStats();
      } catch (error) {
        Alert.alert("Error", "Failed to load guest data");
        console.error("Loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeGuests();
  }, []);

  // ✅ ADD THIS: Refresh when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      updateStats();
    });

    return unsubscribe;
  }, [navigation]);

  const updateStats = () => {
    setStats(getGuestStats());
  };

  const handleAddGuest = async (name, rsvpStatus) => {
    await addGuest(name, rsvpStatus);
    updateStats();
  };

  const handleDeleteGuest = async (id) => {
    await deleteGuest(id);
    updateStats();
  };

  const [randomGuestLoading, setRandomGuestLoadin] = useState(false)

  const handleRandomGuest = async () => {
    setRandomGuestLoadin(true)
    try {
      const randomName = await fetchRandomGuest();
      await handleAddGuest(randomName, 'Maybe');
    } catch (error) {
      Alert.alert("Error", "Failed to fetch random guest. Please try again.");
    } finally {
      setRandomGuestLoadin(false)
    }
  };

  const handleClearAllGuests = async () => {
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
              await clearAllGuests();
              updateStats();
              Alert.alert("Success", "All guests have been cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear guests");
            }
          }
        }
      ]
    );
  };

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
              value={stats.total} 
              color="#D4A574"
              subtitle="invited"
            />
            <StatCard 
              title="Confirmed" 
              value={stats.confirmed} 
              color="#4CAF50"
              subtitle="attending"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard 
              title="Maybe" 
              value={stats.maybe} 
              color="#FF9800"
              subtitle="undecided"
            />
            <StatCard 
              title="Declined" 
              value={stats.declined} 
              color="#F44336"
              subtitle="not attending"
            />
          </View>
        </View>

        {/* Add Guest Form */}
        <View style={styles.formSection}>
          <AddGuestForm onAddGuest={handleAddGuest} onRandomGuest={handleRandomGuest} />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('GuestList')}
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

          {stats.total > 0 && (
            <TouchableOpacity 
              style={[styles.actionCard, styles.clearActionCard]}
              onPress={handleClearAllGuests}
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