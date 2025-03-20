// src/components/TopBar.tsx (just confirming)
import React, { useState, useEffect } from 'react';
import { parseFile } from '../utils/fileParser';
import { readAndHighlight } from '../utils/speech';
import { AppBar, Toolbar, Button, Select, MenuItem, Input } from '@mui/material';

const TopBar: React.FC<{ setText: (text: string) => void }> = ({ setText }) => {
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

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
        const text = await parseFile(file);
        setText(text);
        setIsPlaying(true);
        readAndHighlight(text, speed, 0, () => {}, selectedVoice);
        const log = JSON.parse(localStorage.getItem('readLog') || '[]');
        log.unshift({ fileName: file.name, timestamp: new Date().toISOString() });
        localStorage.setItem('readLog', JSON.stringify(log));
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Failed to parse file. Please try a supported format (PDF, EPUB, TXT).');
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

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1A1A1A', borderBottom: '1px solid #8B5523' }}>
      <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
        <Button onClick={togglePlayPause} color="primary" variant="contained">
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Select
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value as string))}
          sx={{ color: '#D2B48C', backgroundColor: '#A1A1A1' }}
        >
          <MenuItem value={0.5}>0.5x</MenuItem>
          <MenuItem value={1}>1x</MenuItem>
          <MenuItem value={2}>2x</MenuItem>
        </Select>
        <Select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value as string)}
          sx={{ color: '#D2B48C', backgroundColor: '#A1A1A1', minWidth: 150 }}
        >
          {voices.map((voice) => (
            <MenuItem key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </MenuItem>
          ))}
        </Select>
        <Input
          type="file"
          inputProps={{ accept: '.pdf,.epub,.txt' }}
          onChange={handleUpload}
          sx={{ color: '#D2B48C' }}
        />
        <Button onClick={saveProgress} color="primary" variant="contained">
          Save
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;