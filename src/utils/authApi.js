// Add this file: authApi.js
// Create a utility file for authenticated API requests

const authApi = {
    // Get the authentication token from local storage
    getToken: () => {
      return localStorage.getItem('token');
    },
    
    // Make an authenticated API request
    fetch: async (url, options = {}) => {
      const token = authApi.getToken();
      
      // Set up headers with authentication token
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      // Make the fetch request with the token
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      // Handle token expiration
      if (response.status === 401) {
        // Option 1: Redirect to login
        // window.location.href = '/login';
        
        // Option 2: Try to refresh token (if you have refresh token logic)
        // const refreshed = await authApi.refreshToken();
        // if (refreshed) {
        //   return authApi.fetch(url, options);
        // } else {
        //   window.location.href = '/login';
        // }
      }
      
      return response;
    },
    
    // Example of a refresh token implementation
    refreshToken: async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message);
        
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        
        return true;
      } catch (error) {
        console.error('Failed to refresh token:', error);
        return false;
      }
    },
    
    // Logout function
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  };
  
  export default authApi;
  
  // Example usage in a protected component:
  // import authApi from './authApi';
  // 
  // const fetchUserData = async () => {
  //   try {
  //     const response = await authApi.fetch('http://localhost:5000/api/user/profile');
  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.message);
  //     setUserData(data);
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // };