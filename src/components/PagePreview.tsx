// client/src/components/PagePreview.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

interface PagePreviewProps {
  pages: string[];
  currentPage: number;
  onPageSelect: (page: number) => void;
}

const PagePreview: React.FC<PagePreviewProps> = ({ pages, currentPage, onPageSelect }) => {
  const { themeMode } = useTheme();

  return (
    <Box
      sx={{
        width: 180,
        bgcolor: themeMode === 'dark' ? '#1A1A1A' : '#E0E0E0',
        p: 2,
        overflowY: 'auto',
        borderRight: '1px solid #8B5523',
        boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
      }}
    >
      {pages.map((page, index) => (
        <Box
          key={index}
          onClick={() => onPageSelect(index + 1)}
          sx={{
            mb: 2,
            cursor: 'pointer',
            border: currentPage === index + 1 ? '2px solid #D2B48C' : '1px solid transparent',
            borderRadius: 2,
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: '#D2B48C',
              transform: 'scale(1.02)',
            },
          }}
        >
          <img src={page} alt={`Page ${index + 1}`} style={{ width: '100%', borderRadius: 2 }} />
          <Typography
            sx={{
              textAlign: 'center',
              color: themeMode === 'dark' ? '#E0E0E0' : '#333333',
              fontSize: '0.9rem',
              mt: 0.5,
            }}
          >
            Page {index + 1}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default PagePreview;