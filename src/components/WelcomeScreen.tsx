// client/src/components/WelcomeScreen.tsx
import React, { useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { UploadFile } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const WelcomeScreen: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { themeMode } = useTheme();

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        bgcolor: themeMode === 'dark' ? '#1A1A1A' : '#FFFFFF',
        borderRadius: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        p: 4,
      }}
    >
      <Typography variant="h5" sx={{ color: themeMode === 'dark' ? '#E0E0E0' : '#333333', mb: 3, fontWeight: 500, textAlign: 'center' }}>
        Welcome to AudibleAccent!
      </Typography>
      <Typography sx={{ color: themeMode === 'dark' ? '#A1A1A1' : '#666666', mb: 3, textAlign: 'center' }}>
        Upload a PDF, EPUB, or text file to start reading with text-to-speech.
      </Typography>
      <IconButton onClick={handleIconClick} sx={{ bgcolor: themeMode === 'dark' ? '#2A2A2A' : '#F0F0F0', '&:hover': { bgcolor: themeMode === 'dark' ? '#3A3A3A' : '#E0E0E0' } }}>
        <UploadFile sx={{ fontSize: 40, color: '#8B5523' }} />
      </IconButton>
      <input
        type="file"
        accept=".pdf,.epub,.txt"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const event = new Event('change', { bubbles: true });
            Object.defineProperty(event, 'target', { value: e.target, enumerable: true });
            document.querySelector('input[type="file"]')?.dispatchEvent(event);
          }
        }}
      />
    </Box>
  );
};

export default WelcomeScreen;