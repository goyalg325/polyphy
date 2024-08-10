import { NextResponse } from 'next/server';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
      username: username.trim(),
      password
    });

    if (response.status === 200) {
      const { message, access_token } = response.data;

      // const token = jwt.sign(
      //   { username: user.username, role: user.role },
      //   JWT_SECRET,
      //   { expiresIn: '1d' }
      // );

      const res = NextResponse.json({ access_token, message: 'Login successful' });
      res.cookies.set('token', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 86400,
        path: '/',
      });

      return res;
    } else {
      return NextResponse.json({ message: 'Invalid Credentials' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error:', error);

    if (error.response) {
      if (error.response.status === 400) {
        return NextResponse.json({ error: error.response.data.errors }, { status: 400 });
      } else if (error.response.status === 500) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
