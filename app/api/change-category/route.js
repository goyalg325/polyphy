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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await axios.put(
      `${BACKEND_URL}/api/update-category`,
      { title, category },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json({ message: 'Category updated successfully.' });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return NextResponse.json({ error: 'Page not found.' }, { status: 404 });
    } else {
      return NextResponse.json({ error: 'An error occurred while updating the category.' }, { status: 500 });
    }
  }
}
