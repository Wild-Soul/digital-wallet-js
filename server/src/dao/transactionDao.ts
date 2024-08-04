import Transaction from '../models/transaction';
import { ITransaction } from '../types';
import mongoose from 'mongoose';

export const createTransaction = async (transactionData: Partial<ITransaction>, session?: mongoose.ClientSession): Promise<ITransaction> => {
  const transaction = new Transaction(transactionData);
  return await transaction.save({ session });
};

export const findTransactions = async (
  walletId: string,
  skip: number,
  limit: number
): Promise<ITransaction[]> => {
  return await Transaction.find({ walletId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);
};
