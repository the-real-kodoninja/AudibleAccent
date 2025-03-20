import React, { useState } from 'react';
import TopBar from './components/TopBar';
import TextReader from './components/TextReader';
import WelcomeScreen from './components/WelcomeScreen';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    background: { default: '#1A1A1A' },
    text: { primary: '#A1A1A1' },
    primary: { main: '#8B5523' }, // Cork
    secondary: { main: '#D2B48C' }, // Tan
  },
});

const App: React.FC = () => {
  const [text, setText] = useState<string>('');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar setText={setText} />
      {text ? <TextReader text={text} /> : <WelcomeScreen />}
    </ThemeProvider>
  );
};

export default App;