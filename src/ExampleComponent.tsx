import React from 'react';
import { Button, Typography } from '@mui/material';

const ExampleComponent: React.FC = () => {
  return (
    <div>
      <Typography variant="h1">Hello, Material-UI!</Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </div>
  );
};

export default ExampleComponent;