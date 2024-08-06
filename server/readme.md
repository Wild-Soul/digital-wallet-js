# Wallet System API (TypeScript)

This is a backend service for a Wallet system using TypeScript, supporting setup, credit/debit transactions, fetching transactions, and getting wallet details.

## Implementation Details

- TypeScript is used for type-safe development
- MongoDB is used as the database
- Transactions are handled using MongoDB sessions to ensure atomicity
- Decimal precision is maintained up to 4 decimal places
- Race conditions are handled using MongoDB's transaction capabilities

...

## Setup
There are two ways to go about it
- Everything in local (requires development envrionment with node.js V20)
- Using docker, which requires docker daemon to be running.

### Local setup

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file with your MongoDB URI and PORT.
    - Make sure that you've mongoDB installed/running maybe using docker.
4. Run the development server: `npm run start:dev`.
5. Build for production: `npm run build`.
6. Run production server: `npm run start:prd`.

## Project structure
```
server/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   └── walletController.ts
│   ├── models/
│   │   ├── Wallet.ts
│   │   └── Transaction.ts
│   ├── dao/
│   │   ├── walletDao.ts
│   │   └── transactionDao.ts
│   ├── services/
│   │   └── walletService.ts
│   ├── routes/
│   │   └── walletRoutes.ts
│   ├── types/
│   │   └── index.ts
│   └── app.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```
* Using SOLID principles guideline.
* Using DAO design pattern so that it'll be easier to switch database if needed.
* Roles and responsibilities of each moduel:
    - Models define the data structure
    - DAOs handle database operations
    - Services contain business logic
    - Controllers handle HTTP requests and responses
