
import React from "react";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// Mock payment methods data
const PAYMENT_METHODS = [
  {
    id: "1",
    type: "credit",
    last4: "4242",
    expiry: "12/24",
    brand: "Visa",
    isDefault: true,
  },
  {
    id: "2",
    type: "credit",
    last4: "8888",
    expiry: "06/25",
    brand: "Mastercard",
    isDefault: false,
  },
];

const PaymentMethods = () => {
  return (
    <div className="max-w-screen-xl mx-auto pb-24 section-padding">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Payment Methods</h1>
          <p className="text-gray-600">Manage your payment methods securely</p>
        </div>

        <Button className="w-full mb-6 gap-2">
          <Plus className="w-4 h-4" />
          Add New Payment Method
        </Button>

        <div className="space-y-4">
          {PAYMENT_METHODS.map((method) => (
            <Card key={method.id} className="relative overflow-hidden">
              {method.isDefault && (
                <div className="absolute top-2 right-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Default
                  </span>
                </div>
              )}
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-gantry-purple/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-gantry-purple" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {method.brand} •••• {method.last4}
                  </h3>
                  <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between pt-2 border-t">
                  {!method.isDefault && (
                    <Button variant="outline" size="sm">
                      Set as Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;
