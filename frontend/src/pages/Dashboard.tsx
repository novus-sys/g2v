import React, { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, DollarSign, Clock } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OrderDetails from "@/components/OrderDetails";
import { OrderItem } from "@/types";

// Mock data
const revenueData = [
  { name: "Mon", revenue: 1200 },
  { name: "Tue", revenue: 1800 },
  { name: "Wed", revenue: 1400 },
  { name: "Thu", revenue: 2200 },
  { name: "Fri", revenue: 2600 },
  { name: "Sat", revenue: 1800 },
  { name: "Sun", revenue: 1400 },
];

const topProductsData = [
  { name: "Chicken Rice Bowl", sales: 45 },
  { name: "Boba Tea", sales: 38 },
  { name: "Vegetarian Ramen", sales: 32 },
  { name: "Cold Brew Coffee", sales: 28 },
  { name: "Egg Sandwich", sales: 22 },
];

// Mock recent orders data with more details
const recentOrdersData = [
  {
    id: "1001",
    customerName: "Vivek Kumar",
    date: "Today, 2:30 PM",
    items: [
      { id: "item1", productId: "prod1", productName: "Chicken Rice Bowl", quantity: 1, price: 10.99 },
      { id: "item2", productId: "prod2", productName: "Green Tea", quantity: 1, price: 2.50 }
    ],
    status: "pending" as const,
    total: 13.49
  },
  {
    id: "1002",
    customerName: "Sam Wilson",
    date: "Today, 11:15 AM",
    items: [
      { id: "item3", productId: "prod3", productName: "Cold Brew Coffee", quantity: 2, price: 4.99 },
      { id: "item4", productId: "prod4", productName: "Bacon Sandwich", quantity: 1, price: 7.99 }
    ],
    status: "processing" as const,
    total: 17.97
  },
  {
    id: "1003",
    customerName: "Jamie Lee",
    date: "Yesterday, 5:45 PM",
    items: [
      { id: "item5", productId: "prod5", productName: "Vegetarian Ramen", quantity: 1, price: 12.99 },
      { id: "item6", productId: "prod6", productName: "Boba Tea", quantity: 1, price: 5.50 }
    ],
    status: "delivered" as const,
    total: 18.49
  }
];

const Dashboard: React.FC = () => {
  const { userMode } = useAppContext();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<null | typeof recentOrdersData[0]>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  
  // Redirect to home if not in seller mode
  React.useEffect(() => {
    if (userMode !== "seller") {
      navigate("/");
    }
  }, [userMode, navigate]);

  const handleOpenOrderDetails = (order: typeof recentOrdersData[0]) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setIsOrderDetailsOpen(false);
  };

  return (
    <div className="max-w-screen-xl mx-auto pb-24 px-4 sm:px-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Total Revenue" 
            value="$12,450" 
            description="+14% from last month" 
            icon={<DollarSign className="w-5 h-5 text-gantry-purple" />} 
          />
          <StatsCard 
            title="Total Orders" 
            value="142" 
            description="+7% from last month" 
            icon={<ShoppingBag className="w-5 h-5 text-gantry-purple" />} 
          />
          <StatsCard 
            title="Products" 
            value="24" 
            description="3 new this month" 
            icon={<Package className="w-5 h-5 text-gantry-purple" />} 
          />
          <StatsCard 
            title="Pending Orders" 
            value="8" 
            description="Require action" 
            icon={<Clock className="w-5 h-5 text-gantry-purple" />} 
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 shadow-sm border border-gantry-gray/20">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Daily revenue for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Revenue']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#6B48FF" 
                      fill="#9B85FF" 
                      fillOpacity={0.3} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border border-gantry-gray/20">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best selling products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip 
                      formatter={(value) => [`${value} units`, 'Sales']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="sales" fill="#6B48FF" barSize={20} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm border border-gantry-gray/20">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrdersData.map((order) => (
                  <div key={order.id} className="flex justify-between items-center p-3 bg-gantry-gray/10 rounded-lg">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.items.length} items • ${order.total.toFixed(2)}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenOrderDetails(order)}
                    >
                      View
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-gantry-purple" onClick={() => navigate("/orders")}>
                  View All Orders
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border border-gantry-gray/20">
            <CardHeader>
              <CardTitle>Store Performance</CardTitle>
              <CardDescription>Monthly metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-gray-600">Conversion Rate</p>
                  <p className="font-medium">24.8%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gantry-purple h-2 rounded-full" style={{ width: "24.8%" }}></div>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Repeat Customers</p>
                  <p className="font-medium">62.3%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gantry-purple h-2 rounded-full" style={{ width: "62.3%" }}></div>
                </div>
                
                <div className="flex justify-between">
                  <p className="text-gray-600">Average Order Value</p>
                  <p className="font-medium">$18.75</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gantry-purple h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Order Details Dialog */}
      <OrderDetails 
        isOpen={isOrderDetailsOpen}
        onClose={handleCloseOrderDetails}
        order={selectedOrder}
      />
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon }) => {
  return (
    <Card className="shadow-sm border border-gantry-gray/20">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          </div>
          <div className="p-2 bg-gantry-purple/10 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
