import { createLogger, transports, format, Logger,  } from "winston";


const logger: Logger = createLogger({
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL || 'info',
      handleExceptions: true,
      format: format.combine(
        format.timestamp(),
        format.json(),
        format.printf(({ timestamp, level, message, requestId }) => {
          return `[${timestamp}] ${level}: ${requestId ? `[${requestId}] ` : ''}${message}`;
        })
      ),
    })
  ],
  exitOnError: false,
});

export default logger;
