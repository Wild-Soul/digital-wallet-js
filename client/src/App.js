import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import HomePage from './pages/HomePage';
import TransactionsPage from './pages/TransactionPage';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/transactions/:walletId" element={<TransactionsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
