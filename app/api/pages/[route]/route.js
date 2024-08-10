import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to get the token and route from the request
const getRequestDetails = (request, params) => {
  const token = request.cookies.get('token')?.value || '';
  const { route } = params;
  console.log(`Route parameter: ${route}`);
  return { token, route };
};

export async function GET(request, { params }) {
  try {
    const { route } = getRequestDetails(request, params);

    if (!route) {
      return NextResponse.json({ success: false, message: 'Route is required' }, { status: 400 });
    }

    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages/${route}`, {
     
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error fetching page:', error);
    if (error.response && error.response.status === 404) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to fetch page', error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { token, route } = getRequestDetails(request, params);

    if (!route) {
      return NextResponse.json({ success: false, message: 'Route is required' }, { status: 400 });
    }

    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages/${route}`, {
      headers: {
        'Authorization': `${token}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    if (error.response && error.response.status === 404) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to delete page', error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { token, route } = getRequestDetails(request, params);

    if (!route) {
      return NextResponse.json({ success: false, message: 'Route is required' }, { status: 400 });
    }

    const { content, author, category } = await request.json();

    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pages/${route}`, {
      content, author, category
    }, {
      headers: {
        'Authorization': `${token}`,
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error updating page:', error);
    if (error.response && error.response.status === 404) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, message: 'Failed to update page', error: error.message }, { status: 500 });
  }
}