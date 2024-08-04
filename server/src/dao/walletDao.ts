import Wallet from '../models/wallet';
import { IWallet } from '../types';
import mongoose from 'mongoose';

export const createWallet = async (walletData: Partial<IWallet>, session?: mongoose.ClientSession): Promise<IWallet> => {
  const wallet = new Wallet(walletData);
  return await wallet.save({ session });
};

export const findWalletById = async (id: string, session: mongoose.ClientSession): Promise<IWallet | null> => {
  return await Wallet.findById(id).session(session);
};

export const updateWallet = async (wallet: IWallet, session?: mongoose.ClientSession): Promise<IWallet> => {
  return await wallet.save({ session });
};
