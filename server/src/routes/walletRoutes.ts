import express from 'express';
import { setupWallet, transact, getTransactions, getWallet } from '../controllers/walletController';

const router = express.Router();

router.post('/setup', setupWallet);
router.post('/transact/:walletId', transact);
router.get('/transactions', getTransactions);
router.get('/wallet/:id', getWallet);

export default router;
