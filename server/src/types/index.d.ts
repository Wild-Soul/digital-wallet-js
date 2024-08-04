import { Logger } from 'winston';

// Add user property in golobal Express namespace.
declare global {
  declare namespace Express {
    export interface Request {
      user?: {
        id: string;
        email: string;
        organizationId: string;
      };
      logger: Logger
    }
  }
}
