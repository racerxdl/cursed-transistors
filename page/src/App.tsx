import React, {useEffect, useState} from 'react';
import './App.css';
import Header from './Header'
import Content from './Content'
import MetricsPage from './MetricsPage'
import {Route, BrowserRouter} from 'react-router-dom';
import {createTheme, ThemeProvider} from '@mui/material';
import {getMetrics} from "./api/api";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [metrics, setMetrics] = useState<Array<Metric>>()

  useEffect(() => {
    getMetrics().then(setMetrics)
  }, [])

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <Header/>
        <BrowserRouter>
          <Route render={() => <Content/>} path="/" exact/>
          <Route render={() => <MetricsPage metrics={metrics}/>} path="/metrics" exact/>
          <Route render={() => <MetricsPage metrics={metrics}/>} path="/metrics/:id" exact/>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
