import { Request, Response, NextFunction } from 'express';
import { ValidationError, AuthenticationError, AuthorizationError, NotFoundError } from '../utils/errors';
import config from '../config';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof AuthenticationError) {
    return res.status(401).json({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof AuthorizationError) {
    return res.status(403).json({
      status: 'error',
      message: error.message,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      status: 'error',
      message: error.message,
    });
  }

  // Handle mongoose validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Validation error',
      errors: Object.values(error).map((err: any) => ({
        field: err.path,
        message: err.message,
      })),
    });
  }

  // Handle mongoose duplicate key errors
  if (error.name === 'MongoError' && (error as any).code === 11000) {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate key error',
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expired',
    });
  }

  // Default error
  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}; 