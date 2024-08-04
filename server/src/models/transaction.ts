import mongoose, { Schema } from 'mongoose';
import { ITransaction, TransactionType } from '../types';

const TransactionSchema: Schema = new Schema({
    walletId: {
        type: Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true
    },
    // Since we are only dealing with 4 precision values, it's okay to store these as numbers.
    amount: {
        type: Number,
        required: true,
        get: (v: number) => parseFloat(v.toFixed(4)),
        set: (v: number) => parseFloat(v.toFixed(4))
    },
    balance: {
        type: Number,
        required: true,
        get: (v: number) => parseFloat(v.toFixed(4)),
        set: (v: number) => parseFloat(v.toFixed(4))
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: [TransactionType.Credit, TransactionType.Debit],
        required: true
    }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
