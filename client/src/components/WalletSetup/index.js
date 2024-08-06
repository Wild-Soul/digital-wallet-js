import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

function WalletSetup({ onSetup }) {
  const [username, setUsername] = useState('');
  const [initialBalance, setInitialBalance] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd call an API to create a wallet
    onSetup({ username, balance: initialBalance });
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Initial Balance"
        type="number"
        InputProps={{
          inputProps: { min: 0 }
        }}
        value={initialBalance}
        onChange={(e) => setInitialBalance(Number(e.target.value))}
        fullWidth
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Create Wallet
      </Button>
    </Box>
  );
}

export default WalletSetup;
