import mongoose from 'mongoose';
import { Logger } from 'winston';
import { IWallet, ITransaction, SetupWalletRequest, TransactRequest, TransactionType } from '../types';
import * as walletDao from '../dao/walletDao';
import * as transactionDao from '../dao/transactionDao';
import {
  ResourceNotFoundError,
  InsufficientFundsError,
  DatabaseError,
  TransactionError,
  InvalidArgumentError
} from '../errors';

export const setupWallet = async (data: SetupWalletRequest, logger: Logger): Promise<{
  wallet: IWallet;
  transaction: ITransaction;
}> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (data.balance < 0) {
      throw new InvalidArgumentError('Initial balance cannot be negative');
    }

    const wallet = await walletDao.createWallet({
      balance: parseFloat(data.balance.toFixed(4)),
      name: data.name
    }, session);

    const transaction = await transactionDao.createTransaction({
      walletId: wallet._id,
      amount: wallet.balance,
      balance: wallet.balance,
      description: `Initial setup: ${wallet.name}`,
      type: TransactionType.Credit
    }, session);

    await session.commitTransaction();
    session.endSession();

    return { wallet, transaction };
  } catch (error) {
    logger.error(`[Wallet Setup] error: ${(error as Error).message}`)
    await session.abortTransaction();
    session.endSession();
    if (error instanceof InvalidArgumentError) {
      throw error;
    }
    throw new DatabaseError('wallet setup');
  }
};

export const transact = async (walletId: string, data: TransactRequest): Promise<{
  wallet: IWallet;
  transaction: ITransaction;
}> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const wallet = await walletDao.findWalletById(walletId, session);
    if (!wallet) {
      throw new ResourceNotFoundError('Wallet');
    }

    const transactionAmount = parseFloat(data.amount.toFixed(4));
    const newBalance = parseFloat((wallet.balance + transactionAmount).toFixed(4));

    if (newBalance < 0) {
      throw new InsufficientFundsError();
    }

    wallet.balance = newBalance;
    await walletDao.updateWallet(wallet, session);

    const transaction = await transactionDao.createTransaction({
      walletId: wallet._id,
      amount: transactionAmount,
      balance: newBalance,
      description: data.description,
      type: transactionAmount >= 0 ? TransactionType.Credit : TransactionType.Debit,
    }, session);

    await session.commitTransaction();
    session.endSession();

    return { wallet, transaction };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error instanceof ResourceNotFoundError || error instanceof InsufficientFundsError) {
      throw error;
    }
    throw new TransactionError((error as Error).message);
  }
};

export const getTransactions = async (walletId: string, skip: number, limit: number): Promise<ITransaction[]> => {
  try {
    return await transactionDao.findTransactions(walletId, skip, limit);
  } catch (error) {
    throw new DatabaseError('fetching transactions');
  }
};

export const getWallet = async (id: string, session?: mongoose.ClientSession): Promise<IWallet> => {
  // Since this is a get walled by id operation, if user doens't provide any session just create one (it's ok for not being in transaction)
  if (!session) {
    session = await mongoose.startSession();
  }
  try {
    const wallet = await walletDao.findWalletById(id, session);
    if (!wallet) {
      throw new ResourceNotFoundError('Wallet');
    }
    return wallet;
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw error;
    }
    throw new DatabaseError('fetching wallet');
  }
};
