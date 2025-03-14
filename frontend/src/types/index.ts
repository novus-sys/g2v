export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  deliveryTime: string;
  minOrderAmount?: number;
  isGroupBuyingEnabled: boolean;
  groupBuyingDiscount?: number;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  category: string;
}

export interface GroupBuy {
  id: string;
  businessId: string;
  productId: string;
  targetParticipants: number;
  currentParticipants: number;
  discountPercentage: number;
  expiresAt: string;
  status: 'active' | 'completed' | 'expired';
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  level: number;
  points: number;
  badges: string[];
  rank: string;
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
}

// New seller-related types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface Revenue {
  date: string;
  amount: number;
}

export interface SellerAnalytics {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  revenueByDay: Revenue[];
  topProducts: {
    id: string;
    name: string;
    sales: number;
  }[];
}
