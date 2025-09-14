// src/services/GuestService.js
import { saveGuestsToStorage, loadGuestsFromStorage, clearGuestsFromStorage } from './storage';

// Global guests state (singleton pattern)
let guests = [];

// Load guests from storage
export const loadGuests = async () => {
  try {
    guests = await loadGuestsFromStorage();
    return guests;
  } catch (error) {
    console.error('Error loading guests:', error);
    return [];
  }
};

// Get current guests
export const getGuests = () => [...guests]; // Return copy to prevent direct mutation

// Add a new guest
export const addGuest = async (name, rsvpStatus = 'Maybe') => {
  const newGuest = {
    id: Date.now().toString(),
    name,
    rsvpStatus,
    createdAt: new Date().toISOString(),
  };
  
  guests = [...guests, newGuest];
  await saveGuestsToStorage(guests);
  return newGuest;
};

// Delete a guest
export const deleteGuest = async (guestId) => {
  guests = guests.filter(guest => guest.id !== guestId);
  await saveGuestsToStorage(guests);
  return true;
};

// Clear all guests
export const clearAllGuests = async () => {
  guests = [];
  await clearGuestsFromStorage();
  return true;
};

// Update a guest
export const updateGuest = async (guestId, updates) => {
  guests = guests.map(guest => 
    guest.id === guestId ? { ...guest, ...updates } : guest
  );
  await saveGuestsToStorage(guests);
  return true;
};

// Get guest by ID
export const getGuestById = (guestId) => {
  return guests.find(guest => guest.id === guestId);
};

// Get statistics
export const getGuestStats = () => {
  const total = guests.length;
  const confirmed = guests.filter(g => g.rsvpStatus === 'Yes').length;
  const maybe = guests.filter(g => g.rsvpStatus === 'Maybe').length;
  const declined = guests.filter(g => g.rsvpStatus === 'No').length;
  
  return { total, confirmed, maybe, declined };
};