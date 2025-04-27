import { NextResponse } from 'next/server';

// Get all pincodes or location details by pincode
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');
    
    // Get the API URL from environment variable or use a default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Determine which endpoint to call based on parameters
    let endpoint = '/api/location-codes/pincodes';
    if (pincode) {
      endpoint = `/api/location-codes/location/${pincode}`;
    }
    
    // Forward the request to the backend
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch location data' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching location data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location data' },
      { status: 500 }
    );
  }
}

// Generate customer ID
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Get the API URL from environment variable or use a default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    // Forward the request to the backend
    const response = await fetch(`${apiUrl}/api/location-codes/generate-customer-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to generate customer ID' },
        { status: response.status }
      );
    }
    
    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating customer ID:', error);
    return NextResponse.json(
      { error: 'Failed to generate customer ID' },
      { status: 500 }
    );
  }
} 