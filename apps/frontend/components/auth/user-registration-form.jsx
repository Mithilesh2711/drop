'use client';

import { useState, useRef, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentUploader from '../ui/DocumentUploader';
import { Spinner } from '../ui/spinner';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const API_BASE_URL = 'http://localhost:5000';

export default function UserRegistrationForm() {
  console.log('UserRegistrationForm component rendered');

  const [isLoading, setIsLoading] = useState(false);
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [errors, setErrors] = useState({});
  const [customerSignature, setCustomerSignature] = useState(null);
  const [installerSignature, setInstallerSignature] = useState(null);
  const [locationDetails, setLocationDetails] = useState({
    state: '',
    city: '',
    district: '',
    address: '',
    pincode: ''
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [pincodes, setPincodes] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [securityDeposit, setSecurityDeposit] = useState('');
  
  const customerSignatureRef = useRef();
  const installerSignatureRef = useRef();

  const router = useRouter();

  // Fetch states on component mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch('/api/location-codes');
        if (response.ok) {
          const data = await response.json();
          setStates(data);
        } else {
          console.error('Failed to fetch states');
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };

    fetchStates();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (locationDetails.state) {
        try {
          const stateCode = locationDetails.state.substring(0, 2).toUpperCase();
          const response = await fetch(`/api/location-codes?stateCode=${stateCode}`);
          if (response.ok) {
            const data = await response.json();
            setCities(data);
          } else {
            console.error('Failed to fetch cities');
          }
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [locationDetails.state]);

  // Generate customer ID when state, city, and pincode are all provided
  useEffect(() => {
    const generateCustomerId = async () => {
      if (locationDetails.state && locationDetails.city && locationDetails.pincode) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/location-codes/generate-customer-id`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              pincode: locationDetails.pincode
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Generated customer ID:', data.customerId);
            setCustomerId(data.customerId);
          } else {
            console.error('Failed to generate customer ID');
            toast.error('Failed to generate customer ID');
          }
        } catch (error) {
          console.error('Error generating customer ID:', error);
          toast.error('Error generating customer ID');
        }
      }
    };

    generateCustomerId();
  }, [locationDetails.state, locationDetails.city, locationDetails.pincode]);

  // Fetch pincodes on mount
  useEffect(() => {
    const fetchPincodes = async () => {
      try {
        console.log('Fetching pincodes...');
        const response = await fetch('/api/location-codes/pincodes');
        console.log('Pincodes response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Pincodes data:', data);
          setPincodes(data);
        } else {
          console.error('Failed to fetch pincodes:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } catch (error) {
        console.error('Error fetching pincodes:', error);
      }
    };
    fetchPincodes();
  }, []);

  // Fetch plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        console.log('Fetching plans...');
        const response = await fetch(`${API_BASE_URL}/api/plans`);
        console.log('Plans response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Plans data:', data);
          setPlans(data);
        } else {
          console.error('Failed to fetch plans:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error response:', errorText);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  // Add effect to log plans state changes
  useEffect(() => {
    console.log('Plans state updated:', plans);
  }, [plans]);

  // When pincode changes, fetch location details
  const handlePincodeChange = async (pincode) => {
    setLocationDetails(prev => ({ ...prev, pincode }));
    if (!pincode) {
      setLocationDetails({ state: '', city: '', district: '', address: '', pincode: '' });
      return;
    }
    try {
      const response = await fetch(`/api/location-codes/location/${pincode}`);
      if (response.ok) {
        const data = await response.json();
        setLocationDetails(prev => ({
          ...prev,
          pincode: data.pincode,
          state: data.state,
          district: data.district,
          city: data.city
        }));
      } else {
        setLocationDetails(prev => ({ ...prev, state: '', district: '', city: '' }));
      }
    } catch (error) {
      setLocationDetails(prev => ({ ...prev, state: '', district: '', city: '' }));
    }
  };

  // Update security deposit when plan changes
  const handlePlanChange = (planId) => {
    const plan = plans.find(p => p._id === planId);
    setSelectedPlan(plan);
    if (plan) {
      setSecurityDeposit(plan.securityDeposit);
    }
  };

  const handleAadhaarFrontUpload = (fileInfo) => {
    setAadhaarFront(fileInfo);
    setErrors(prev => ({ ...prev, aadhaarFront: null }));
  };

  const handleAadhaarBackUpload = (fileInfo) => {
    setAadhaarBack(fileInfo);
    setErrors(prev => ({ ...prev, aadhaarBack: null }));
  };

  const clearSignature = (type) => {
    if (type === 'customer') {
      customerSignatureRef.current.clear();
      setCustomerSignature(null);
    } else {
      installerSignatureRef.current.clear();
      setInstallerSignature(null);
    }
  };

  const handleCustomerSignatureEnd = () => {
    if (customerSignatureRef.current) {
      const signatureData = customerSignatureRef.current.toDataURL();
      setCustomerSignature(signatureData);
    }
  };

  const handleInstallerSignatureEnd = () => {
    if (installerSignatureRef.current) {
      const signatureData = installerSignatureRef.current.toDataURL();
      setInstallerSignature(signatureData);
    }
  };

  const uploadSignatureToAWS = async (signatureData, type) => {
    try {
      console.log(`Uploading ${type} signature to AWS`);
      
      // Convert data URL to Blob
      const base64Data = signatureData.split(',')[1];
      const blob = await fetch(`data:image/png;base64,${base64Data}`).then(res => res.blob());
      
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', blob, `${type}-signature.png`);
      formData.append('type', 'signature');
      
      // Upload to AWS via the Next.js API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error(`${type} signature upload failed:`, errorData);
        throw new Error(`Upload failed: ${errorData.error || 'Unknown error'}`);
      }
      
      const result = await response.json();
      console.log(`${type} signature upload result:`, result);
      return result.location;
    } catch (error) {
      console.error(`Error uploading ${type} signature:`, error);
      throw error;
    }
  };

  const handleLocationChange = (field, value) => {
    setLocationDetails(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (formData) => {
    console.log('Starting form validation');
    const newErrors = {};
    
    // Personal Information
    if (!formData.get('name')) {
      console.log('Name validation failed');
      newErrors.name = 'Full name is required';
    }
    if (!formData.get('fatherSpouseName')) {
      console.log('Father/Spouse name validation failed');
      newErrors.fatherSpouseName = 'Father/Spouse name is required';
    }
    if (!formData.get('mobile')) {
      console.log('Mobile validation failed');
      newErrors.mobile = 'Mobile number is required';
    }
    else if (!/^[0-9]{10}$/.test(formData.get('mobile'))) {
      console.log('Mobile format validation failed');
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    
    if (formData.get('alternateContact') && !/^[0-9]{10}$/.test(formData.get('alternateContact'))) {
      console.log('Alternate contact format validation failed');
      newErrors.alternateContact = 'Alternate contact must be 10 digits';
    }
    
    if (!formData.get('email')) {
      console.log('Email validation failed');
      newErrors.email = 'Email is required';
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email'))) {
      console.log('Email format validation failed');
      newErrors.email = 'Invalid email format';
    }
    
    // Address Information
    if (!locationDetails.address) {
      console.log('Address validation failed');
      newErrors.address = 'Address is required';
    }
    if (!locationDetails.city) {
      console.log('City validation failed');
      newErrors.city = 'City is required';
    }
    if (!locationDetails.pincode) {
      console.log('Pincode validation failed');
      newErrors.pincode = 'Pincode is required';
    }
    else if (!/^[0-9]{6}$/.test(locationDetails.pincode)) {
      console.log('Pincode format validation failed');
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    
    // Document Information
    if (!formData.get('aadhaarNumber')) {
      console.log('Aadhaar number validation failed');
      newErrors.aadhaarNumber = 'Aadhaar number is required';
    }
    else if (!/^[0-9]{12}$/.test(formData.get('aadhaarNumber'))) {
      console.log('Aadhaar number format validation failed');
      newErrors.aadhaarNumber = 'Aadhaar number must be 12 digits';
    }
    
    if (!aadhaarFront) {
      console.log('Aadhaar front image validation failed');
      newErrors.aadhaarFront = 'Aadhaar front image is required';
    }
    if (!aadhaarBack) {
      console.log('Aadhaar back image validation failed');
      newErrors.aadhaarBack = 'Aadhaar back image is required';
    }
    
    // Installation Details
    if (!formData.get('modelInstalled')) {
      console.log('Model installed validation failed');
      newErrors.modelInstalled = 'Model installed is required';
    }
    if (!formData.get('serialNumber')) {
      console.log('Serial number validation failed');
      newErrors.serialNumber = 'Serial number is required';
    }
    if (!formData.get('flowSensorId')) {
      console.log('Flow sensor ID validation failed');
      newErrors.flowSensorId = 'Flow sensor ID is required';
    }
    
    // Payment & Plan Details
    if (!formData.get('planSelected')) {
      console.log('Plan selected validation failed');
      newErrors.planSelected = 'Plan selected is required';
    }
    if (!formData.get('securityDeposit')) {
      console.log('Security deposit validation failed');
      newErrors.securityDeposit = 'Security deposit is required';
    }
    else if (isNaN(formData.get('securityDeposit')) || parseFloat(formData.get('securityDeposit')) <= 0) {
      console.log('Security deposit format validation failed');
      newErrors.securityDeposit = 'Security deposit must be a positive number';
    }
    
    if (!formData.get('paymentMode')) {
      console.log('Payment mode validation failed');
      newErrors.paymentMode = 'Payment mode is required';
    }
    
    // Signatures
    if (!customerSignature) {
      console.log('Customer signature validation failed');
      newErrors.customerSignature = 'Customer signature is required';
    }
    
    if (!installerSignature) {
      console.log('Installer signature validation failed');
      newErrors.installerSignature = 'Installer signature is required';
    }
    if (!formData.get('installerName')) {
      console.log('Installer name validation failed');
      newErrors.installerName = 'Installer name is required';
    }
    if (!formData.get('installerContact')) {
      console.log('Installer contact validation failed');
      newErrors.installerContact = 'Installer contact is required';
    }
    else if (!/^[0-9]{10}$/.test(formData.get('installerContact'))) {
      console.log('Installer contact format validation failed');
      newErrors.installerContact = 'Installer contact must be 10 digits';
    }
    
    console.log('Form validation completed. Errors:', newErrors);
    return newErrors;
  };

  const onSubmit = async (event) => {
    try {
      console.log('Form submission started');
      event.preventDefault();
      setIsLoading(true);
      
      // Get form data
      const formData = new FormData(event.target);
      
      // Log all form fields
      console.log('Form fields:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }
      
      // Validate form
      console.log('Validating form...');
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        console.log('Validation errors:', validationErrors);
        setErrors(validationErrors);
        setIsLoading(false);
        return;
      }
      
      // Convert FormData to object
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      // Add location details and customer ID
      data.state = locationDetails.state;
      data.city = locationDetails.city;
      data.district = locationDetails.district;
      data.address = locationDetails.address;
      data.pincode = locationDetails.pincode;
      data.customerId = customerId;
      
      console.log('Form data:', data);
      
      // Check if we have the required files
      console.log('Aadhaar front:', aadhaarFront);
      console.log('Aadhaar back:', aadhaarBack);
      
      // Validate customer ID
      if (!customerId) {
        console.error('Customer ID is missing');
        toast.error('Customer ID is required. Please fill in your location details.');
        setIsLoading(false);
        return;
      }
      
      // Upload Aadhaar front image
      if (!aadhaarFront || !aadhaarFront.file) {
        console.error('Aadhaar front image is missing');
        toast.error('Aadhaar front image is required');
        setIsLoading(false);
        return;
      }
      
      const aadhaarFrontFormData = new FormData();
      aadhaarFrontFormData.append('file', aadhaarFront.file);
      aadhaarFrontFormData.append('folder', 'aadhaar');
      
      console.log('Uploading Aadhaar front image...');
      let aadhaarFrontResult;
      try {
        const aadhaarFrontResponse = await fetch('/api/upload', {
          method: 'POST',
          body: aadhaarFrontFormData,
          headers: {
            // Remove Content-Type header to let the browser set it with the boundary
          }
        });
        
        console.log('Aadhaar front response status:', aadhaarFrontResponse.status);
        
        if (!aadhaarFrontResponse.ok) {
          const errorData = await aadhaarFrontResponse.json();
          console.error('Aadhaar front upload error:', errorData);
          
          // If the error is related to ACLs, we'll use a fallback approach
          if (errorData.error && errorData.error.includes('ACL')) {
            console.log('ACL error detected, using fallback approach');
            // For now, we'll use a placeholder URL
            aadhaarFrontResult = { location: 'placeholder-url-for-aadhaar-front' };
            toast.warning('File upload limited due to server configuration. Using placeholder URL.');
          } else {
            throw new Error(`Failed to upload Aadhaar front image: ${errorData.error || 'Unknown error'}`);
          }
        } else {
          aadhaarFrontResult = await aadhaarFrontResponse.json();
          console.log('Aadhaar front upload result:', aadhaarFrontResult);
        }
      } catch (error) {
        console.error('Error during Aadhaar front upload:', error);
        throw error;
      }
      
      // Upload Aadhaar back image
      if (!aadhaarBack || !aadhaarBack.file) {
        console.error('Aadhaar back image is missing');
        toast.error('Aadhaar back image is required');
        setIsLoading(false);
        return;
      }
      
      const aadhaarBackFormData = new FormData();
      aadhaarBackFormData.append('file', aadhaarBack.file);
      aadhaarBackFormData.append('folder', 'aadhaar');
      
      console.log('Uploading Aadhaar back image...');
      let aadhaarBackResult;
      try {
        const aadhaarBackResponse = await fetch('/api/upload', {
          method: 'POST',
          body: aadhaarBackFormData,
          headers: {
            // Remove Content-Type header to let the browser set it with the boundary
          }
        });
        
        console.log('Aadhaar back response status:', aadhaarBackResponse.status);
        
        if (!aadhaarBackResponse.ok) {
          const errorData = await aadhaarBackResponse.json();
          console.error('Aadhaar back upload error:', errorData);
          
          // If the error is related to ACLs, we'll use a fallback approach
          if (errorData.error && errorData.error.includes('ACL')) {
            console.log('ACL error detected, using fallback approach');
            // For now, we'll use a placeholder URL
            aadhaarBackResult = { location: 'placeholder-url-for-aadhaar-back' };
            toast.warning('File upload limited due to server configuration. Using placeholder URL.');
          } else {
            throw new Error(`Failed to upload Aadhaar back image: ${errorData.error || 'Unknown error'}`);
          }
        } else {
          aadhaarBackResult = await aadhaarBackResponse.json();
          console.log('Aadhaar back upload result:', aadhaarBackResult);
        }
      } catch (error) {
        console.error('Error during Aadhaar back upload:', error);
        throw error;
      }

      // Upload signatures to AWS
      let customerSignatureUrl = null;
      let installerSignatureUrl = null;
      
      if (customerSignature) {
        try {
          customerSignatureUrl = await uploadSignatureToAWS(customerSignature, 'customer');
          console.log('Customer signature uploaded:', customerSignatureUrl);
        } catch (error) {
          console.error('Customer signature upload error:', error);
          toast.error('Customer signature upload failed. Please try again.');
          return;
        }
      }
      
      if (installerSignature) {
        try {
          installerSignatureUrl = await uploadSignatureToAWS(installerSignature, 'installer');
          console.log('Installer signature uploaded:', installerSignatureUrl);
        } catch (error) {
          console.error('Installer signature upload error:', error);
          toast.error('Installer signature upload failed. Please try again.');
          return;
        }
      }
      
      // Prepare the registration data with file URLs
      const registrationData = {
        ...data,
        aadhaarFrontUrl: aadhaarFrontResult.location,
        aadhaarBackUrl: aadhaarBackResult.location,
        customerSignature: customerSignatureUrl,
        installerSignature: installerSignatureUrl,
        customerId: customerId,
        state: locationDetails.state,
        city: locationDetails.city,
        district: locationDetails.district,
        address: locationDetails.address,
        pincode: locationDetails.pincode
      };

      console.log('Sending registration data with customer ID:', registrationData);

      // Send the registration request
      console.log('Sending registration request to /api/auth/register');
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      console.log('Registration response status:', response.status);
      
      const result = await response.json();
      console.log('Registration response:', result);

      if (!response.ok) {
        // Log the full error details for debugging
        console.error('Registration failed with error:', result);
        
        // Check if the error is in the format { message: '...' }
        if (result && result.message) {
          throw new Error(result.message);
        } else {
          throw new Error(result.error || 'Registration failed');
        }
      }

      // Handle successful registration
      toast.success('Registration successful!');
      router.push('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Extract the error message, handling different error formats
      let errorMessage = '';
      
      // Check if error is a string
      if (typeof error === 'string') {
        errorMessage = error;
      } 
      // Check if error is an object with message property
      else if (error && typeof error === 'object' && error.message) {
        errorMessage = error.message;
      }
      // Check if error is an object with error property
      else if (error && typeof error === 'object' && error.error) {
        errorMessage = error.error;
      }
      // Fallback
      else {
        errorMessage = 'Registration failed. Please try again.';
      }
      
      console.log('Extracted error message:', errorMessage);
      
      // Display the error message in a toast notification
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a direct button click handler function
  const handleButtonClick = () => {
    console.log('Register button clicked directly');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>User Registration</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          id="registrationForm"
          onSubmit={(e) => {
            console.log('Form onSubmit triggered - DEBUG');
            e.preventDefault();
            console.log('Form submission prevented - DEBUG');
            onSubmit(e);
          }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-black pb-2">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  className={errors.name ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherSpouseName">Father's / Spouse's Name</Label>
                <Input
                  id="fatherSpouseName"
                  name="fatherSpouseName"
                  className={errors.fatherSpouseName ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.fatherSpouseName && <p className="text-red-500 text-sm">{errors.fatherSpouseName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  className={errors.mobile ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternateContact">Alternate Contact Number</Label>
                <Input
                  id="alternateContact"
                  name="alternateContact"
                  className={errors.alternateContact ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.alternateContact && <p className="text-red-500 text-sm">{errors.alternateContact}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-black pb-2">Address Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Complete Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={locationDetails.address}
                  onChange={(e) => handleLocationChange('address', e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  name="landmark"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Select
                    value={locationDetails.pincode}
                    onValueChange={handlePincodeChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className={errors.pincode ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select Pincode" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      {pincodes.map((item) => (
                        <SelectItem key={item.pincode} value={item.pincode}>
                          {item.pincode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={locationDetails.state}
                    readOnly
                    className="bg-gray-100"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    name="district"
                    value={locationDetails.district}
                    readOnly
                    className="bg-gray-100"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={locationDetails.city}
                    readOnly
                    className="bg-gray-100"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-black pb-2">Document Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaarNumber">Aadhaar Card Number</Label>
                <Input
                  id="aadhaarNumber"
                  name="aadhaarNumber"
                  className={errors.aadhaarNumber ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.aadhaarNumber && <p className="text-red-500 text-sm">{errors.aadhaarNumber}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaarFront">Aadhaar Card Front</Label>
                  <DocumentUploader
                    onUploadComplete={handleAadhaarFrontUpload}
                    label="Upload Aadhaar Front"
                    accept="image/*"
                    maxSizeMB={2}
                  />
                  {errors.aadhaarFront && <p className="text-red-500 text-sm">{errors.aadhaarFront}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaarBack">Aadhaar Card Back</Label>
                  <DocumentUploader
                    onUploadComplete={handleAadhaarBackUpload}
                    label="Upload Aadhaar Back"
                    accept="image/*"
                    maxSizeMB={2}
                  />
                  {errors.aadhaarBack && <p className="text-red-500 text-sm">{errors.aadhaarBack}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  name="customerId"
                  value={customerId || 'Generating...'}
                  readOnly
                  disabled={true}
                  className={`bg-gray-100 ${!customerId && 'text-gray-500 italic'}`}
                />
                <p className="text-sm text-gray-500">
                  {!customerId && locationDetails.pincode 
                    ? 'Generating customer ID based on your location details...'
                    : !locationDetails.pincode 
                      ? 'Please fill in your location details to generate a customer ID'
                      : 'Customer ID has been generated based on your location details.'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-black pb-2">Installation Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelInstalled">Model Installed</Label>
                <Input
                  id="modelInstalled"
                  name="modelInstalled"
                  className={errors.modelInstalled ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.modelInstalled && <p className="text-red-500 text-sm">{errors.modelInstalled}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  name="serialNumber"
                  className={errors.serialNumber ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.serialNumber && <p className="text-red-500 text-sm">{errors.serialNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="flowSensorId">Flow Sensor ID</Label>
                <Input
                  id="flowSensorId"
                  name="flowSensorId"
                  className={errors.flowSensorId ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.flowSensorId && <p className="text-red-500 text-sm">{errors.flowSensorId}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tdsBefore">TDS Level (Before Installation)</Label>
                <Input
                  id="tdsBefore"
                  name="tdsBefore"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tdsAfter">TDS Level (After Installation)</Label>
                <Input
                  id="tdsAfter"
                  name="tdsAfter"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-black pb-2">Payment & Plan Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="planSelected">Select Plan</Label>
                <Select onValueChange={handlePlanChange} name="planSelected">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a plan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    {plans.map((plan) => (
                      <SelectItem key={plan._id} value={plan._id}>
                        {plan.name} - ₹{plan.monthlyCharge}/month (Security: ₹{plan.securityDeposit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.planSelected && <p className="text-red-500 text-sm">{errors.planSelected}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                <Input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  readOnly
                />
                {errors.securityDeposit && <p className="text-red-500 text-sm">{errors.securityDeposit}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode</Label>
                <Select name="paymentMode">
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.paymentMode && <p className="text-red-500 text-sm">{errors.paymentMode}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold border-b border-black pb-2">Signatures</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Customer Signature</Label>
                <div className="border rounded-md p-2">
                  <SignaturePad
                    ref={customerSignatureRef}
                    onEnd={handleCustomerSignatureEnd}
                    canvasProps={{
                      className: 'w-full h-32 border rounded'
                    }}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => clearSignature('customer')}
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                </div>
                {errors.customerSignature && <p className="text-red-500 text-sm">{errors.customerSignature}</p>}
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="installerName">Installer Name</Label>
                  <Input
                    id="installerName"
                    name="installerName"
                    className={errors.installerName ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.installerName && <p className="text-red-500 text-sm">{errors.installerName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Installer Signature</Label>
                <div className="border rounded-md p-2">
                  <SignaturePad
                    ref={installerSignatureRef}
                    onEnd={handleInstallerSignatureEnd}
                    canvasProps={{
                      className: 'w-full h-32 border rounded'
                    }}
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => clearSignature('installer')}
                    disabled={isLoading}
                  >
                    Clear
                  </Button>
                </div>
                {errors.installerSignature && <p className="text-red-500 text-sm">{errors.installerSignature}</p>}
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="installerContact">Installer Contact</Label>
                  <Input
                    id="installerContact"
                    name="installerContact"
                    type="tel"
                    className={errors.installerContact ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.installerContact && <p className="text-red-500 text-sm">{errors.installerContact}</p>}
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={() => {
              console.log('Button clicked - DEBUG');
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <span>Registering...</span>
              </div>
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 