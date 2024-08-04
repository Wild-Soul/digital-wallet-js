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

/**
 * Sets up a new wallet with provided initial balance and name.
 * The initial balance can be negative (maybe for some bad user behaviour in th past?).
 * @param data Payload to setup the wallet, initial balance and name.
 * @param logger Winston logger instance, it'll be used for logging.
 * @returns Returns a promise with wallet and transaction details.
 */
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

/**
 * Creates a new transaction to the target wallet.
 * The initial balance can be negative (maybe for some bad user behaviour in th past?).
 * @param walletId Id of the wallet where transaction should be reflected.
 * @param data Payload for transaction request, contains amount and description.
 * @param logger Winston logger instance, it'll be used for logging.
 * @returns Returns a promise with wallet and transaction details.
 */
export const transact = async (walletId: string, data: TransactRequest, logger: Logger): Promise<{
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
    logger.error(`[Transact] error: ${(error as Error).message}`)
    await session.abortTransaction();
    session.endSession();
    if (error instanceof ResourceNotFoundError || error instanceof InsufficientFundsError) {
      throw error;
    }
    throw new TransactionError((error as Error).message);
  }
};

/**
 * Gets list of transactions made to a wallet.
 * @param walletId Id of the wallet.
 * @param skip Initial records to skip.
 * @param limit Maximum number of records to be fetched.
 * @param logger Winston logger instance.
 * @returns List of transactions.
 */
export const getTransactions = async (walletId: string, skip: number, limit: number, logger: Logger): Promise<ITransaction[]> => {
  try {
    return await transactionDao.findTransactions(walletId, skip, limit);
  } catch (error) {
    logger.error(`[Get transactions] error: ${(error as Error).message}`)
    throw new DatabaseError('fetching transactions');
  }
};

/**
 * Gets the details of a wallet.
 * @param id Wallet id.
 * @param logger Winston logger instance.
 * @returns Wallet details.
 */
export const getWallet = async (id: string, logger: Logger): Promise<IWallet> => {
  // Since this is a get walled by id operation, if user doens't provide any session just create one (it's ok for not being in transaction)
  const session = await mongoose.startSession();
  try {
    const wallet = await walletDao.findWalletById(id, session);
    if (!wallet) {
      throw new ResourceNotFoundError('Wallet');
    }
    return wallet;
  } catch (error) {
    logger.error(`[Get wallet details] error: ${(error as Error).message}`)
    if (error instanceof ResourceNotFoundError) {
      throw error;
    }
    throw new DatabaseError('fetching wallet');
  }
};
