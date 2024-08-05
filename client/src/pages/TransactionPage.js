import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import TransactionTable from '../components/TransactionTable';

function TransactionsPage() {
    const { walletId } = useParams();
    return (
        <Container>
            <Typography variant="h4" gutterBottom>Wallet Transactions</Typography>
            <TransactionTable walletId={walletId} />
            <Button component={Link} to="/" variant="contained" color="primary">
                Back to Wallet
            </Button>
        </Container>
    );
}

export default TransactionsPage;
