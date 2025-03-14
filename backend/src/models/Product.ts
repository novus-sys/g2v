import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  business: mongoose.Types.ObjectId;
  category: string;
  images: string[];
  stock: number;
  isGroupBuyEnabled: boolean;
  groupBuyMinMembers: number;
  groupBuyDiscount: number;
  specifications: {
    [key: string]: string;
  };
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: Date;
  updatedAt: Date;
  calculateDiscount(): number;
  updateStock(quantity: number): Promise<void>;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Business reference is required'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    images: [{
      type: String,
      required: [true, 'At least one image is required'],
    }],
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    isGroupBuyEnabled: {
      type: Boolean,
      default: false,
    },
    groupBuyMinMembers: {
      type: Number,
      min: [2, 'Minimum members must be at least 2'],
      default: 2,
    },
    groupBuyDiscount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'out_of_stock'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ business: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isGroupBuyEnabled: 1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.discountPrice || !this.price) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

// Pre-save middleware for price validation
productSchema.pre('save', function(next) {
  if (this.discountPrice && this.discountPrice > this.price) {
    next(new Error('Discount price cannot be higher than regular price'));
  }
  next();
});

// Pre-save middleware for stock status
productSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock' && this.stock > 0) {
    this.status = 'active';
  }
  next();
});

// Method to calculate discount
productSchema.methods.calculateDiscount = function(): number {
  if (!this.discountPrice) return 0;
  return this.price - this.discountPrice;
};

// Method to update stock
productSchema.methods.updateStock = async function(quantity: number): Promise<void> {
  this.stock += quantity;
  if (this.stock < 0) {
    throw new Error('Insufficient stock');
  }
  await this.save();
};

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product; 