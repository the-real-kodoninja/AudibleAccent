import React, { useState } from 'react';
import TopBar from './components/TopBar';
import TextReader from './components/TextReader';
import WelcomeScreen from './components/WelcomeScreen';
import ReadLog from './components/ReadLog';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';

const theme = createTheme({
  palette: {
    background: { default: '#1A1A1A' },
    text: { primary: '#A1A1A1' },
    primary: { main: '#8B5523' },
    secondary: { main: '#D2B48C' },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: { color: '#A1A1A1' },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 0, textTransform: 'none' } } },
    MuiSelect: { styleOverrides: { root: { borderRadius: 0 } } },
  },
});

const App: React.FC = () => {
  const [text, setText] = useState<string>('');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar setText={setText} />
      <Box sx={{ display: 'flex', flexDirection: 'row', height: 'calc(100vh - 64px)' }}>
        <Box sx={{ flex: 1 }}>{text ? <TextReader text={text} /> : <WelcomeScreen />}</Box>
        <Box sx={{ width: '300px', overflowY: 'auto' }}>
          <ReadLog />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;