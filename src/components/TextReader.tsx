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
  const [pageTexts, setPageTexts] = useState<string[]>([]);

  useEffect(() => {
    const pages = text.split('\n').filter(page => page.trim() !== '');
    console.log('Split pages:', pages);
    setPageTexts(pages);
    setCurrentIndex(0);
  }, [text]);

  const currentPageText = pageTexts[currentPage - 1] || '';

  useEffect(() => {
    if (currentPageText) {
      console.log('TextReader rendering page:', currentPage, 'text:', currentPageText);
      readAndHighlight(
        currentPageText,
        1,
        currentIndex,
        setCurrentIndex,
        undefined,
        () => {
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
            setCurrentIndex(0);
          }
        }
      );
    } else {
      console.warn('Current page text is empty for page:', currentPage);
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1);
      }
    }
  }, [currentPageText, currentIndex, currentPage, totalPages, onPageChange]);

  useEffect(() => {
    localStorage.setItem(`progress_${text.slice(0, 10)}`, currentIndex.toString());
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
      const words = currentPageText.split(' ');
      const index = words.findIndex((word) => selectedText.includes(word));
      if (index !== -1) {
        setCurrentIndex(index);
        readAndHighlight(currentPageText, 1, index, setCurrentIndex);
      }
    }
  };

  const handleSearch = () => {
    if (searchTerm && textRef.current) {
      const words = currentPageText.split(' ');
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

  if (!currentPageText) {
    return (
      <Box sx={{ p: 2, color: '#A1A1A1', height: '100%', overflowY: 'auto' }}>
        <Typography>No content available for this page.</Typography>
      </Box>
    );
  }

  const words = currentPageText.split(' ').map((word, index) => (
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