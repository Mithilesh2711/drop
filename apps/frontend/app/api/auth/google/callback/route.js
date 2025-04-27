import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Exchange the code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/auth/callback',
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Google token error:', errorData);
      
      // Check if this is a verification error
      if (errorData.error === 'access_denied' && 
          errorData.error_description && 
          errorData.error_description.includes('verification')) {
        return NextResponse.json(
          { error: 'Google verification required. This app is in testing mode.' },
          { status: 403 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to exchange code for tokens' },
        { status: tokenResponse.status }
      );
    }

    const tokens = await tokenResponse.json();
    
    // Add expiration timestamp
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);
    
    return NextResponse.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Error in Google callback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 