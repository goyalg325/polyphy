import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function GET(request) {
  const cookieToken = request.cookies.get('token')?.value.split(' ')[1];
  const headerToken = request.headers.get('Authorization')?.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the JWT token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    
    // Check if the user is an admin
    if (payload.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const response = await axios.get(`${BACKEND_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const cookieToken = request.cookies.get('token')?.value.split(' ')[1];
  const headerToken = request.headers.get('Authorization')?.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the JWT token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    
    // Check if the user is an admin
    if (payload.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { username } = await request.json();
    await axios.delete(`${BACKEND_URL}/api/users/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}

export async function PUT(request) {
  const cookieToken = request.cookies.get('token')?.value.split(' ')[1];
  const headerToken = request.headers.get('Authorization')?.split(' ')[1];
  const token = cookieToken || headerToken;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the JWT token
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    
    // Check if the user is an admin
    if (payload.role !== 'Admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { username, role } = await request.json();

    if (!username || !role) {
      return NextResponse.json({ error: 'Username and role are required' }, { status: 400 });
    }

    // Check if the role is valid (Admin or Editor)
    if (role !== 'Admin' && role !== 'Editor') {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const response = await axios.put(`${BACKEND_URL}/api/update-user-role`, {
      username,
      role,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json({ message: 'User role updated successfully' }, { status: response.status });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Error updating user role' }, { status: error.response?.status || 500 });
  }
}
