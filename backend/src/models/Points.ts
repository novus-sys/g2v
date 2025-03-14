import mongoose, { Document, Schema } from 'mongoose';

export interface IPoints extends Document {
  user: mongoose.Types.ObjectId;
  group?: mongoose.Types.ObjectId;
  points: number;
  level: number;
  achievements: {
    name: string;
    description: string;
    earnedAt: Date;
    points: number;
  }[];
  lastActivity: Date;
  createdAt: Date;
  updatedAt: Date;
  addPoints(amount: number, reason: string): Promise<void>;
  checkLevelUp(): Promise<void>;
}

const pointsSchema = new Schema<IPoints>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
    },
    points: {
      type: Number,
      default: 0,
      min: [0, 'Points cannot be negative'],
    },
    level: {
      type: Number,
      default: 1,
      min: [1, 'Level must be at least 1'],
    },
    achievements: [{
      name: {
        type: String,
        required: [true, 'Achievement name is required'],
      },
      description: {
        type: String,
        required: [true, 'Achievement description is required'],
      },
      earnedAt: {
        type: Date,
        default: Date.now,
      },
      points: {
        type: Number,
        required: [true, 'Points for achievement is required'],
        min: [0, 'Points cannot be negative'],
      },
    }],
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
pointsSchema.index({ user: 1 });
pointsSchema.index({ group: 1 });
pointsSchema.index({ level: 1 });

// Method to add points
pointsSchema.methods.addPoints = async function(amount: number, reason: string): Promise<void> {
  if (amount <= 0) {
    throw new Error('Points amount must be positive');
  }

  this.points += amount;
  this.lastActivity = new Date();

  // Add achievement for points earned
  this.achievements.push({
    name: 'Points Earned',
    description: reason,
    earnedAt: new Date(),
    points: amount,
  });

  await this.checkLevelUp();
  await this.save();
};

// Method to check and handle level up
pointsSchema.methods.checkLevelUp = async function(): Promise<void> {
  const pointsPerLevel = 1000; // Points needed per level
  const newLevel = Math.floor(this.points / pointsPerLevel) + 1;

  if (newLevel > this.level) {
    this.level = newLevel;
    this.achievements.push({
      name: 'Level Up!',
      description: `Reached level ${newLevel}`,
      earnedAt: new Date(),
      points: 100, // Bonus points for leveling up
    });
  }
};

const Points = mongoose.model<IPoints>('Points', pointsSchema);

export default Points; 