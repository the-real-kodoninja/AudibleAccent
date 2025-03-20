import React, { useState } from 'react';
import { parseFile } from '../utils/fileParser';
import { readAndHighlight } from '../utils/speech';
import { AppBar, Toolbar, Button, Select, MenuItem, Input } from '@mui/material';

const TopBar: React.FC<{ setText: (text: string) => void }> = ({ setText }) => {
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const text = await parseFile(file);
        setText(text);
        setIsPlaying(true);
        readAndHighlight(text, speed);
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
        <Input
          type="file"
          inputProps={{ accept: '.pdf,.epub,.txt' }}
          onChange={handleUpload}
          sx={{ color: '#D2B48C' }}
        />
        <Button color="primary" variant="contained">
          Save
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;