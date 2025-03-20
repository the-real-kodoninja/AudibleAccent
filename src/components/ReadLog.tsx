// src/components/ReadLog.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '../context/ThemeContext';

interface LogEntry {
  fileName: string;
  timestamp: string;
}

const ReadLog: React.FC = () => {
  const [log, setLog] = useState<LogEntry[]>([]);
  const { themeMode } = useTheme();

  useEffect(() => {
    const savedLog = JSON.parse(localStorage.getItem('readLog') || '[]');
    setLog(savedLog);
  }, []);

  return (
    <Box sx={{ p: 2, bgcolor: themeMode === 'dark' ? '#1A1A1A' : '#F5F5F5', color: themeMode === 'dark' ? '#A1A1A1' : '#333333', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#D2B48C', fontWeight: 400 }}>
        Reading History
      </Typography>
      {log.length === 0 ? (
        <Typography>No books read yet.</Typography>
      ) : (
        <List>
          {log.map((entry, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={entry.fileName}
                secondary={new Date(entry.timestamp).toLocaleString()}
                primaryTypographyProps={{ color: '#D2B48C', fontWeight: 500 }}
                secondaryTypographyProps={{ color: themeMode === 'dark' ? '#A1A1A1' : '#333333' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ReadLog;