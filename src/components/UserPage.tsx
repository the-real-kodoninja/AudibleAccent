// src/components/UserPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';

interface UserData {
  name: string;
  booksRead: number;
  lastLogin: string;
}

const UserPage: React.FC = () => {
  const [user, setUser] = useState<UserData>(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser
      ? JSON.parse(savedUser)
      : { name: 'Guest', booksRead: 0, lastLogin: new Date().toISOString() };
  });

  useEffect(() => {
    const log = JSON.parse(localStorage.getItem('readLog') || '[]');
    const updatedUser = { ...user, booksRead: log.length, lastLogin: new Date().toISOString() };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  }, []);

  const resetStats = () => {
    const updatedUser = { ...user, booksRead: 0 };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    localStorage.setItem('readLog', '[]');
  };

  return (
    <Box sx={{ p: 2, bgcolor: '#1A1A1A', color: '#A1A1A1', height: 'calc(100vh - 64px)' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#D2B48C' }}>
        User Profile
      </Typography>
      <Typography>Name: {user.name}</Typography>
      <Typography>Books Read: {user.booksRead}</Typography>
      <Typography>Last Login: {new Date(user.lastLogin).toLocaleString()}</Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={resetStats}
      >
        Reset Reading Stats
      </Button>
    </Box>
  );
};

export default UserPage;