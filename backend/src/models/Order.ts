import mongoose, { Document, Schema } from 'mongoose';
import Product from './Product';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  group?: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    discount?: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: mongoose.Types.ObjectId;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  calculateTotal(): Promise<void>;
  updateStatus(newStatus: IOrder['status']): Promise<void>;
}

const orderSchema = new Schema<IOrder>(
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
    items: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product reference is required'],
      },
      quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
      },
      price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
      },
      discount: {
        type: Number,
        min: [0, 'Discount cannot be negative'],
      },
    }],
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: 'PaymentMethod',
      required: [true, 'Payment method is required'],
    },
    shippingAddress: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      postalCode: {
        type: String,
        required: [true, 'Postal code is required'],
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
    },
    trackingNumber: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
orderSchema.index({ user: 1 });
orderSchema.index({ group: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for order statistics
orderSchema.virtual('itemCount').get(function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Pre-save middleware for total calculation
orderSchema.pre('save', async function(next) {
  if (this.isModified('items')) {
    await this.calculateTotal();
  }
  next();
});

// Method to calculate total
orderSchema.methods.calculateTotal = async function(): Promise<void> {
  let total = 0;
  for (const item of this.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product ${item.product} not found`);
    }
    item.price = product.price;
    if (product.discountPrice) {
      item.discount = product.price - product.discountPrice;
    }
    total += (item.price - (item.discount || 0)) * item.quantity;
  }
  this.totalAmount = total;
};

// Method to update status
orderSchema.methods.updateStatus = async function(newStatus: IOrder['status']): Promise<void> {
  this.status = newStatus;
  if (newStatus === 'completed') {
    // Update product stock
    for (const item of this.items) {
      const product = await Product.findById(item.product);
      if (product) {
        await product.updateStock(-item.quantity);
      }
    }
  }
  await this.save();
};

const Order = mongoose.model<IOrder>('Order', orderSchema);

export default Order; 