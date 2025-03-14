import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { ValidationError } from '../utils/errors';
import mongoose from 'mongoose';

const generateTokens = (userId: mongoose.Types.ObjectId) => {
  const accessToken = jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId: userId.toString() }, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key', {
    expiresIn: '7d',
  });

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName,
      role,
      // Student specific fields
      studentDetails,
      // Vendor specific fields
      businessDetails
    } = req.body;
    
    console.log('Registration attempt for:', email, 'with role:', role);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('Email already registered');
    }

    // Validate role-specific details
    if (role === 'student' && !studentDetails) {
      throw new ValidationError('Student details are required');
    }

    if (role === 'vendor' && !businessDetails) {
      throw new ValidationError('Business details are required');
    }

    // Create new user with role-specific details
    const userData = {
      email,
      password,
      firstName,
      lastName,
      role,
      ...(role === 'student' && { studentDetails }),
      ...(role === 'vendor' && { businessDetails })
    };

    // Create new user (password will be hashed by the pre-save middleware)
    const user = await User.create(userData);

    console.log('User created successfully:', user.email);

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Return user data and tokens
    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        ...(user.role === 'student' && { studentDetails: user.studentDetails }),
        ...(user.role === 'vendor' && { businessDetails: user.businessDetails })
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Find user with password
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      throw new ValidationError('Invalid email or password');
    }

    // Use the schema's comparePassword method
    const isValidPassword = await user.comparePassword(password);
    console.log('Password comparison result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('Password validation failed');
      throw new ValidationError('Invalid email or password');
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Return user data and tokens with role-specific details
    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        ...(user.role === 'student' && { studentDetails: user.studentDetails }),
        ...(user.role === 'vendor' && { businessDetails: user.businessDetails })
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key') as { userId: string };
    
    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ValidationError('User not found');
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    next(error);
  }
}; 