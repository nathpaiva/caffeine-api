import fs from 'fs';
import winston from 'winston';

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: 'logs/caffeine.log',
      maxsize: 1048576,
      maxFiles: 10,
    }),
  ],
});

export default logger;
