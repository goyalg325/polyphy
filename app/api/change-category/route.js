import { NextResponse } from 'next/server';
import axios from 'axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function POST(request) {
  try {
    const { title, category } = await request.json();

    if (!title || !category) {
      return NextResponse.json({ error: 'Title and category are required.' }, { status: 400 });
    }

    const token = request.cookies.get('token')?.value.split(' ')[1];

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await axios.put(
      `${BACKEND_URL}/api/update-category`,
      { title, category },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json({ success: true, message: 'Category updated successfully.' });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return NextResponse.json({ success: false, error: 'Page not found.' }, { status: 404 });
    } else {
      return NextResponse.json({ success: false, error: 'An error occurred while updating the category.' }, { status: 500 });
    }
  }
}
