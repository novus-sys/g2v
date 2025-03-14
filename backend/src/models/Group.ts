import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description: string;
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  maxMembers: number;
  status: 'open' | 'closed' | 'completed';
  category: string;
  targetAmount: number;
  currentAmount: number;
  expiryDate: Date;
  image?: string;
  rules: string[];
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    maxMembers: {
      type: Number,
      required: true,
      min: 2,
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'completed'],
      default: 'open',
    },
    category: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
    },
    rules: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
groupSchema.index({ status: 1, category: 1 });
groupSchema.index({ creator: 1 });
groupSchema.index({ members: 1 });

// Ensure current amount doesn't exceed target amount
groupSchema.pre('save', function(next) {
  if (this.currentAmount > this.targetAmount) {
    next(new Error('Current amount cannot exceed target amount'));
  }
  next();
});

// Auto-close group when target amount is reached
groupSchema.pre('save', function(next) {
  if (this.currentAmount >= this.targetAmount) {
    this.status = 'completed';
  }
  next();
});

const Group = mongoose.model<IGroup>('Group', groupSchema);

export default Group; 