import React, { useState } from 'react';
import { TextField, Button, Switch, FormControlLabel, Box } from '@mui/material';

function TransactionForm({ onTransaction }) {
  // Might be better to make it uncontrolled component.
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [isCredit, setIsCredit] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    let transactAmount = amount;
    if (!isCredit) {
      transactAmount *= -1;
    }
    onTransaction(Number(transactAmount), description ?? '');
    setAmount(0);
  };


  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Transaction Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        InputProps={{
          inputProps: { min: 0 }
        }}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description (Optional)"
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControlLabel
        control={
          <Switch
            checked={isCredit}
            onChange={(e) => setIsCredit(e.target.checked)}
            name="isCredit"
            color="primary"
          />
        }
        label={isCredit ? "Credit" : "Debit"}
      />
      <Button type="submit" variant="contained" color="primary">
        Execute Transaction
      </Button>
    </Box>
  );
}

export default TransactionForm;
