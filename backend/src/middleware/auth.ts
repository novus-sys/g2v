import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../types/express/auth';
import { Document } from 'mongoose';

interface JwtPayload {
  id: string;
  role?: string;
}

// Middleware to check if user is authenticated
export const auth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('No authentication token, access denied', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // Get user from token
    const user = await User.findById(decoded.id).select('-password') as Document & {
      _id: { toString: () => string };
      email: string;
      role: string;
      firstName: string;
      lastName: string;
      isEmailVerified: boolean;
    } | null;
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if user is active
    if (!user.isEmailVerified) {
      throw new AppError('Please verify your email first', 403);
    }

    // Attach user to request
    req.user = {
      _id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (error: unknown) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token has expired', 401));
      return;
    }
    next(error);
  }
};

// Middleware to check user role
export const checkRole = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied: Insufficient permissions', 403));
    }

    next();
  };
};

// Middleware to check if user is accessing their own data
export const checkOwnership = (paramName: string = 'id') => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', 401));
    }

    // Allow admin to access any user's data
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user is accessing their own data
    const resourceId = req.params[paramName] as string;
    if (!resourceId || resourceId !== req.user._id) {
      return next(new AppError('Access denied: You can only access your own data', 403));
    }

    next();
  };
}; 