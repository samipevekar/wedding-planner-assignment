import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import GuestItem from './GuestItem';
import {
  getGuests,
  deleteGuest,
  getGuestStats,
} from '../services/GuestService';

const GuestList = ({ navigation }) => {
  const [guests, setGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchFocused, setSearchFocused] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    maybe: 0,
    declined: 0,
  });

  // Load guests from service
  useEffect(() => {
    const loadGuestsData = () => {
      const guestsData = getGuests();
      setGuests(guestsData);
      setStats(getGuestStats());
    };

    loadGuestsData();

    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', () => {
      loadGuestsData();
    });

    return unsubscribe;
  }, []);

  const handleDelete = async guestId => {
    await deleteGuest(guestId);
    setGuests(getGuests());
    setStats(getGuestStats());
  };

  // Filter guests
  const filteredGuests = useMemo(() => {
    return guests.filter(guest => {
      const matchesSearch = guest.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === 'All' || guest.rsvpStatus === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [guests, searchQuery, filterStatus]);

  const getFilterConfig = status => {
    const configs = {
      All: { icon: '👥', color: '#D4A574', count: stats.total },
      Yes: { icon: '✅', color: '#4CAF50', count: stats.confirmed },
      Maybe: { icon: '🤔', color: '#FF9800', count: stats.maybe },
      No: { icon: '❌', color: '#F44336', count: stats.declined },
    };
    return configs[status] || configs['All'];
  };

  const EmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <Text style={styles.emptyStateEmoji}>
          {guests.length === 0 ? '💌' : '🔍'}
        </Text>
      </View>
      <Text style={styles.emptyStateTitle}>
        {guests.length === 0 ? 'No Guests Yet' : 'No Results Found'}
      </Text>
      <Text style={styles.emptyStateSubtitle}>
        {guests.length === 0
          ? 'Start building your wedding guest list by adding your first guest!'
          : `No guests match "${searchQuery}" with ${filterStatus} status`}
      </Text>
      {searchQuery && (
        <TouchableOpacity
          style={styles.clearSearchButton}
          onPress={() => setSearchQuery('')}
        >
          <Text style={styles.clearSearchText}>Clear Search</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const FilterButton = ({ status }) => {
    const config = getFilterConfig(status);
    const isSelected = filterStatus === status;

    return (
      <TouchableOpacity
        style={[
          styles.filterButton,
          {
            backgroundColor: isSelected ? config.color : '#FAFAFA',
            borderColor: isSelected ? config.color : '#E8E8E8',
          },
        ]}
        onPress={() => setFilterStatus(status)}
        activeOpacity={0.7}
      >
        <Text style={styles.filterIcon}>{config.icon}</Text>
        <Text
          style={[
            styles.filterButtonText,
            { color: isSelected ? '#FFFFFF' : '#666' },
          ]}
        >
          {status}
        </Text>
        <View
          style={[
            styles.filterCount,
            {
              backgroundColor: isSelected
                ? 'rgba(255,255,255,0.2)'
                : config.color,
            },
          ]}
        >
          <Text
            style={[
              styles.filterCountText,
              { color: isSelected ? '#FFFFFF' : '#FFFFFF' },
            ]}
          >
            {config.count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderText}>
        Showing {filteredGuests.length} of {guests.length} guests
      </Text>
      {searchQuery && (
        <Text style={styles.searchResultsText}>
          Results for "{searchQuery}"
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F4F0" />

      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Guest List</Text>
        <Text style={styles.headerSubtitle}>Manage your wedding guests</Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View
          style={[
            styles.searchContainer,
            { borderColor: searchFocused ? '#D4A574' : '#E8E8E8' },
          ]}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor="#B0B0B0"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchQuery ? (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Filter by RSVP Status</Text>
        <View style={styles.filterContainer}>
          {['All', 'Yes', 'Maybe', 'No'].map(status => (
            <FilterButton key={status} status={status} />
          ))}
        </View>
      </View>

      {/* Guest List */}
      <View style={styles.listContainer}>
        {filteredGuests.length === 0 ? (
          <EmptyState />
        ) : (
          <FlatList
            data={filteredGuests}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) => (
              <GuestItem guest={item} onDelete={handleDelete} index={index} />
            )}
            ListHeaderComponent={<ListHeader />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4F0',
  },

  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    fontStyle: 'italic',
  },

  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#B0B0B0',
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  clearButton: {
    padding: 4,
  },

  clearIcon: {
    fontSize: 14,
    color: '#B0B0B0',
  },

  filterSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },

  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },

  filterButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    minHeight: 70,
    justifyContent: 'center',
  },

  filterIcon: {
    fontSize: 16,
    marginBottom: 4,
  },

  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },

  filterCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },

  filterCountText: {
    fontSize: 11,
    fontWeight: '700',
  },

  listContainer: {
    flex: 1,
  },

  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  listHeaderText: {
    fontSize: 14,
    color: '#7A7A7A',
    fontWeight: '500',
  },

  searchResultsText: {
    fontSize: 12,
    color: '#D4A574',
    fontStyle: 'italic',
    marginTop: 2,
  },

  flatListContent: {
    paddingBottom: 20,
  },

  itemSeparator: {
    height: 4,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },

  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F4F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyStateEmoji: {
    fontSize: 32,
  },

  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
    textAlign: 'center',
  },

  emptyStateSubtitle: {
    fontSize: 14,
    color: '#7A7A7A',
    textAlign: 'center',
    lineHeight: 20,
  },

  clearSearchButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#D4A574',
    borderRadius: 20,
  },

  clearSearchText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default GuestList;
