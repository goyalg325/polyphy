import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { categoryName } = await request.json();

    if (!categoryName) {
      return NextResponse.json({ success: false, message: 'Category name is required.' }, { status: 400 });
    }

    const categoriesFilePath = path.resolve(process.cwd(), 'categories.js');
    const categoriesFileContent = fs.readFileSync(categoriesFilePath, 'utf-8');
    
    // Evaluate the content of categories.js to retrieve the array
    let categories = eval(categoriesFileContent.replace('export default', ''));

    if (categories.includes(categoryName)) {
      return NextResponse.json({ success: false, message: 'Category already exists.' }, { status: 400 });
    }

    // Append the new category to the array
    categories.push(categoryName);

    // Write the updated array back to the file
    const newCategoriesContent = `const categories = ${JSON.stringify(categories, null, 2)};\n\nexport default categories;`;
    fs.writeFileSync(categoriesFilePath, newCategoriesContent);

    return NextResponse.json({ success: true, message: 'Category created successfully.' });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, message: 'An error occurred while creating the category.' }, { status: 500 });
  }
}
