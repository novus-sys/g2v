
import React from "react";
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock cart data
const CART_ITEMS = [
  {
    id: "item-001",
    name: "Iced Caramel Latte",
    business: "Campus Brews",
    price: 4.99,
    quantity: 2,
    imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "item-002",
    name: "Chicken Sandwich",
    business: "Student Bites",
    price: 8.50,
    quantity: 1,
    imageUrl: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const Cart: React.FC = () => {
  const subtotal = CART_ITEMS.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <div className="max-w-screen-xl mx-auto pb-24 section-padding">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        
        {CART_ITEMS.length > 0 ? (
          <div className="space-y-8">
            <div className="space-y-4">
              {CART_ITEMS.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gantry-gray/20">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-gantry-purple hover:bg-gantry-purple-dark"
                onClick={() => console.log("Proceed to checkout")}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gantry-gray/20">
            <ShoppingCart className="w-12 h-12 mx-auto text-gantry-purple/50 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-4">
              Looks like you haven't added any items to your cart yet
            </p>
            <a 
              href="/explore" 
              className="inline-block bg-gantry-purple hover:bg-gantry-purple-dark text-white px-6 py-2 rounded-lg transition-colors"
            >
              Explore Businesses
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

interface CartItemProps {
  item: {
    id: string;
    name: string;
    business: string;
    price: number;
    quantity: number;
    imageUrl: string;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gantry-gray/20 overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden mb-4 sm:mb-0 sm:mr-4">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">From {item.business}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-2">
                <button 
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => console.log("Decrease quantity")}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-medium">{item.quantity}</span>
                <button 
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  onClick={() => console.log("Increase quantity")}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                className="text-red-500 hover:text-red-700 flex items-center space-x-1"
                onClick={() => console.log("Remove item")}
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Remove</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
