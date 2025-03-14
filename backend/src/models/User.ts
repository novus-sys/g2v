import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'vendor' | 'admin';
  avatar?: string;
  isEmailVerified: boolean;
  points: number;
  level: number;
  phone?: string;
  // Student specific fields
  studentDetails?: {
    studentId: string;
    studentEmail: string;
    university: string;
    course?: string;
    year?: string;
  };
  // Vendor specific fields
  businessDetails?: {
    businessName: string;
    description: string;
    address: string;
    category: string;
    contactEmail: string;
    contactPhone: string;
    businessType: string;
    openingHours: string;
    closingHours: string;
    logo?: string;
    coverImage?: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['student', 'vendor', 'admin'],
      default: 'student',
    },
    avatar: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    phone: {
      type: String,
      trim: true,
    },
    studentDetails: {
      studentId: String,
      studentEmail: {
        type: String,
        trim: true,
        lowercase: true,
      },
      university: String,
      course: String,
      year: String,
    },
    businessDetails: {
      businessName: String,
      description: String,
      address: String,
      category: String,
      contactEmail: {
        type: String,
        trim: true,
        lowercase: true,
      },
      contactPhone: String,
      businessType: String,
      openingHours: String,
      closingHours: String,
      logo: String,
      coverImage: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
userSchema.index({ role: 1 });
userSchema.index({ 'businessDetails.businessName': 1 });
userSchema.index({ 'studentDetails.studentId': 1 });
userSchema.index({ 'studentDetails.university': 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User; 