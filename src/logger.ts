import winston from 'winston';
import momentTimezone from 'moment-timezone';

const { combine, splat, colorize, printf } = winston.format;

export const customFormat = printf(info => {
  const { level, message, ...data } = info;
  const keys = Object.keys(data);
  const msgsToConcat = [message];

  if (keys.length) {
    const metadata: any = {};
    keys.forEach(key => {
      metadata[key] = data[key];
    });
    msgsToConcat.push(JSON.stringify(metadata));
  }

  return `[${momentTimezone(info.timestamp)
    .utc()
    .format('YYYY-MM-DD HH:mm:ss')}] ${info.level}: ${msgsToConcat.join(' ')}`;
});

export const logger = winston.createLogger({
  format: combine(splat(), colorize(), customFormat),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({}),
  ],
});
