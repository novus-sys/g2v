
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderItem } from "@/types";
import { Check, Clock, X } from "lucide-react";

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    customerName: string;
    date: string;
    items: OrderItem[];
    status: "pending" | "processing" | "delivered" | "cancelled";
    total: number;
  } | null;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!order) return null;

  const statusIcon = {
    pending: <Clock className="w-4 h-4 text-blue-500" />,
    processing: <Clock className="w-4 h-4 text-yellow-500" />,
    delivered: <Check className="w-4 h-4 text-green-500" />,
    cancelled: <X className="w-4 h-4 text-red-500" />,
  };
  
  const statusText = {
    pending: "Pending",
    processing: "Processing",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  
  const statusColor = {
    pending: "bg-blue-100 text-blue-800",
    processing: "bg-yellow-100 text-yellow-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const handleStatusChange = (newStatus: "processing" | "delivered" | "cancelled") => {
    console.log(`Changed order ${order.id} status to ${newStatus}`);
    // Here you would typically update the order status in your backend
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order #{order.id} • {order.date}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Customer</span>
            <span>{order.customerName}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Status</span>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${statusColor[order.status]}`}>
              {statusIcon[order.status]}
              <span>{statusText[order.status]}</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Items</h4>
            <div className="space-y-2 ml-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.quantity}x {item.productName}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
          
          {order.status === "pending" && (
            <div className="flex space-x-2 pt-2">
              <Button 
                className="w-full" 
                onClick={() => handleStatusChange("processing")}
              >
                Accept Order
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:text-red-700" 
                onClick={() => handleStatusChange("cancelled")}
              >
                Decline
              </Button>
            </div>
          )}
          
          {order.status === "processing" && (
            <Button 
              className="w-full" 
              onClick={() => handleStatusChange("delivered")}
            >
              Mark as Delivered
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetails;
