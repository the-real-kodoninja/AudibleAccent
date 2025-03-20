// src/components/UserPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

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
  const [editUser, setEditUser] = useState<UserData>({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const log = JSON.parse(localStorage.getItem('readLog') || '[]');
    const updatedUser = { ...user, booksRead: log.length, lastLogin: new Date().toISOString() };
    setUser(updatedUser);
    setEditUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  }, []);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setEditUser({ ...editUser, [field]: value });
  };

  const saveChanges = () => {
    setUser(editUser);
    localStorage.setItem('userData', JSON.stringify(editUser));
    setIsEditing(false);
  };

  const resetStats = () => {
    const updatedUser = { ...user, booksRead: 0 };
    setUser(updatedUser);
    setEditUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    localStorage.setItem('readLog', '[]');
  };

  return (
    <Box sx={{ p: 2, bgcolor: '#1A1A1A', color: '#A1A1A1', height: 'calc(100vh - 112px)' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#D2B48C' }}>
        User Profile
      </Typography>
      {isEditing ? (
        <>
          <TextField
            label="Name"
            value={editUser.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            fullWidth
            sx={{ mb: 2, input: { color: '#A1A1A1' }, label: { color: '#A1A1A1' } }}
            InputProps={{ style: { backgroundColor: '#2A2A2A' } }}
          />
          <TextField
            label="Books Read"
            type="number"
            value={editUser.booksRead}
            onChange={(e) => handleInputChange('booksRead', e.target.value)}
            fullWidth
            sx={{ mb: 2, input: { color: '#A1A1A1' }, label: { color: '#A1A1A1' } }}
            InputProps={{ style: { backgroundColor: '#2A2A2A' } }}
          />
          <TextField
            label="Last Login"
            value={editUser.lastLogin}
            onChange={(e) => handleInputChange('lastLogin', e.target.value)}
            fullWidth
            sx={{ mb: 2, input: { color: '#A1A1A1' }, label: { color: '#A1A1A1' } }}
            InputProps={{ style: { backgroundColor: '#2A2A2A' } }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={saveChanges}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Typography>Name: {user.name}</Typography>
          <Typography>Books Read: {user.booksRead}</Typography>
          <Typography>Last Login: {new Date(user.lastLogin).toLocaleString()}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, mr: 1 }}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={resetStats}
          >
            Reset Reading Stats
          </Button>
        </>
      )}
    </Box>
  );
};

export default UserPage;