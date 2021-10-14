import React from 'react';
import './App.css';
import Header from './Header'
import Content from './Content'
import { createTheme, ThemeProvider } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <Header/>
        <Content/>
      </div>
    </ThemeProvider>
  );
}

export default App;
