// src/components/UserPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Slider, Input, Select, MenuItem, Switch } from '@mui/material';

interface UserData {
  name: string;
  booksRead: number;
  lastLogin: string;
  avatar?: string;
}

interface UserPageProps {
  setThemeMode: (mode: 'light' | 'dark') => void;
  setTextSize: (size: number) => void;
  setHighlightColor: (color: string) => void;
  setFontFamily: (font: string) => void;
}

const UserPage: React.FC<UserPageProps> = ({ setThemeMode, setTextSize, setHighlightColor, setFontFamily }) => {
  const [user, setUser] = useState<UserData>(() => {
    const savedUser = localStorage.getItem('userData');
    return savedUser
      ? JSON.parse(savedUser)
      : { name: 'Guest', booksRead: 0, lastLogin: new Date().toISOString() };
  });
  const [editUser, setEditUser] = useState<UserData>({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [textSize, setLocalTextSize] = useState<number>(() => parseInt(localStorage.getItem('textSize') || '16', 10));
  const [highlightColor, setLocalHighlightColor] = useState<string>(() => localStorage.getItem('highlightColor') || '#D2B48C');
  const [fontFamily, setLocalFontFamily] = useState<string>(() => localStorage.getItem('fontFamily') || 'Roboto');
  const [themeMode, setLocalThemeMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('themeMode') as 'light' | 'dark') || 'dark');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setTextSize(textSize);
    setHighlightColor(highlightColor);
    setFontFamily(fontFamily);
    setThemeMode(themeMode);
    setIsEditing(false);
  };

  const resetStats = () => {
    const updatedUser = { ...user, booksRead: 0 };
    setUser(updatedUser);
    setEditUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    localStorage.setItem('readLog', '[]');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const avatarData = reader.result as string;
        const updatedUser = { ...editUser, avatar: avatarData };
        setEditUser(updatedUser);
        setUser(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextSizeChange = (_event: Event, newValue: number | number[]) => {
    setLocalTextSize(newValue as number);
  };

  const handleHighlightColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalHighlightColor(e.target.value);
  };

  const handleFontChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setLocalFontFamily(e.target.value as string);
  };

  const handleThemeChange = () => {
    setLocalThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  return (
    <Box sx={{ p: 2, bgcolor: themeMode === 'dark' ? '#1A1A1A' : '#F5F5F5', color: themeMode === 'dark' ? '#A1A1A1' : '#333333', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#D2B48C', fontWeight: 400 }}>
        User Profile
      </Typography>
      {user.avatar && (
        <Box sx={{ mb: 2 }}>
          <img src={user.avatar} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%' }} />
        </Box>
      )}
      {isEditing ? (
        <>
          <TextField
            label="Name"
            value={editUser.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Books Read"
            type="number"
            value={editUser.booksRead}
            onChange={(e) => handleInputChange('booksRead', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Last Login"
            value={editUser.lastLogin}
            onChange={(e) => handleInputChange('lastLogin', e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => fileInputRef.current?.click()}
            sx={{ mb: 2 }}
          >
            Upload Avatar
          </Button>
          <Input
            type="file"
            inputProps={{ accept: 'image/*' }}
            inputRef={fileInputRef}
            onChange={handleAvatarUpload}
            sx={{ display: 'none' }}
          />
          <Typography sx={{ mb: 1 }}>Text Size: {textSize}px</Typography>
          <Slider
            value={textSize}
            onChange={handleTextSizeChange}
            min={12}
            max={32}
            step={1}
            sx={{ mb: 2, color: '#8B5523' }}
          />
          <Typography sx={{ mb: 1 }}>Highlight Color</Typography>
          <Input
            type="color"
            value={highlightColor}
            onChange={handleHighlightColorChange}
            sx={{ mb: 2 }}
          />
          <Typography sx={{ mb: 1 }}>Font Family</Typography>
          <Select
            value={fontFamily}
            onChange={handleFontChange}
            fullWidth
            sx={{ mb: 2, color: themeMode === 'dark' ? '#A1A1A1' : '#333333' }}
          >
            <MenuItem value="Roboto">Roboto</MenuItem>
            <MenuItem value="Arial">Arial</MenuItem>
            <MenuItem value="Times New Roman">Times New Roman</MenuItem>
            <MenuItem value="Georgia">Georgia</MenuItem>
          </Select>
          <Typography sx={{ mb: 1 }}>Theme</Typography>
          <Switch
            checked={themeMode === 'dark'}
            onChange={handleThemeChange}
            sx={{ mb: 2 }}
          />
          <Typography sx={{ mb: 1 }}>{themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</Typography>
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
          <Typography>Text Size: {textSize}px</Typography>
          <Typography>
            Highlight Color: <span style={{ color: highlightColor }}>{highlightColor}</span>
          </Typography>
          <Typography>Font Family: {fontFamily}</Typography>
          <Typography>Theme: {themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</Typography>
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