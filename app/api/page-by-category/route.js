import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api//pagesByCategory`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch pages', error: error.message }, { status: 500 });
  }
}
