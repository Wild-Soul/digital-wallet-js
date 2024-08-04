import mongoose, { Schema } from 'mongoose';
import { IWallet } from '../types';

const WalletSchema: Schema = new Schema({
  balance: {
    type: Number,
    required: true,
    min: 0,
    get: (v: number) => parseFloat(v.toFixed(4)),
    set: (v: number) => parseFloat(v.toFixed(4))
  },
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IWallet>('Wallet', WalletSchema);
