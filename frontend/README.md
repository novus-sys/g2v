
# Gantry Groups - Collaborative Group Buying Application

## Overview

Gantry Groups is a collaborative group buying platform that enables users to create and join purchasing groups to get better deals through collective buying power. The application facilitates social commerce by connecting users who want to purchase similar products, helping them reach discount thresholds and save money.

## System Architecture

The application follows a client-server architecture:

- **Frontend**: React with TypeScript, utilizing Vite as the build tool, Tailwind CSS for styling, and shadcn/ui for UI components
- **Backend**: Node.js with Express.js framework, MongoDB for database, and JWT for authentication
- **Deployment**: Configured for Vercel deployment

## Features Implemented

### Authentication and User Management

- **User Registration**: Email and password-based signup with validation
- **User Login**: Secure authentication with JWT tokens
- **Session Management**: Access tokens and refresh tokens for persistent authentication
- **Profile Management**: User can update their profile information

### Group Management

- **Create Groups**: Users can create purchasing groups with specific targets, rules, and expiry dates
- **Join Groups**: Users can browse and join open groups
- **Group Status**: Groups can be in 'open', 'closed', or 'completed' states
- **Group Details**: Detailed view of group information, members, progress, and rules

### Gamification and Rewards

- **Points System**: Users earn points through activities like successful group buys
- **Levels**: Progress through levels based on accumulated points
- **Achievements**: Earn badges for reaching certain milestones

### Payment Methods

- **Multiple Payment Methods**: Add, edit, and delete payment methods
- **Default Payment**: Set a default payment method
- **Secure Storage**: Encrypted storage of payment information

### Business Features

- **Business Directory**: Browse businesses that support group buying
- **Product Catalog**: View products available for group buying
- **Order Management**: Track and manage orders placed

### Additional Features

- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Robust error management and user feedback
- **Notifications**: System for important events and updates

## Database Models and Relationships

### User Model

```typescript
interface IUser {
  email: string;
  password: string; // Hashed
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'business';
  avatar?: string;
  isEmailVerified: boolean;
  points: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Group Model

```typescript
interface IGroup {
  name: string;
  description: string;
  creator: ObjectId; // Reference to User
  members: ObjectId[]; // Reference to Users
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
```

### Order Model (To Be Implemented)

```typescript
interface IOrder {
  user: ObjectId; // Reference to User
  group: ObjectId; // Reference to Group (optional, for group buys)
  items: {
    product: ObjectId; // Reference to Product
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Model (To Be Implemented)

```typescript
interface IProduct {
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  business: ObjectId; // Reference to Business/User with business role
  category: string;
  images: string[];
  stock: number;
  isGroupBuyEnabled: boolean;
  groupBuyMinMembers: number;
  groupBuyDiscount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Payment Method Model (To Be Implemented)

```typescript
interface IPaymentMethod {
  user: ObjectId; // Reference to User
  type: 'credit' | 'debit' | 'paypal' | 'other';
  provider: string;
  cardNumber: string; // Last 4 digits only, for display
  expiryDate: Date;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Database Relationships

1. **User to Group (One-to-Many and Many-to-Many)**
   - One user can create multiple groups (One-to-Many)
   - Many users can be members of many groups (Many-to-Many)

2. **User to Order (One-to-Many)**
   - One user can have multiple orders

3. **Group to Order (One-to-Many)**
   - One group can have multiple associated orders

4. **User to Payment Method (One-to-Many)**
   - One user can have multiple payment methods

5. **Business to Product (One-to-Many)**
   - One business can have many products

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token

### User Management
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users/:id` - Get user by ID (admin only)

### Group Management
- `POST /api/groups` - Create a new group
- `GET /api/groups` - Get all groups with filtering
- `GET /api/groups/:id` - Get group details
- `PUT /api/groups/:id` - Update group
- `POST /api/groups/:id/join` - Join a group
- `POST /api/groups/:id/leave` - Leave a group

### Orders (To Be Implemented)
- `POST /api/orders` - Create a new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

### Products (To Be Implemented)
- `POST /api/products` - Create a new product (business only)
- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product (business only)

### Payment Methods (To Be Implemented)
- `POST /api/payment-methods` - Add a new payment method
- `GET /api/payment-methods` - Get user's payment methods
- `PUT /api/payment-methods/:id` - Update payment method
- `DELETE /api/payment-methods/:id` - Delete payment method
- `POST /api/payment-methods/:id/default` - Set as default payment method

## Future Enhancements

1. **Real-time Updates**: Implement WebSockets for live updates on group status
2. **Recommendation Engine**: Suggest groups and products based on user preferences
3. **Social Integration**: Share groups on social media platforms
4. **Advanced Analytics**: Dashboard for users and businesses to track performance
5. **Mobile Application**: Native mobile apps for iOS and Android

## Security Considerations

- Passwords are hashed using bcrypt
- JWT with limited expiry time for authentication
- HTTPS for all communications
- Rate limiting to prevent brute force attacks
- Input validation for all user inputs
- MongoDB injection prevention
- CORS policy implementation

## Setup and Installation

### Frontend
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

### Backend
1. Navigate to the `backend` directory
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Start development server: `npm run dev`

## Deployment

The application is configured for deployment on Vercel:
1. Frontend: Automatic deployment from the `main` branch
2. Backend: Serverless functions with Vercel's Node.js runtime

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
