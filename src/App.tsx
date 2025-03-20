// src/App.tsx
import React, { useState } from 'react';
import TopBar from './components/TopBar';
import TextReader from './components/TextReader';
import WelcomeScreen from './components/WelcomeScreen';
import ReadLog from './components/ReadLog';
import UserPage from './components/UserPage';
import { CssBaseline, ThemeProvider, createTheme, Box, Tabs, Tab } from '@mui/material';

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
    MuiTabs: { styleOverrides: { root: { backgroundColor: '#1A1A1A' } } },
    MuiTab: { styleOverrides: { root: { color: '#A1A1A1', '&.Mui-selected': { color: '#D2B48C' } } } },
  },
});

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [tab, setTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar setText={setText} />
      <Tabs value={tab} onChange={handleTabChange} centered sx={{ borderBottom: '1px solid #8B5523' }}>
        <Tab label="Reader" />
        <Tab label="Read Log" />
        <Tab label="User" />
      </Tabs>
      <Box sx={{ height: 'calc(100vh - 112px)', overflowY: 'auto' }}>
        {tab === 0 && (text ? <TextReader text={text} /> : <WelcomeScreen />)}
        {tab === 1 && <ReadLog />}
        {tab === 2 && <UserPage />}
      </Box>
    </ThemeProvider>
  );
};

export default App;