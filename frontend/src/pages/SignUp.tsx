import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { School, Store, Upload } from 'lucide-react';

type UserRole = 'student' | 'vendor' | null;
type RegistrationStep = 'role' | 'basic' | 'details';

const basicInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

const vendorDetailsSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(1, 'Address is required'),
  category: z.string().min(1, 'Category is required'),
  contactEmail: z.string().email('Invalid contact email'),
  contactPhone: z.string().min(8, 'Invalid phone number'),
  businessType: z.string().min(1, 'Business type is required'),
  openingHours: z.string().min(1, 'Opening hours are required'),
  closingHours: z.string().min(1, 'Closing hours are required'),
});

const studentDetailsSchema = z.object({
  studentEmail: z.string().email('Invalid student email'),
  studentId: z.string().min(1, 'Student ID is required'),
  university: z.string().min(1, 'University/College name is required'),
  course: z.string().optional(),
  year: z.string().optional(),
});

const businessCategories = [
  'Food & Beverage',
  'Retail',
  'Services',
  'Technology',
  'Education',
  'Entertainment',
  'Other'
];

const businessTypes = [
  'Sole Proprietorship',
  'Partnership',
  'Corporation',
  'LLC',
  'Other'
];

const studyYears = [
  'Year 1',
  'Year 2',
  'Year 3',
  'Year 4',
  'Graduate',
  'Other'
];

export default function SignUp() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // Vendor Details
    businessName: '',
    description: '',
    address: '',
    category: '',
    contactEmail: '',
    contactPhone: '',
    businessType: '',
    openingHours: '',
    closingHours: '',
    logo: null as File | null,
    coverImage: null as File | null,
    // Student Details
    studentEmail: '',
    studentId: '',
    university: '',
    course: '',
    year: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student') {
      toast({
        title: "Student Registration",
        description: "As a student, you can also become a seller by toggling to seller mode after registration!",
      });
    }
    setCurrentStep('basic');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleBasicInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      basicInfoSchema.parse(formData);
      setCurrentStep('details');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach(err => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate role-specific details
      if (selectedRole === 'vendor') {
        vendorDetailsSchema.parse(formData);
      } else {
        studentDetailsSchema.parse(formData);
      }

      // Prepare role-specific details
      const roleDetails = selectedRole === 'vendor' 
        ? {
            businessDetails: {
              businessName: formData.businessName,
              description: formData.description,
              address: formData.address,
              category: formData.category,
              contactEmail: formData.contactEmail,
              contactPhone: formData.contactPhone,
              businessType: formData.businessType,
              openingHours: formData.openingHours,
              closingHours: formData.closingHours
            }
          }
        : {
            studentDetails: {
              studentId: formData.studentId,
              studentEmail: formData.studentEmail,
              university: formData.university,
              course: formData.course,
              year: formData.year
            }
          };

      // Register using auth context with all required info
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        selectedRole as 'student' | 'vendor', // We know it's defined at this point
        roleDetails
      );

      // Show success toast
      toast({
        title: "Registration successful!",
        description: "Please sign in with your new account.",
      });

      // Redirect to sign in
      navigate('/signin', { 
        replace: true,
        state: { message: 'Registration successful! Please sign in.' }
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach(err => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else if (error.message === 'Email already registered') {
        setErrors({
          email: 'This email is already registered. Please use a different email or sign in.'
        });
      } else {
        setErrors({
          submit: error.message || 'An error occurred during registration. Please try again.'
        });
      }

      toast({
        title: "Registration failed",
        description: "Please check the form for errors and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Choose how you want to use Gantries
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleRoleSelect('student')}
          className="flex flex-col items-center p-6 border-2 border-gantry-gray/30 rounded-xl hover:border-gantry-purple transition-colors"
        >
          <School className="w-12 h-12 text-gantry-purple mb-4" />
          <h3 className="text-lg font-semibold mb-2">Student</h3>
          <p className="text-sm text-gray-600 text-center">
            Join group buys and optionally become a seller later
          </p>
        </button>

        <button
          onClick={() => handleRoleSelect('vendor')}
          className="flex flex-col items-center p-6 border-2 border-gantry-gray/30 rounded-xl hover:border-gantry-purple transition-colors"
        >
          <Store className="w-12 h-12 text-gantry-purple mb-4" />
          <h3 className="text-lg font-semibold mb-2">Vendor</h3>
          <p className="text-sm text-gray-600 text-center">
            List your business and manage group buys
          </p>
        </button>
      </div>
    </div>
  );

  const renderBasicInfo = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedRole === 'student' ? 'Student Registration' : 'Vendor Registration'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Please fill in your details to continue
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleBasicInfoSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 8 characters and include uppercase, lowercase, and numbers
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('role')}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-gantry-purple hover:bg-gantry-purple-dark"
          >
            Continue
          </Button>
        </div>
      </form>
    </div>
  );

  const renderVendorDetails = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Business Details
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Tell us about your business
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleDetailsSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name
            </label>
            <Input
              id="businessName"
              name="businessName"
              type="text"
              required
              placeholder="Your business name"
              value={formData.businessName}
              onChange={handleChange}
              className={errors.businessName ? "border-red-500" : ""}
            />
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Business Description
            </label>
            <Textarea
              id="description"
              name="description"
              required
              placeholder="Describe your business..."
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Business Address
            </label>
            <Input
              id="address"
              name="address"
              type="text"
              required
              placeholder="Full business address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-600">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Business Category
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {businessCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                Business Type
              </label>
              <Select
                value={formData.businessType}
                onValueChange={(value) => handleSelectChange('businessType', value)}
              >
                <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.businessType && (
                <p className="mt-1 text-sm text-red-600">{errors.businessType}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                required
                placeholder="Business contact email"
                value={formData.contactEmail}
                onChange={handleChange}
                className={errors.contactEmail ? "border-red-500" : ""}
              />
              {errors.contactEmail && (
                <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
              )}
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone
              </label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                required
                placeholder="Business phone"
                value={formData.contactPhone}
                onChange={handleChange}
                className={errors.contactPhone ? "border-red-500" : ""}
              />
              {errors.contactPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.contactPhone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700 mb-1">
                Opening Hours
              </label>
              <Input
                id="openingHours"
                name="openingHours"
                type="time"
                required
                value={formData.openingHours}
                onChange={handleChange}
                className={errors.openingHours ? "border-red-500" : ""}
              />
              {errors.openingHours && (
                <p className="mt-1 text-sm text-red-600">{errors.openingHours}</p>
              )}
            </div>

            <div>
              <label htmlFor="closingHours" className="block text-sm font-medium text-gray-700 mb-1">
                Closing Hours
              </label>
              <Input
                id="closingHours"
                name="closingHours"
                type="time"
                required
                value={formData.closingHours}
                onChange={handleChange}
                className={errors.closingHours ? "border-red-500" : ""}
              />
              {errors.closingHours && (
                <p className="mt-1 text-sm text-red-600">{errors.closingHours}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Business Logo
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="logo" className="relative cursor-pointer rounded-md font-medium text-gantry-purple hover:text-gantry-purple-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gantry-purple">
                      <span>Upload a file</span>
                      <Input
                        id="logo"
                        name="logo"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleFileChange(e, 'logo')}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="coverImage" className="relative cursor-pointer rounded-md font-medium text-gantry-purple hover:text-gantry-purple-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gantry-purple">
                      <span>Upload a file</span>
                      <Input
                        id="coverImage"
                        name="coverImage"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => handleFileChange(e, 'coverImage')}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              {errors.submit}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('basic')}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gantry-purple hover:bg-gantry-purple-dark"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </div>
      </form>
    </div>
  );

  const renderStudentDetails = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Student Details
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Tell us about your academic information
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleDetailsSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Student Email
            </label>
            <Input
              id="studentEmail"
              name="studentEmail"
              type="email"
              required
              placeholder="Your student email"
              value={formData.studentEmail}
              onChange={handleChange}
              className={errors.studentEmail ? "border-red-500" : ""}
            />
            {errors.studentEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.studentEmail}</p>
            )}
          </div>

          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <Input
              id="studentId"
              name="studentId"
              type="text"
              required
              placeholder="Your student ID"
              value={formData.studentId}
              onChange={handleChange}
              className={errors.studentId ? "border-red-500" : ""}
            />
            {errors.studentId && (
              <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
            )}
          </div>

          <div>
            <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
              University/College Name
            </label>
            <Input
              id="university"
              name="university"
              type="text"
              required
              placeholder="Your university or college name"
              value={formData.university}
              onChange={handleChange}
              className={errors.university ? "border-red-500" : ""}
            />
            {errors.university && (
              <p className="mt-1 text-sm text-red-600">{errors.university}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                Course (Optional)
              </label>
              <Input
                id="course"
                name="course"
                type="text"
                placeholder="Your course"
                value={formData.course}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year (Optional)
              </label>
              <Select
                value={formData.year}
                onValueChange={(value) => handleSelectChange('year', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {studyYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {errors.submit && (
          <div className="p-4 bg-red-50 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              {errors.submit}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCurrentStep('basic')}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gantry-purple hover:bg-gantry-purple-dark"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gantry-gray-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gantry-gray/20">
          {currentStep === 'role' && renderRoleSelection()}
          {currentStep === 'basic' && renderBasicInfo()}
          {currentStep === 'details' && selectedRole === 'vendor' && renderVendorDetails()}
          {currentStep === 'details' && selectedRole === 'student' && renderStudentDetails()}

          <div className="mt-6 text-center">
            <Link 
              to="/signin" 
              className="text-sm font-medium text-gantry-purple hover:text-gantry-purple-dark"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 