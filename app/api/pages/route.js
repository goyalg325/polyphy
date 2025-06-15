import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value || ''
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/pages`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch pages', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
     const token = request.cookies.get('token')?.value || ''
    const { title, content, author, category, isLink } = await request.json();
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages`, {
      title, content, author, category, isLink
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
    });

    return NextResponse.json({ success: true, data: response.data }, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ success: false, message: 'Failed to create page', error: error.message }, { status: 500 });
  }
}
