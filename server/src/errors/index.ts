export class GenericError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'GenericError';
    }
}

export class ResourceNotFoundError extends GenericError {
    constructor(resource: string) {
        super(`${resource} not found`);
        this.name = 'ResourceNotFoundError';
    }
}

export class InvalidArgumentError extends GenericError {
    constructor(argument: string) {
        super(`Invalid argument: ${argument}`);
        this.name = 'InvalidArgumentError';
    }
}

export class InsufficientFundsError extends GenericError {
    constructor() {
        super('Insufficient funds');
        this.name = 'InsufficientFundsError';
    }
}

export class DatabaseError extends GenericError {
    constructor(operation: string) {
        super(`Database error during ${operation}`);
        this.name = 'DatabaseError';
    }
}

export class TransactionError extends GenericError {
    constructor(message: string) {
        super(`Transaction error: ${message}`);
        this.name = 'TransactionError';
    }
}

export class RouteNotFoundError extends GenericError {
    constructor(message: string) {
        super(`Route doesn't not exits: ${message}`);
        this.name = 'RouteNotFoundError';
    }
}
