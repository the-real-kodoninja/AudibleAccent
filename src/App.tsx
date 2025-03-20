// src/App.tsx
import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import TextReader from './components/TextReader';
import WelcomeScreen from './components/WelcomeScreen';
import ReadLog from './components/ReadLog';
import UserPage from './components/UserPage';
import PagePreview from './components/PagePreview';
import { ThemeProvider as MuiThemeProvider, CssBaseline, createTheme, Box, Tabs, Tab } from '@mui/material';
import * as pdfjsLib from 'pdfjs-dist';
import { useTheme } from './context/ThemeContext';

const App: React.FC = () => {
  const { themeMode } = useTheme();
  const [text, setText] = useState<string>('');
  const [tab, setTab] = useState(0);
  const [textSize, setTextSize] = useState<number>(() => parseInt(localStorage.getItem('textSize') || '16', 10));
  const [highlightColor, setHighlightColor] = useState<string>(() => localStorage.getItem('highlightColor') || '#D2B48C');
  const [fontFamily, setFontFamily] = useState<string>(() => localStorage.getItem('fontFamily') || 'Roboto');
  const [pages, setPages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const theme = createTheme({
    palette: {
      mode: themeMode,
      background: { default: themeMode === 'dark' ? '#1A1A1A' : '#F5F5F5' },
      text: { primary: themeMode === 'dark' ? '#A1A1A1' : '#333333' },
      primary: { main: '#8B5523' },
      secondary: { main: '#D2B48C' },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h6: { color: themeMode === 'dark' ? '#A1A1A1' : '#333333' },
    },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 0, textTransform: 'none', padding: '8px 16px' } } },
      MuiSelect: { styleOverrides: { root: { borderRadius: 0 } } },
      MuiTabs: { styleOverrides: { root: { backgroundColor: themeMode === 'dark' ? '#1A1A1A' : '#F5F5F5' } } },
      MuiTab: {
        styleOverrides: {
          root: {
            color: themeMode === 'dark' ? '#A1A1A1' : '#333333',
            '&.Mui-selected': { color: '#D2B48C' },
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': { backgroundColor: themeMode === 'dark' ? '#2A2A2A' : '#FFFFFF' },
            '& .MuiInputLabel-root': { color: themeMode === 'dark' ? '#A1A1A1' : '#333333' },
          },
        },
      },
    },
  });

  useEffect(() => {
    localStorage.setItem('textSize', textSize.toString());
  }, [textSize]);

  useEffect(() => {
    localStorage.setItem('highlightColor', highlightColor);
  }, [highlightColor]);

  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
  }, [fontFamily]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleSetText = (newText: string) => {
    console.log('Setting text in App:', newText);
    setText(newText);
  };

  const handleFileLoad = async (file: File) => {
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const pageImages: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
        pageImages.push(canvas.toDataURL('image/png'));
      }
      setPages(pageImages);
      setCurrentPage(1);
    } else {
      setPages([]);
      setCurrentPage(1);
    }
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <TopBar setText={handleSetText} onFileLoad={handleFileLoad} />
      <Tabs value={tab} onChange={handleTabChange} centered sx={{ borderBottom: '1px solid #8B5523' }}>
        <Tab label="Reader" />
        <Tab label="Read Log" />
        <Tab label="User" />
      </Tabs>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 112px)' }}>
        {tab === 0 && pages.length > 0 && (
          <PagePreview pages={pages} currentPage={currentPage} onPageSelect={setCurrentPage} />
        )}
        <Box sx={{ flex: 1, overflowY: 'auto' }}>
          {tab === 0 &&
            (text ? (
              <TextReader
                text={text}
                textSize={textSize}
                highlightColor={highlightColor}
                fontFamily={fontFamily}
                onPageChange={setCurrentPage}
                currentPage={currentPage}
                totalPages={pages.length || 1}
              />
            ) : (
              <WelcomeScreen />
            ))}
          {tab === 1 && <ReadLog />}
          {tab === 2 && (
            <UserPage
              setTextSize={setTextSize}
              setHighlightColor={setHighlightColor}
              setFontFamily={setFontFamily}
            />
          )}
        </Box>
      </Box>
    </MuiThemeProvider>
  );
};

export default App;