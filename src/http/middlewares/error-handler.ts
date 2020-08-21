import { Request, Response, NextFunction } from 'express';
import { CodedError } from '../../errors';
import { logger } from '../../logger';

export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CodedError) {
    logger.warn(err);

    const { statusCode, message, code, details } = err;
    res.status(statusCode).send({
      code,
      message,
      details,
    });
    return next();
  }

  if (err.code && err.code === 'ER_DUP_ENTRY') {
    res.status(409).send({
      code: 'DUPLICATED_RESOURCE',
      message: 'Already exists resource with received unique keys',
    });
    return next();
  }

  res.status(500).send({
    code: 'UNEXPECTED_ERROR',
    message: 'Internal server failure',
  });

  return next();
};
