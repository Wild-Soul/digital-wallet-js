import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';
import WalletSetup from '../components/WalletSetup';
import WalletInfo from '../components/WalletInfo';
import TransactionForm from '../components/TransactionForm';

// This should be coming from env variable.
const API_BASE_URL = 'http://localhost:7001'

function HomePage() {
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        const storedWalletId = localStorage.getItem('walletId');
        if (storedWalletId) {
            fetch(`${API_BASE_URL}/wallet/${storedWalletId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            }).then(data => {
                setWallet({
                    id: data.id,
                    balance: data.balance,
                    name: data.name,
                    createdAt: data.date,
                });
                localStorage.setItem('walletId', newWallet.id);
            }).catch(error => {
                // Handle any errors that occurred during the fetch
                console.error('Error:', error);
            });
        }
    }, []);

    const handleWalletSetup = (newWallet) => {
        const data = {
            "balance": newWallet.balance,
            "name": newWallet.username,
        }
        fetch(`${API_BASE_URL}/setup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        }).then(data => {
            setWallet(prevWallet => ({
                ...prevWallet,
                id: data.id,
                balance: data.balance,
            }));
            localStorage.setItem('walletId', data.id);
        }).catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Error:', error);
        });
        
    };

    const handleTransaction = (amount, description, type) => {
        if (amount == 0) return; // no point of this transaction.
        const data = {
            "amount": amount,
            "description": description ?? ""
        }
        console.log("wallet", wallet)
        fetch(`${API_BASE_URL}/transact/${wallet.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        }).then(data => {
            setWallet(prevWallet => ({
                ...prevWallet,
                balance: data.balance,
            }));
        }).catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('Error:', error);
        });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Wallet App</Typography>
            {wallet ? (
                <>
                    <WalletInfo wallet={wallet} />
                    <TransactionForm onTransaction={handleTransaction} />
                </>
            ) : (
                <WalletSetup onSetup={handleWalletSetup} />
            )}
            <Button component={Link} to={`/transactions/${wallet?.id}`} variant="contained" color="primary">
                View Transactions
            </Button>
        </Container>
    );
}

export default HomePage;
