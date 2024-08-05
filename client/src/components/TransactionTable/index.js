import React, { useState, useEffect } from 'react';
import {
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
	TablePagination, TableSortLabel, Button, CircularProgress, Typography
} from '@mui/material';


function TransactionTable({ walletId }) {
	const [page, setPage] = useState(0);
	const [loading, setLoading] = useState(true);
	const [transactions, setTransactions] = useState([]);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [orderBy, setOrderBy] = useState('date');
	const [order, setOrder] = useState('desc');
	const [error, setError] = useState(null);

	useEffect(() => {
		// Fetch data from API
		const fetchTransactions = async () => {
			try {
				const response = await fetch(`http://localhost:7001/transactions?walletId=${walletId}&skip&limit`);
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				const data = await response.json();
				setTransactions(data);
			} catch (error) {
				setError(error);
			} finally {
				setLoading(false);
			}
		};

		fetchTransactions();
	}, []);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleSort = (property) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	// Ideally this should be done on server side.
	const sortedTransactions = transactions.sort((a, b) => {
		if (orderBy === 'date') {
			return order === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
		} else {
			return order === 'asc' ? a.amount - b.amount : b.amount - a.amount;
		}
	});

	const exportCSV = () => {
		const currentData = sortedTransactions;

		// Convert to CSV
		const header = ['Date', 'Amount', 'Type', 'Description'];
		const csvRows = [
			header.join(','), // header row
			...currentData.map(row => [
				row.date,
				row.amount,
				row.type,
				row.description
			].join(','))
		];

		const csvString = csvRows.join('\n');

		const blob = new Blob([csvString], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		// Trigger download.
		const a = document.createElement('a');
		a.href = url;
		a.download = 'transactions.csv';
		a.click();
		URL.revokeObjectURL(url);
	};

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Typography color="error">Error fetching transactions: {error.message}</Typography>;
	}

	return (
		<>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'date'}
									direction={orderBy === 'date' ? order : 'asc'}
									onClick={() => handleSort('date')}
								>
									Date
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === 'amount'}
									direction={orderBy === 'amount' ? order : 'asc'}
									onClick={() => handleSort('amount')}
								>
									Amount
								</TableSortLabel>
							</TableCell>
							<TableCell>Type</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{sortedTransactions
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell>{transaction.date}</TableCell>
									<TableCell>{transaction.amount}</TableCell>
									<TableCell>{transaction.type}</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={transactions.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
			<Button onClick={exportCSV} variant="contained" color="primary">
				Export CSV
			</Button>
		</>
	);
}

export default TransactionTable;