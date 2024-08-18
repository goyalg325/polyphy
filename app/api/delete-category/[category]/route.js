import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request, { params }) {
  try {
    const { category } = params;

    // Path to your categories.js file
    const categoriesPath = path.resolve(process.cwd(), 'categories.js');

    // Read the categories file as a string
    const categoriesFile = fs.readFileSync(categoriesPath, 'utf8');

    // Use a regular expression to extract the categories array
    const match = categoriesFile.match(/const categories = (\[.*?\]);/s);
    if (!match) {
      throw new Error('Failed to extract categories array from file.');
    }

    const categories = eval(match[1]); // This converts the string to an actual array

    // Filter out the category to be deleted
    const updatedCategories = categories.filter(cat => cat !== category);

    // Write the updated categories back to the file
    const fileContent = `const categories = ${JSON.stringify(updatedCategories, null, 2)};\n\nexport default categories;\n`;
    fs.writeFileSync(categoriesPath, fileContent);

    return NextResponse.json({ success: true, message: `Category ${category} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete category.', error: error.message }, { status: 500 });
  }
}
