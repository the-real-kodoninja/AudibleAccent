// src/components/PagePreview.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

interface PagePreviewProps {
  pages: string[];
  currentPage: number;
  onPageSelect: (page: number) => void;
}

const PagePreview: React.FC<PagePreviewProps> = ({ pages, currentPage, onPageSelect }) => {
  return (
    <Box
      sx={{
        width: 150,
        bgcolor: themeMode === 'dark' ? '#2A2A2A' : '#E0E0E0',
        p: 1,
        overflowY: 'auto',
        borderRight: '1px solid #8B5523',
      }}
    >
      {pages.map((page, index) => (
        <Box
          key={index}
          onClick={() => onPageSelect(index + 1)}
          sx={{
            mb: 1,
            cursor: 'pointer',
            border: currentPage === index + 1 ? '2px solid #D2B48C' : 'none',
            borderRadius: 1,
          }}
        >
          <img src={page} alt={`Page ${index + 1}`} style={{ width: '100%' }} />
          <Typography sx={{ textAlign: 'center', color: themeMode === 'dark' ? '#A1A1A1' : '#333333', fontSize: '0.8rem' }}>
            Page {index + 1}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PagePreview;