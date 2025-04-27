import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Next.js API route: File upload request received');
    
    // Get the API URL from environment variable or use a default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Backend API URL:', apiUrl);
    
    // Get the form data from the request
    const formData = await request.formData();
    console.log('Form data received:', formData);
    
    // Add a parameter to indicate that ACLs should not be used
    formData.append('noAcl', 'true');
    
    // Forward the request to the backend
    console.log('Sending request to backend...');
    const response = await fetch(`${apiUrl}/api/upload`, {
      method: 'POST',
      body: formData,
      duplex: 'half'
    });
    
    console.log('Backend response status:', response.status);
    
    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Backend returned non-JSON response:', contentType);
      return NextResponse.json(
        { error: 'Backend server returned an invalid response. Please try again later.' },
        { status: 502 }
      );
    }
    
    // Try to parse the JSON response
    let result;
    try {
      result = await response.json();
      console.log('Backend response data:', result);
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      return NextResponse.json(
        { error: 'Backend server returned an invalid JSON response. Please try again later.' },
        { status: 502 }
      );
    }
    
    if (!response.ok) {
      console.error('Backend returned error:', result);
      return NextResponse.json(
        { error: result.error || 'Upload failed' },
        { status: response.status }
      );
    }
    
    console.log('Upload successful, returning response');
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Upload error in Next.js API route:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
} 