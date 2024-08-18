import axios from 'axios';

export async function GET(req) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`);
    const categories = response.data;

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(req) {
    try {
      const body = await req.json(); // Extract JSON body
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
        category: body.categoryName,
      });
  
      return new Response(JSON.stringify({ success: true, data: response.data }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error adding category:', error);
      return new Response(JSON.stringify({ success: false, error: 'Failed to add category' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  

  export async function DELETE(req) {
    try {
      const body = await req.json(); // Extract JSON body
      const { category } = body;
  
      // Make sure the body contains the category
      if (!category) {
        return new Response(JSON.stringify({ error: 'Category is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      // Call the backend to delete the category
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`, {
        headers: { 'Content-Type': 'application/json' },
        data: { category } // Axios allows sending data in DELETE request
      });
  
      return new Response(JSON.stringify(response.data), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      return new Response(JSON.stringify({ error: 'Failed to delete category' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }