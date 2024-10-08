import axios from 'axios';
import { NextResponse } from 'next/server';

export const revalidate = 0;
export async function GET(request) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pagesByCategory`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Response from backend:", response.data);
    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch pages', error: error.message }, { status: 500 });
  }
}
