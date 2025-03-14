
import React, { useState } from "react";
import { Package, Plus, Pen, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";

// Mock products data
const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    businessId: "b1",
    name: "Chicken Rice Bowl",
    description: "Tender chicken served over jasmine rice with vegetables",
    price: 9.99,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    category: "Main Dishes"
  },
  {
    id: "p2",
    businessId: "b1",
    name: "Boba Milk Tea",
    description: "Milk tea with tapioca pearls",
    price: 4.50,
    imageUrl: "https://images.unsplash.com/photo-1558857563-c0c3acb72012?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isAvailable: true,
    category: "Beverages"
  },
  {
    id: "p3",
    businessId: "b1",
    name: "Vegetarian Ramen",
    description: "Ramen noodles in vegetable broth with tofu and fresh vegetables",
    price: 11.99,
    imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    isAvailable: false,
    category: "Main Dishes"
  }
];

const Products: React.FC = () => {
  const { userMode } = useAppContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Redirect to home if not in seller mode
  React.useEffect(() => {
    if (userMode !== "seller") {
      navigate("/");
    }
  }, [userMode, navigate]);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({
        businessId: "b1",
        name: "",
        description: "",
        price: 0,
        imageUrl: "",
        isAvailable: true,
        category: ""
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    if (isEditing) {
      // Update existing product
      setProducts(products.map(p => 
        p.id === currentProduct.id ? { ...p, ...currentProduct } as Product : p
      ));
      toast({
        title: "Product Updated",
        description: `${currentProduct.name} has been updated`
      });
    } else {
      // Add new product
      const newProduct = {
        ...currentProduct,
        id: `p${Date.now()}`,
      } as Product;
      
      setProducts([...products, newProduct]);
      toast({
        title: "Product Added",
        description: `${newProduct.name} has been added to your menu`
      });
    }
    
    handleCloseDialog();
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Product Deleted",
      description: "The product has been removed from your menu"
    });
  };

  const handleToggleAvailability = (id: string) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, isAvailable: !p.isAvailable } : p
    ));
  };

  return (
    <div className="max-w-screen-xl mx-auto pb-24 px-4 sm:px-6">
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <Button onClick={() => handleOpenDialog()} className="bg-gantry-purple hover:bg-gantry-purple-dark">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onEdit={() => handleOpenDialog(product)}
                onDelete={() => handleDeleteProduct(product.id)}
                onToggleAvailability={() => handleToggleAvailability(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gantry-gray/20">
            <Package className="w-12 h-12 mx-auto text-gantry-purple/50 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No products yet</h3>
            <p className="text-gray-500 mb-4">Start adding products to your business</p>
            <Button 
              onClick={() => handleOpenDialog()} 
              className="bg-gantry-purple hover:bg-gantry-purple-dark"
            >
              <Plus className="mr-2 h-4 w-4" /> Add First Product
            </Button>
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Product" : "Add New Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={currentProduct?.name || ""}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={currentProduct?.category || ""}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentProduct?.price || ""}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseFloat(e.target.value) })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={currentProduct?.description || ""}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                    className="col-span-3"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    value={currentProduct?.imageUrl || ""}
                    onChange={(e) => setCurrentProduct({ ...currentProduct, imageUrl: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isAvailable" className="text-right">
                    Available
                  </Label>
                  <div className="col-span-3 flex items-center">
                    <input
                      type="checkbox"
                      id="isAvailable"
                      checked={currentProduct?.isAvailable || false}
                      onChange={(e) => setCurrentProduct({ ...currentProduct, isAvailable: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-gantry-purple focus:ring-gantry-purple"
                    />
                    <label htmlFor="isAvailable" className="ml-2 text-sm text-gray-600">
                      Product is available for order
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gantry-purple hover:bg-gantry-purple-dark">
                  {isEditing ? "Update" : "Add"} Product
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailability: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onToggleAvailability }) => {
  return (
    <Card className="overflow-hidden shadow-sm border border-gantry-gray/20">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Unavailable</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
        </div>
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pen className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-700">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant={product.isAvailable ? "outline" : "default"} 
            size="sm" 
            onClick={onToggleAvailability}
            className={product.isAvailable ? "" : "bg-gantry-purple hover:bg-gantry-purple-dark"}
          >
            {product.isAvailable ? "Mark Unavailable" : "Mark Available"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Products;
