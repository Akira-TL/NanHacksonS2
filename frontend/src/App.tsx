import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme/theme';
import { Layout } from './components/Layout';
import {
  Dashboard,
  Temperature,
  Energy,
  Heat,
  Alerts,
  Display,
} from './pages';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/display" element={<Display />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="temperature" element={<Temperature />} />
            <Route path="energy" element={<Energy />} />
            <Route path="heat" element={<Heat />} />
            <Route path="alerts" element={<Alerts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
