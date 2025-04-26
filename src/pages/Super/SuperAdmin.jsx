// src/App.js
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import { Provider } from 'react-redux';
import store from '../../redux/SuperAdmin/store';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0D47A1',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

function SuperAdmin() {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <Sidebar open={drawerOpen} toggleDrawer={toggleDrawer} />
          <Dashboard open={drawerOpen} toggleDrawer={toggleDrawer} />
        </Box>
      </ThemeProvider>
    </Provider>
  );
}

export default SuperAdmin;