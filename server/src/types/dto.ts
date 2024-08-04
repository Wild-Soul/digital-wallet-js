/**
 * Define the types that will be used for data transferring over here.
 * Since it's a small application it's a single file but ideally it's better to have it as a module.
 */

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
