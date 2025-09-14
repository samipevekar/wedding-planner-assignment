export const fetchRandomGuest = async () => {
  try {
    const response = await fetch('https://randomuser.me/api/');
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    const user = data.results[0];
    return `${user.name.first} ${user.name.last}`;
  } catch (error) {
    console.error('Error fetching random guest:', error);
    throw new Error('Failed to fetch random guest. Please check your internet connection.');
  }
};