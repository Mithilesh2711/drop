import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    console.log('Next.js API route: Registration request received');
    const data = await request.json();
    console.log('Request data:', data);
    
    // Add a default password if not provided
    if (!data.password) {
      data.password = 'defaultPassword123'; // This should be changed by the user later
      console.log('Default password added');
    }
    
    // Ensure role is set to 'user'
    data.role = 'user';
    
    // Get the API URL from environment variable or use a default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    console.log('Backend API URL:', apiUrl);
    
    // Forward the request to the backend
    console.log('Sending request to backend...');
    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
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
        { error: result.message || 'Registration failed' },
        { status: response.status }
      );
    }
    
    // --- CREATE TRANSACTION HERE ---
    try {
      const user = result.user || result.data || result; // adjust as needed
      const transactionPayload = {
        customerId: user.customerId || user._id || user.id,
        name: user.name,
        date: new Date().toISOString(),
        planName: "Default Plan",
        receipt: [
          { headName: "Security Deposit", headAmount: 0 },
          { headName: "Rent", headAmount: 0 }
        ],
        totalPaidAmount: 0,
        totalPayableAmount: 0,
        paymentDetails: {
          paymentMode: "N/A",
          refNo: "N/A"
        },
        email: user.email || "",
        mobile: user.mobile
      };

      await fetch(`${apiUrl}/api/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionPayload),
        duplex: 'half'
      });
    } catch (txnError) {
      console.error('Failed to create transaction after registration:', txnError);
    }
    // --- END TRANSACTION CREATION ---

    console.log('Registration successful, returning response');
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Registration error in Next.js API route:', error);
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
} 