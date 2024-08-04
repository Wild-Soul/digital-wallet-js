import { Request, Response } from 'express';
import * as walletService from '../services/walletService';
import { SetupWalletRequest, TransactRequest, GetTransactionsQuery } from '../types';
import {
  ResourceNotFoundError,
  InsufficientFundsError,
  DatabaseError,
  TransactionError,
  InvalidArgumentError
} from '../errors';

export const setupWallet = async (req: Request<{}, {}, SetupWalletRequest>, res: Response): Promise<void> => {
  const { logger } = req;
  try {
    logger.info(`Received request: ${JSON.stringify({
      controller: 'setupWallet',
      body: req.body,
    })}`);
    const result = await walletService.setupWallet(req.body, logger);
    res.status(200).json({
      id: result.wallet._id,
      balance: result.wallet.balance,
      transactionId: result.transaction._id,
      name: result.wallet.name,
      date: result.wallet.date
    });
  } catch (error) {
    if (error instanceof InvalidArgumentError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof DatabaseError) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const transact = async (req: Request<{ walletId: string }, {}, TransactRequest>, res: Response): Promise<void> => {
  const { logger } = req;
  try {
    logger.info(`Received request: ${JSON.stringify({
      controller: 'transact',
      body: req.body,
    })}`);
    const result = await walletService.transact(req.params.walletId, req.body);
    res.status(200).json({
      balance: result.wallet.balance,
      transactionId: result.transaction._id
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof InsufficientFundsError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof TransactionError) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const getTransactions = async (req: Request<{}, {}, {}, GetTransactionsQuery>, res: Response): Promise<void> => {
  try {
    const { logger } = req;
    logger.info(`Received request: ${JSON.stringify({
      controller: 'getTransactions',
      query: req.query,
    })}`);
    const { walletId, skip = '0', limit = '10' } = req.query;
    const transactions = await walletService.getTransactions(walletId, parseInt(skip), parseInt(limit));
    res.status(200).json(transactions);
  } catch (error) {
    if (error instanceof DatabaseError) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};

export const getWallet = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { logger } = req;
    logger.info(`Received request: ${JSON.stringify({
      controller: 'getTransactions',
      params: req.params,
    })}`);
    const wallet = await walletService.getWallet(req.params.id);
    res.status(200).json({
      id: wallet._id,
      balance: wallet.balance,
      name: wallet.name,
      date: wallet.date
    });
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof DatabaseError) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
};
