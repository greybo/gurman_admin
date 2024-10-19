import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    age: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const idToken = await currentUser.getIdToken(true);
      const response = await fetch('http://localhost:3035/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: currentUser.uid,
          dataObject: userData
        })
      });
      
      if (response.ok) {
        setMessage('Profile updated successfully');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/');
    } catch {
      setError('Failed to log out');
    }
  }

  return (
    <div>
      <h2>Profile</h2>
      {error && <p>{error}</p>}
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userData.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={userData.age}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
        />
        <button type="submit">Update Profile</button>
      </form>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export default Profile;