// src/index.tsx (or src/main.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider as CustomThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <CustomThemeProvider>
      <App />
    </CustomThemeProvider>
  </React.StrictMode>
);