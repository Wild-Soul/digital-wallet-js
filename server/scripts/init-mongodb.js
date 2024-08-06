// This script is used to initialize the database, create service user and collection/indices if needed.

db = db.getSiblingDB('wallet-db');

db.createUser({
  user: 'wallet-serviceuser',
  pwd: 'password',
  roles: [{ role: 'readWrite', db: 'wallet-db' }]
});

// Additional setup can be done here, like creating collections or indexes
