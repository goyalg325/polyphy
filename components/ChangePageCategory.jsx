import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChangePageCategory = () => {
  const [pageTitle, setPageTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch categories when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);  // Ensure this matches the data structure from the API
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = async () => {
    setMessage('');
    setError('');

    // Client-side validation
    if (!pageTitle || !selectedCategory) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('/api/change-category', {
        title: pageTitle,
        category: selectedCategory,
      });

      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setError(response.data.error || 'An error occurred.');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Page not found.');
      } else {
        setError('An error occurred while changing the category.');
      }
    }
  };

  return (
    <div className="flex flex-col items-start space-y-4 p-6">
      <h2 className="text-xl font-bold mb-4">Change Page Category</h2>

      <div className="w-full">
        <label htmlFor="pageTitle" className="block font-semibold mb-2">Page Title:</label>
        <input
          id="pageTitle"
          type="text"
          value={pageTitle}
          onChange={(e) => setPageTitle(e.target.value)}
          className="bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter page title"
        />
      </div>

      <div className="w-full">
        <label htmlFor="category" className="block font-semibold mb-2">Select Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="" disabled>Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className='w-full flex justify-center'>
        <button
          onClick={handleCategoryChange}
          className="focus:outline-none text-white bg-orange-400 hover:bg-orange-500 focus:ring-1 focus:ring-orange-300 w-full px-3 md:w-auto lg:w-50 text-sm h-10 rounded-md flex items-center justify-center"
        >
          Change Category
        </button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
};

export default ChangePageCategory;
