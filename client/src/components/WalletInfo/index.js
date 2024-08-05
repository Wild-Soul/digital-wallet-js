import React from 'react';
import { Typography, Box } from '@mui/material';

function WalletInfo({ wallet }) {
  return (
    <Box>
      <Typography variant="h6">Welcome, {wallet.username}</Typography>
      <Typography variant="subtitle1">Wallet ID: {wallet.id}</Typography>
      <Typography variant="h5">Balance: ${wallet.balance.toFixed(2)}</Typography>
    </Box>
  );
}

export default WalletInfo;
