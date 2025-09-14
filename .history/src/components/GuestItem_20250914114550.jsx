// src/components/GuestItem.js
import React,{useEffect, useRef} from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions 
} from 'react-native';

const { width } = Dimensions.get('window');

const GuestItem = ({ guest, onDelete, index = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getStatusConfig = () => {
    switch (guest.rsvpStatus) {
      case 'Yes': 
        return {
          color: '#4CAF50',
          backgroundColor: '#E8F5E8',
          icon: '✅',
          label: 'Confirmed'
        };
      case 'No': 
        return {
          color: '#F44336',
          backgroundColor: '#FFF0F0',
          icon: '❌',
          label: 'Declined'
        };
      case 'Maybe': 
        return {
          color: '#FF9800',
          backgroundColor: '#FFF8E1',
          icon: '🤔',
          label: 'Maybe'
        };
      default: 
        return {
          color: '#9E9E9E',
          backgroundColor: '#F5F5F5',
          icon: '❓',
          label: 'Unknown'
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleDelete = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 100,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDelete(guest.id);
    });
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }]
        }
      ]}
    >
      {/* Guest Avatar Circle */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: statusConfig.backgroundColor }]}>
          <Text style={[styles.avatarText, { color: statusConfig.color }]}>
            {guest.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: statusConfig.color }]} />
      </View>

      {/* Guest Information */}
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.name} numberOfLines={1}>{guest.name}</Text>
          <Text style={styles.guestId}>#{guest.id.slice(-4)}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusBadge, 
            { 
              backgroundColor: statusConfig.backgroundColor,
              borderColor: statusConfig.color 
            }
          ]}>
            <Text style={styles.statusIcon}>{statusConfig.icon}</Text>
            <Text style={[styles.statusText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* <TouchableOpacity 
          style={styles.editButton}
          activeOpacity={0.7}
          onPress={() => {/* Handle edit functionality */}}
        >
          <Text style={styles.editIcon}>✏️</Text>
        {/* </TouchableOpacity> */} */}

        <TouchableOpacity 
          style={styles.deleteButton}
          activeOpacity={0.7}
          onPress={handleDelete}
        >
          <View style={styles.deleteIconContainer}>
            <Text style={styles.deleteIcon}>🗑️</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Decorative Elements */}
      <View style={styles.decorativeElement} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#D4A574',
    position: 'relative',
    overflow: 'hidden',
  },

  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },

  statusIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  nameContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    flex: 1,
  },

  guestId: {
    fontSize: 12,
    color: '#9E9E9E',
    fontWeight: '400',
    marginLeft: 8,
  },

  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },

  statusIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },

  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },

  editButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F8F4F0',
  },

  editIcon: {
    fontSize: 16,
  },

  deleteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#FFF0F0',
  },

  deleteIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteIcon: {
    fontSize: 16,
  },

  decorativeElement: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    backgroundColor: '#D4A574',
    opacity: 0.05,
    borderBottomLeftRadius: 20,
  },
});

export default GuestItem;