import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { readAndHighlight } from '../utils/speech';

const TextReader: React.FC<{ text: string }> = ({ text }) => {
  useEffect(() => {
    readAndHighlight(text, 1);
  }, [text]);

  const words = text.split(' ').map((word, index) => (
    <span key={index} className="word" data-index={index}>
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