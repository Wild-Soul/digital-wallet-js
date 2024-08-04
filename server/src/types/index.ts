import { Document } from 'mongoose';

export enum TransactionType {
    Credit = 'CREDIT',
    Debit = 'DEBIT'
}

export interface IWallet extends Document {
    balance: number;
    name: string;
    date: Date;
}

export interface ITransaction extends Document {
    walletId: IWallet['_id'];
    amount: number;
    balance: number;
    description: string;
    date: Date;
    type: TransactionType;
}

export interface SetupWalletRequest {
    balance: number;
    name: string;
}

export interface TransactRequest {
    amount: number;
    description: string;
}

export interface GetTransactionsQuery {
    walletId: string;
    skip?: string;
    limit?: string;
}
