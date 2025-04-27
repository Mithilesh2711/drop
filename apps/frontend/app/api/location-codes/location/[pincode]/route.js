import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { pincode } = params;
    console.log('Frontend location API route: Fetching location for pincode:', pincode);
    
    // Get the API URL from environment variable or use a default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Backend API URL:', apiUrl);
    
    // Forward the request to the backend
    const response = await fetch(`${apiUrl}/api/location-codes/location/${pincode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Backend response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend returned error:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to fetch location details' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Backend location data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching location details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location details' },
      { status: 500 }
    );
  }
} 