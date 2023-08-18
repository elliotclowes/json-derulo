import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Assuming 'token' is the key you used in localStorage.

    // If there's no token in local storage, you might want to handle it differently.
    if (!token) {
      console.error('No token found in local storage.');
      navigate('/dash');
      return;
    }

    // Make a GET request to the logout endpoint
    fetch('https://learnt-me.onrender.com/user/logout', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token, // Include the token in the headers
      },
    })
    .then(response => {
      if (response.ok) {
        // If the request is successful, clear local storage
        localStorage.clear();

        // Then redirect to '/dash'
        navigate('/dash');
      } else {
        console.error('Failed to log out. Maybe handle this differently.');
      }
    })
    .catch(error => console.error('There was an error logging out:', error));

  }, [navigate]);

  return (
    <div>Logging you out...</div>
  );
}

export default SignOut;
