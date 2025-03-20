// src/components/TextReader.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Typography, Box, Button, TextField } from '@mui/material';
import { readAndHighlight } from '../utils/speech';

interface TextReaderProps {
  text: string;
  textSize: number;
  highlightColor: string;
  fontFamily: string;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

const TextReader: React.FC<TextReaderProps> = ({
  text,
  textSize,
  highlightColor,
  fontFamily,
  onPageChange,
  currentPage,
  totalPages,
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    return parseInt(localStorage.getItem(`progress_${text.slice(0, 10)}`) || '0', 10);
  });
  const [searchTerm, setSearchTerm] = useState('');
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('TextReader rendering with text:', text);
    readAndHighlight(text, 1, currentIndex, setCurrentIndex, undefined, () => {
      // On end of reading, move to next page if available
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
        setCurrentIndex(0); // Reset index for the new page
      }
    });
  }, [text, currentIndex, currentPage, totalPages, onPageChange]);

  useEffect(() => {
    localStorage.setItem(`progress_${text.slice(0, 10)}`, currentIndex.toString());
    // Auto-scroll to the highlighted word
    if (textRef.current) {
      const highlighted = textRef.current.querySelector('.highlight') as HTMLElement;
      if (highlighted) {
        textRef.current.scrollTo({ top: highlighted.offsetTop - 50, behavior: 'smooth' });
      }
    }
  }, [currentIndex, text]);

  const handleStartAtCursor = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      const words = text.split(' ');
      const index = words.findIndex((word) => selectedText.includes(word));
      if (index !== -1) {
        setCurrentIndex(index);
        readAndHighlight(text, 1, index, setCurrentIndex);
      }
    }
  };

  const handleSearch = () => {
    if (searchTerm && textRef.current) {
      const words = text.split(' ');
      const index = words.findIndex((word) => word.toLowerCase().includes(searchTerm.toLowerCase()));
      if (index !== -1) {
        setCurrentIndex(index);
        const target = textRef.current.children[index] as HTMLElement;
        textRef.current.scrollTo({ top: target.offsetTop - 50, behavior: 'smooth' });
      } else {
        alert('Text not found');
      }
    }
  };

  const words = text.split(' ').map((word, index) => (
    <span
      key={index}
      className={`word ${index === currentIndex ? 'highlight' : ''}`}
      data-index={index}
      style={{
        fontSize: `${textSize}px`,
        fontFamily,
        ...(index === currentIndex ? { backgroundColor: highlightColor } : {}),
      }}
    >
      {word}{' '}
    </span>
  ));

  return (
    <Box sx={{ p: 2, color: '#A1A1A1', height: '100%', overflowY: 'auto' }} ref={textRef}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous Page
        </Button>
        <Typography>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next Page
        </Button>
        <Button onClick={handleStartAtCursor}>Start at Cursor</Button>
        <TextField
          label="Find Text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ input: { color: '#A1A1A1' }, label: { color: '#A1A1A1' } }}
        />
        <Button onClick={handleSearch}>Find</Button>
      </Box>
      <Typography component="div">{words}</Typography>
    </Box>
  );
};

export default TextReader;