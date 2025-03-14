import React from "react";
import { ShoppingBag, Clock, Check, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

// Mock order data
const BUYER_ORDERS = [
  {
    id: "ord-001",
    businessName: "Campus Bites",
    date: "May 15, 2023",
    items: ["Chicken Rice Bowl", "Green Tea"],
    status: "delivered" as const,
    total: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ord-002",
    businessName: "Study Brew Coffee",
    date: "May 10, 2023",
    items: ["Cappuccino", "Chocolate Croissant"],
    status: "processing" as const,
    total: 8.50,
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "ord-003",
    businessName: "Tech Essentials",
    date: "April 28, 2023",
    items: ["USB-C Cable", "Wireless Mouse"],
    status: "cancelled" as const,
    total: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1563770660941-10a63a9ed40f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

// Mock seller orders
const SELLER_ORDERS = [
  {
    id: "sel-001",
    customerName: "Vivek Kumar",
    date: "May 16, 2023",
    items: ["Coffee", "Bagel"],
    status: "pending" as const,
    total: 8.50,
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sel-002",
    customerName: "Sam Wilson",
    date: "May 15, 2023",
    items: ["Ramen", "Green Tea"],
    status: "processing" as const,
    total: 15.99,
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "sel-003",
    customerName: "Jamie Lee",
    date: "May 15, 2023",
    items: ["Fried Rice", "Boba Tea"],
    status: "delivered" as const,
    total: 12.75,
    imageUrl: "https://images.unsplash.com/photo-1569718526366-122261613da8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const Orders: React.FC = () => {
  const { userMode } = useAppContext();
  const isSeller = userMode === "seller";
  const orders = isSeller ? SELLER_ORDERS : BUYER_ORDERS;

  return (
    <div className="max-w-screen-xl mx-auto pb-24 section-padding">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">
          {isSeller ? "Manage Orders" : "My Orders"}
        </h1>
        
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} isSeller={isSeller} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gantry-gray/20">
            <ShoppingBag className="w-12 h-12 mx-auto text-gantry-purple/50 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">
              {isSeller ? "When you receive orders, they will appear here" : "When you place orders, they will appear here"}
            </p>
            <a 
              href={isSeller ? "/products" : "/explore"} 
              className="inline-block bg-gantry-purple hover:bg-gantry-purple-dark text-white px-6 py-2 rounded-lg transition-colors"
            >
              {isSeller ? "Manage Products" : "Explore Businesses"}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

interface OrderCardProps {
  order: {
    id: string;
    businessName?: string;
    customerName?: string;
    date: string;
    items: string[];
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    total: number;
    imageUrl: string;
  };
  isSeller: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isSeller }) => {
  const statusIcon = {
    pending: <Clock className="w-4 h-4 text-blue-500" />,
    processing: <Clock className="w-4 h-4 text-yellow-500" />,
    delivered: <Check className="w-4 h-4 text-green-500" />,
    cancelled: <X className="w-4 h-4 text-red-500" />
  };
  
  const statusText = {
    pending: "Pending",
    processing: "Processing",
    delivered: "Delivered",
    cancelled: "Cancelled"
  };
  
  const statusColor = {
    pending: "bg-blue-100 text-blue-800",
    processing: "bg-yellow-100 text-yellow-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gantry-gray/20 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden mb-4 sm:mb-0 sm:mr-4">
            <img
              src={order.imageUrl}
              alt={isSeller ? order.customerName : order.businessName}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">
                  {isSeller ? order.customerName : order.businessName}
                </h3>
                <p className="text-gray-500 text-sm">{order.date}</p>
              </div>
              
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${statusColor[order.status]}`}>
                {statusIcon[order.status]}
                <span>{statusText[order.status]}</span>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-gray-700">
                {order.items.join(", ")}
              </p>
              <div className="flex justify-between items-center mt-3">
                <p className="font-semibold">${order.total.toFixed(2)}</p>
                {isSeller ? (
                  <div className="flex space-x-2">
                    {order.status === "pending" && (
                      <button 
                        className="text-white bg-gantry-purple hover:bg-gantry-purple-dark text-sm font-medium px-3 py-1 rounded-lg"
                        onClick={() => console.log(`Accept order ${order.id}`)}
                      >
                        Accept
                      </button>
                    )}
                    <button 
                      className="text-gantry-purple hover:text-gantry-purple-dark text-sm font-medium"
                      onClick={() => console.log(`View details for order ${order.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                ) : (
                  <button 
                    className="text-gantry-purple hover:text-gantry-purple-dark text-sm font-medium"
                    onClick={() => console.log(`View details for order ${order.id}`)}
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
