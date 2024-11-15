import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(request) {
  const cookieToken = request.cookies.get('token')?.value.split(' ')[1];
  const headerToken = request.headers.get('Authorization')?.split(' ')[1];
  const token = cookieToken || headerToken;
  
  console.log(`Extracted token: ${token}`);

  if (!token) {
    console.error('Token not found');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    console.log('Token verification successful:', payload);
    return NextResponse.json({ username: payload.username, role: payload.role });
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

export async function POST(request) {
  const { username, password, password_confirmation, role } = await request.json();
  const token = request.cookies.get('token')?.value.split(' ')[1] || request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    
    if (payload.role !== 'Admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Add authorization header to the axios request
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, 
      {
        username: username.trim(),
        password,
        password_confirmation,
        role
      },
      {
        headers: {
          'Authorization': `Bearer ${token}` // Forward the token to the backend
        }
      }
    );

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error.response && error.response.data && error.response.data.errors) {
      const firstErrorField = Object.keys(error.response.data.errors)[0];
      const firstErrorMessage = error.response.data.errors[firstErrorField];
      return NextResponse.json({ message: firstErrorMessage }, { status: 400 });
    }
    
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}