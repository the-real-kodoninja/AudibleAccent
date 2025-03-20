import React from 'react';
import { Box, Typography } from '@mui/material';

const WelcomeScreen: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 64px)' }}>
    <Typography sx={{ color: '#A1A1A1', mb: 2 }}>
      Welcome to AudibleAccent! Upload a PDF, EPUB, or text file to start.
    </Typography>
    <Typography sx={{ color: '#8B5523', fontSize: '2rem' }}>📤</Typography>
  </Box>
);

export default WelcomeScreen;