// client/src/components/TopBar.tsx
import React, { useState, useEffect, useRef } from 'react';
import { parseFile } from '../utils/fileParser';
import { readAndHighlight } from '../utils/speech';
import { AppBar, Toolbar, Button, Select, MenuItem, Input, IconButton } from '@mui/material';
import { PlayArrow, Pause, Save, UploadFile } from '@mui/icons-material';
import { useTheme } from '../context/ThemeContext';

const TopBar: React.FC<{ setText: (text: string) => void; onFileLoad: (file: File) => void }> = ({ setText, onFileLoad }) => {
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [text, setLocalText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { themeMode } = useTheme();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) setSelectedVoice(availableVoices[0].name);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        console.log('Uploading file:', file.name);
        const parsedText = await parseFile(file);
        console.log('Setting text in TopBar:', parsedText);
        setText(parsedText);
        setLocalText(parsedText);
        setIsPlaying(true);
        readAndHighlight(parsedText, speed, 0, () => {}, selectedVoice);
        const log = JSON.parse(localStorage.getItem('readLog') || '[]');
        log.unshift({ fileName: file.name, timestamp: new Date().toISOString() });
        localStorage.setItem('readLog', JSON.stringify(log));
        onFileLoad(file);
      } catch (error: any) {
        console.error('Upload error:', error);
        alert(`Failed to parse file: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const saveProgress = () => {
    const currentIndex = parseInt(
      localStorage.getItem(`progress_${text.slice(0, 10)}`) || '0',
      10
    );
    alert(`Progress saved at word ${currentIndex}`);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: themeMode === 'dark' ? '#1A1A1A' : '#FFFFFF', borderBottom: '1px solid #8B5523', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Toolbar sx={{ justifyContent: 'center', gap: 2, py: 1 }}>
        <IconButton onClick={togglePlayPause} color="primary" sx={{ bgcolor: themeMode === 'dark' ? '#2A2A2A' : '#F0F0F0', borderRadius: 4 }}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <Select
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value as string))}
          sx={{ color: '#D2B48C', backgroundColor: themeMode === 'dark' ? '#2A2A2A' : '#FFFFFF', borderRadius: 4, height: 40 }}
        >
          <MenuItem value={0.5}>0.5x</MenuItem>
          <MenuItem value={1}>1x</MenuItem>
          <MenuItem value={2}>2x</MenuItem>
        </Select>
        <Select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value as string)}
          sx={{ color: '#D2B48C', backgroundColor: themeMode === 'dark' ? '#2A2A2A' : '#FFFFFF', borderRadius: 4, height: 40, minWidth: 150 }}
        >
          {voices.map((voice) => (
            <MenuItem key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </MenuItem>
          ))}
        </Select>
        <Button
          color="primary"
          variant="contained"
          onClick={handleFileButtonClick}
          startIcon={<UploadFile />}
          sx={{ borderRadius: 4 }}
        >
          Upload File
        </Button>
        <Input
          type="file"
          inputProps={{ accept: '.pdf,.epub,.txt' }}
          onChange={handleUpload}
          inputRef={fileInputRef}
          sx={{ display: 'none' }}
        />
        <IconButton onClick={saveProgress} color="primary" sx={{ bgcolor: themeMode === 'dark' ? '#2A2A2A' : '#F0F0F0', borderRadius: 4 }}>
          <Save />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;