// src/components/TextReader.tsx
import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { readAndHighlight } from '../utils/speech';

interface TextReaderProps {
  text: string;
}

const TextReader: React.FC<TextReaderProps> = ({ text }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    return parseInt(localStorage.getItem(`progress_${text.slice(0, 10)}`) || '0', 10);
  });

  useEffect(() => {
    readAndHighlight(text, 1, currentIndex, setCurrentIndex);
  }, [text]);

  useEffect(() => {
    localStorage.setItem(`progress_${text.slice(0, 10)}`, currentIndex.toString());
  }, [currentIndex, text]);

  const words = text.split(' ').map((word, index) => (
    <span
      key={index}
      className={`word ${index === currentIndex ? 'highlight' : ''}`}
      data-index={index}
    >
      {word}{' '}
    </span>
  ));

  return (
    <Typography component="div" sx={{ p: 2, color: '#A1A1A1' }}>
      {words}
    </Typography>
  );
};

export default TextReader;