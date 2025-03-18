import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface CreateGroupForm {
  name: string;
  description: string;
  maxMembers: number;
  category: string;
  targetAmount: number;
  expiryDate: string;
  image?: string;
  rules: string[];
}

interface FormErrors {
  [key: string]: string;
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Living",
  "Food & Beverages",
  "Beauty & Health",
  "Sports & Outdoors",
  "Books & Stationery",
  "Others",
];

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a group",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }
  }, [isAuthenticated, navigate, toast]);

  const [formData, setFormData] = useState<CreateGroupForm>({
    name: "",
    description: "",
    maxMembers: 2,
    category: "",
    targetAmount: 0,
    expiryDate: "",
    image: "",
    rules: [],
  });

  useEffect(() => {
    console.log("Form Data:", formData);
  }, [formData]);

  const validateForm = (): FormErrors => {
    const errors: FormErrors = {};

    // Name validation
    if (formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters long";
    } else if (formData.name.length > 100) {
      errors.name = "Name cannot exceed 100 characters";
    }

    // Description validation
    if (formData.description.length < 10) {
      errors.description = "Description must be at least 10 characters long";
    } else if (formData.description.length > 500) {
      errors.description = "Description cannot exceed 500 characters";
    }

    // MaxMembers validation
    if (formData.maxMembers < 2) {
      errors.maxMembers = "Group must allow at least 2 members";
    } else if (formData.maxMembers > 100) {
      errors.maxMembers = "Group cannot exceed 100 members";
    }

    // Category validation
    if (!formData.category) {
      errors.category = "Category is required";
    }

    // TargetAmount validation
    if (formData.targetAmount <= 0) {
      errors.targetAmount = "Target amount must be greater than 0";
    } else if (formData.targetAmount > 1000000) {
      errors.targetAmount = "Target amount cannot exceed 1,000,000";
    }

    // ExpiryDate validation
    if (!formData.expiryDate) {
      errors.expiryDate = "Expiry date is required";
    } else if (new Date(formData.expiryDate) <= new Date()) {
      errors.expiryDate = "Expiry date must be in the future";
    }

    // Image URL validation (if provided)
    if (formData.image && !isValidUrl(formData.image)) {
      errors.image = "Invalid image URL";
    }

    // Rules validation
    if (formData.rules.length > 10) {
      errors.rules = "Cannot have more than 10 rules";
    }
    if (formData.rules.some((rule) => rule.length > 200)) {
      errors.rules = "Each rule cannot exceed 200 characters";
    }

    return errors;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a group",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      console.log("Submitting form data:", formData); // Debug log
      const response = await api.post("/groups", formData);
      console.log("API Response:", response.data); // Debug log

      if (response.data.status === "success") {
        toast({
          title: "Success",
          description: "Group created successfully",
        });

        navigate(`/groups/${response.data.data._id}`);
      } else {
        throw new Error(response.data.message || "Failed to create group");
      }
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      console.error("API Error:", apiError); // Debug log
      toast({
        title: "Error",
        description:
          apiError.response?.data?.message ||
          apiError.message ||
          "Failed to create group",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
    if (errors.category) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.category;
        return newErrors;
      });
    }
  };

  const addRule = () => {
    if (formData.rules.length >= 10) {
      setErrors((prev) => ({
        ...prev,
        rules: "Cannot have more than 10 rules",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      rules: [...prev.rules, ""],
    }));
  };

  const removeRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index),
    }));
  };

  const updateRule = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      rules: prev.rules.map((rule, i) => (i === index ? value : rule)),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6">Create a New Group</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Group Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
              placeholder="Enter group name"
              maxLength={100}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-red-500" : ""}
              placeholder="Describe your group"
              maxLength={500}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category Select */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium mb-1"
            >
              Category
            </label>
            <Select
              value={formData.category}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Max Members Input */}
            <div>
              <label
                htmlFor="maxMembers"
                className="block text-sm font-medium mb-1"
              >
                Maximum Members
              </label>
              <Input
                type="number"
                id="maxMembers"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                className={errors.maxMembers ? "border-red-500" : ""}
                min={2}
                max={100}
              />
              {errors.maxMembers && (
                <p className="text-sm text-red-500 mt-1">{errors.maxMembers}</p>
              )}
            </div>

            {/* Target Amount Input */}
            <div>
              <label
                htmlFor="targetAmount"
                className="block text-sm font-medium mb-1"
              >
                Target Amount ($)
              </label>
              <Input
                type="number"
                id="targetAmount"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className={errors.targetAmount ? "border-red-500" : ""}
                min={0}
                max={1000000}
                step="0.01"
              />
              {errors.targetAmount && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.targetAmount}
                </p>
              )}
            </div>
          </div>

          {/* Expiry Date Input */}
          <div>
            <label
              htmlFor="expiryDate"
              className="block text-sm font-medium mb-1"
            >
              Expiry Date
            </label>
            <Input
              type="datetime-local"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={errors.expiryDate ? "border-red-500" : ""}
              min={new Date().toISOString().slice(0, 16)}
            />
            {errors.expiryDate && (
              <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>
            )}
          </div>

          {/* Image URL Input */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium mb-1">
              Image URL (Optional)
            </label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className={errors.image ? "border-red-500" : ""}
              placeholder="Enter image URL"
            />
            {errors.image && (
              <p className="text-sm text-red-500 mt-1">{errors.image}</p>
            )}
          </div>

          {/* Rules Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Rules (Optional)
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRule}
                disabled={formData.rules.length >= 10}
              >
                Add Rule
              </Button>
            </div>
            <div className="space-y-2">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={rule}
                    onChange={(e) => updateRule(index, e.target.value)}
                    placeholder={`Rule ${index + 1}`}
                    maxLength={200}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRule(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            {errors.rules && (
              <p className="text-sm text-red-500 mt-1">{errors.rules}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;
