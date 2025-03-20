// src/components/WelcomeScreen.tsx
import React, { useRef } from 'react';
import { Box, Typography, IconButton } from '@mui/material';

const WelcomeScreen: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        height: 'calc(100vh - 112px)',
        bgcolor: '#1A1A1A',
      }}
    >
      <Typography variant="h6" sx={{ color: '#A1A1A1', mb: 2 }}>
        Welcome to AudibleAccent! Upload a PDF, EPUB, or text file to start.
      </Typography>
      <IconButton onClick={handleIconClick}>
        <Typography sx={{ color: '#8B5523', fontSize: '2.5rem' }}>📤</Typography>
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