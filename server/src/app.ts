
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors';
import logger from './utils/logger';
import { RouteNotFoundError } from './errors';
import connectDB from './config/database';
import walletRoutes from './routes/walletRoutes';

dotenv.config();
// Connect to MongoDB
connectDB();

class App {
  public server;

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Configure CORS options
    const corsOptions: cors.CorsOptions = {
      origin: (origin: string | undefined, callback) => {
        callback(null, true); // allow all request irrespective of their origin for now, just a placeholder.
      },
      credentials: true,
    };

    // Apply CORS middleware
    this.server.use(cors(corsOptions));

    // sets http headers for response.
    // this.server.use(helmet());
    this.server.use(express.json());
    
    this.server.all('/*', (req, res, next) => {
      const requestId = uuidv4();
      const childLogger = logger.child({ requestId });
      req.headers["x-request-id"] = requestId;
      req.logger = childLogger;
      return next();
    });// attach a logger instance and request-id to the req coming to all routes.
  }

  routes() {
    this.server.use('/', walletRoutes);

    // Throw error for all urls that do not match.
    this.server.all('*', (req, res, next) => {
      next(new RouteNotFoundError(req.originalUrl));
    });
  }
}

export default new App().server;
