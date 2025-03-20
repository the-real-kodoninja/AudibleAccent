// src/components/ReadLog.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

interface LogEntry {
  fileName: string;
  timestamp: string;
}

const ReadLog: React.FC = () => {
  const [log, setLog] = useState<LogEntry[]>([]);

  useEffect(() => {
    const savedLog = JSON.parse(localStorage.getItem('readLog') || '[]');
    setLog(savedLog);
  }, []);

  return (
    <Box sx={{ p: 2, bgcolor: '#1A1A1A', color: '#A1A1A1' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
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
                primaryTypographyProps={{ color: '#D2B48C' }}
                secondaryTypographyProps={{ color: '#A1A1A1' }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ReadLog;