import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategoriesList(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        alert('An error occurred while fetching categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this category? All pages within this category will also be deleted.')) {
      try {
        // Fetch pages in the selected category
        const response = await axios.get('/api/pagesByCategory');
        const pages = response.data.data;
        if (Array.isArray(pages)) {
          const pagesToDelete = pages.filter(page => page.category === selectedCategory);

          // Delete pages one by one
          for (const page of pagesToDelete) {
            await axios.delete(`/api/pages/${page.title}`);
          }

          // Call the delete-category API
          await axios.delete('/api/categories', { data: { category: selectedCategory } });

          // Update the local state
          setCategoriesList(categoriesList.filter(cat => cat !== selectedCategory));
          setSelectedCategory('');
          alert(`Category ${selectedCategory} and its pages have been deleted successfully.`);
        } else {
          console.error('Unexpected data format:', pages);
          alert('An error occurred: unexpected data format.');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('An error occurred while deleting the category.');
      }
    }
  };

  return (
    <div className='w-full max-w-[250px] space-y-4 m-3'>
      <div className='flex justify-center'><h2>Delete Category</h2></div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="category-dropdown" className='hidden'>Select Category:</label>
        <select
          id="category-dropdown"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className='bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer'
        >
          <option value="">Select a category</option>
          {categoriesList.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className='flex justify-center'>
        <button
          onClick={handleDelete}
          disabled={!selectedCategory}
          className='focus:outline-none text-white bg-red-400 hover:bg-red-500 focus:ring-1 focus:ring-red-300 w-full px-3 md:w-auto lg:w-36 text-sm h-10 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Delete Category
        </button>
      </div>
    </div>
  );
};

export default DeleteCategory;