'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';
import { useRouter } from 'next/navigation';
import PageManager from '../../components/PageManager';
import LogoutButton from '@/components/Buttons/LogoutButton/LogoutButton';
import PreviewModal from '../../components/PreviewModal';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import CreateUser from '@/components/CreateUser';
import ManageUsers from '@/components/ManageUsers';
import LoadingSpinner from '@/components/LoadingSpinner';
import CreateCategory from '@/components/CreateCategory';
import ChangePageCategory from '@/components/ChangePageCategory';
import DeleteCategory from '@/components/DeleteCategory';

const QuillEditor = dynamic(() => import('./QuillEditor'), { ssr: false });

const AdminPanel = () => {  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [pages, setPages] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showPageManager, setShowPageManager] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [userManagementOption, setUserManagementOption] = useState(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [categoryManagementOption, setCategoryManagementOption] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categorizedPages, setCategorizedPages] = useState({});
  const [pageCreationType, setPageCreationType] = useState('');
  const [isPageTypeDropdownOpen, setIsPageTypeDropdownOpen] = useState(false);
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories.');
      }
    };

    fetchCategories();
  }, []);
 
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const cookies = parseCookies();
        let token = cookies.token || localStorage.getItem('token');

        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('/api/user', {
          headers: { Authorization: `${token}` },
        });

        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        destroyCookie(null, 'token');
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get('/api/pages');
      setPages(response.data.data);
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    }
  };

  useEffect(() => {
    const fetchCategorizedPages = async () => {
      try {
        const pagesResponse = await axios.get(`/api/pagesByCategory`);
        const pages = pagesResponse.data.data;
        const filterPages = categories.reduce((acc, category) => {
          acc[category] = pages.filter((page) => page.category === category);
          return acc;
        }, {});
        setCategorizedPages(filterPages);
      } catch (error) {
        console.error("Error fetching categories and pages:", error);
      }
    };

    fetchCategorizedPages();
  }, []);

  const isTitleDisabled = () => {
    if (editMode) {
      return title === category || !pageCreationType;
    }
    return !pageCreationType;
  };

  const isCategoryDisabled = () => {
    if (editMode) {
      return title === category;
    }
    return !pageCreationType || pageCreationType === 'direct';
  };

  const isPageTypeDropdownDisabled = () => {
    return editMode && (title === category || title !== category);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value.replace(/\s+/g, '');
    setTitle(newTitle);
    
    if (pageCreationType === 'direct') {
      setCategory(newTitle);
    }
  
    if (e.target.value !== newTitle) {
      alert('Spaces are not allowed in the title field');
    }
  };

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (!user) {
    return <div>Not authorized. Redirecting...</div>;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = parseCookies().token || localStorage.getItem('token');
      const method = editMode ? 'put' : 'post';
      const url = editMode ? `/api/pages/${title}` : '/api/pages';

      const payload = editMode 
      ? { content, author: user.username, category, isLink } 
      : { title, content, author: user.username, category, isLink };

      const response = await axios[method](url, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`,
            },
      });

      if (response.data.success) {
        setTitle('');
        setContent('');
        setEditMode(false);
        fetchPages();
        alert(editMode ? 'Page updated successfully' : 'Page created successfully');
      } else {
          alert(editMode ? 'Failed to update page' : 'Failed to create page. Title might already exist.');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save page. Please try again.');
    }
  };

  const handleDelete = async (title) => {
    try {
      const token = parseCookies().token || localStorage.getItem('token');
      const response = await axios.delete(`/api/pages/${title}`, {
        headers: { Authorization: `${token}` },
      });
      if (response.data.success) {
        fetchPages();
      } else {
        alert('Failed to delete page.');
      }
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout', null, { withCredentials: true });
      destroyCookie(null, 'token');
      localStorage.removeItem('token');
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      alert('Failed to log out. Please try again.');
    }
  };  const handleEditPage = async (title) => {
    try {
      const response = await axios.get(`/api/pages/${title}`);
      if (response.data.success) {
        const page = response.data.data;
        setTitle(page.title);
        setCategory(page.category);
        setContent(page.content);
        
        // Set isLink value from the page data
        const pageIsLink = page.isLink || false;
        setIsLink(pageIsLink);
        
        // If it's a link page, close any open preview
        if (pageIsLink && isPreviewModalOpen) {
          setIsPreviewModalOpen(false);
        }
        
        setEditMode(true);
      } else {
        console.error('Failed to fetch page for editing:', response.data.message);
        alert('Failed to fetch page for editing.');
      }
    } catch (error) {
      console.error('Error occurred while fetching page for editing:', error);
      alert('An error occurred while fetching the page. Please try again.');
    }
  };
  const handlePreviewClick = () => {
    // Don't allow preview for link pages
    if (isLink) {
      return;
    }
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-full w-screen">
      <nav className={`w-full shadow-md z-50`}>
        <div className="flex flex-col md:flex-row justify-between w-full p-3">
          <div className="flex flex-col md:flex-row md:w-2/3">
            <div className="m-auto my-2 md:m-2 w-full md:w-auto relative">
              <div
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-pointer ${
                  isPageTypeDropdownDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={() => !isPageTypeDropdownDisabled() && setIsPageTypeDropdownOpen(!isPageTypeDropdownOpen)}
              >
                {pageCreationType === 'direct' 
                  ? 'Create Direct Page' 
                  : pageCreationType === 'category' 
                    ? 'Create in Category'
                    : 'Select Page Type'}
                <span className={`ml-2 transition-transform ${isPageTypeDropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              {isPageTypeDropdownOpen && !isPageTypeDropdownDisabled() && (
                <ul className="absolute z-10 bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <li
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg"
                    onClick={() => {
                      setPageCreationType('direct');
                      setIsPageTypeDropdownOpen(false);
                    }}
                  >
                    Create Direct Page
                  </li>
                  <li
                    className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg"
                    onClick={() => {
                      setPageCreationType('category');
                      setIsPageTypeDropdownOpen(false);
                    }}
                  >
                    Create in Category
                  </li>
                </ul>
              )}
            </div>

            <div className="m-auto my-2 md:m-2 w-full md:w-auto">
              <input
                type="text"
                id="Title"
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                  isTitleDisabled() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                placeholder="Title"
                value={title}
                onChange={handleTitleChange}
                disabled={isTitleDisabled()}
                required
              />
            </div>

            <div className="m-auto my-2 md:m-2 w-full md:w-auto relative">
              <div
                className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
                  isCategoryDisabled() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => !isCategoryDisabled() && setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              >
                {category || "Select a category"}
                <span className={`ml-2 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              {isCategoryDropdownOpen && !isCategoryDisabled() && (
                <ul className="absolute z-10 bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  {categories.map((cat, index) => (
                    <li
                      key={index}
                      className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded-lg"
                      onClick={() => {
                        setCategory(cat);
                        setIsCategoryDropdownOpen(false);
                      }}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="md:hidden m-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between w-full bg-blue-500 text-white rounded-md p-2"
            >
              Options
              <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </button>
          </div>
          <div className={`flex flex-col md:flex-row md:w-1/3 md:justify-end ${isOpen ? 'block' : 'hidden md:flex'}`}>
            <div className="m-2">
              <button
                type="button"
                onClick={() => setShowPageManager(!showPageManager)}
                className="focus:outline-none text-white bg-purple-400 hover:bg-purple-500 focus:ring-1 focus:ring-purple-300 w-full px-3 md:w-auto lg:w-36 text-sm h-10 rounded-md flex items-center justify-center"
              >
                Pages created
                {showPageManager ? (
                  <ChevronUpIcon className="h-5 w-5 ml-2" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 ml-2" />
                )}
              </button>
            </div>
            {user?.role === 'Admin' && (
             <div className="m-2 relative">
             <button
               type="button"
               onClick={() => {
                 if (showUserManagement || userManagementOption) {
                   setShowUserManagement(false);  // Close dropdown
                   setUserManagementOption(null); // Close the opened component
                 } else {
                   setShowUserManagement(true); // Open dropdown
                 }
               }}
               className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-1 focus:ring-yellow-300 w-full px-3 md:w-auto lg:w-36 text-sm h-10 rounded-md flex items-center justify-center"
             >
               Manage Users
               <ChevronDownIcon className={`h-5 w-5 ml-2 transition-transform ${showUserManagement ? 'transform rotate-180' : ''}`} />
             </button>
             {showUserManagement && (
               <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                 <button
                   onClick={() => {
                     setUserManagementOption('create');
                     setShowUserManagement(false); 
                   }}
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                 >
                   Create New User
                 </button>
                 <button
                   onClick={() => {
                     setUserManagementOption('manage');
                     setShowUserManagement(false); 
                   }}
                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                 >
                   Manage Existing Users
                 </button>
               </div>
             )}
           </div>
           
            
            )}

<div className="m-2 relative">
        <button
          type="button"
          onClick={() => {
            if (showCategoryManagement || categoryManagementOption) {
              setShowCategoryManagement(false); // Close dropdown
              setCategoryManagementOption(null); // Close the opened component
            } else {
              setShowCategoryManagement(true); // Open dropdown
            }
          }}
          className="focus:outline-none text-white bg-indigo-400 hover:bg-indigo-500 focus:ring-1 focus:ring-indigo-300 w-full px-3 md:w-auto lg:w-36 text-sm h-10 rounded-md flex items-center justify-center"
        >
          Manage Category
          <ChevronDownIcon className={`h-5 w-5 ml-2 transition-transform ${showCategoryManagement ? 'transform rotate-180' : ''}`} />
        </button>
        {showCategoryManagement && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                setCategoryManagementOption('create');
                setShowCategoryManagement(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Create New Category
            </button>
            <button
              onClick={() => {
                setCategoryManagementOption('change');
                setShowCategoryManagement(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Change Page Category
            </button>
            <button
              onClick={() => {
                setCategoryManagementOption('delete');
                setShowCategoryManagement(false);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              Delete Category
            </button>
          </div>
        )}
      </div>
            

            <div className="mx-auto my-2 md:m-2">
              <LogoutButton loading={loading} onClick={handleLogout} className="w-full md:w-auto" />
            </div>
          </div>
        </div>
      </nav>
      {userManagementOption === 'create' && <CreateUser className = 'w-full'/>}
      {userManagementOption === 'manage' && <ManageUsers className="w-full" />}
      {categoryManagementOption === 'create' && <CreateCategory className="w-full" />}
      {categoryManagementOption === 'change' && <ChangePageCategory className="w-full" />}
      {categoryManagementOption === 'delete' && <DeleteCategory className="w-full" />}


      <form onSubmit={handleSubmit} className="max-w-full w-screen">        <PageManager pages={pages} onEditPage={handleEditPage} onDeletePage={handleDelete} isVisible={showPageManager} />
          {/* Link toggle checkbox */}        <div className="w-92% mx-auto my-4 bg-gray-800 p-3 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center">            <input
              type="checkbox"
              id="isLink"
              checked={isLink}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setIsLink(isChecked);
                // If switching to link mode, close any open preview
                if (isChecked && isPreviewModalOpen) {
                  setIsPreviewModalOpen(false);
                }
              }}
              className="mr-2 h-5 w-5 text-blue-600"
            />
            <label htmlFor="isLink" className="text-white font-medium">
              External Link Page
            </label>
            {isLink && (
              <span className="ml-3 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                REDIRECT MODE
              </span>
            )}
          </div>
          {isLink && (
            <div className="mt-2 ml-7 p-3 bg-gray-700 rounded border-l-2 border-yellow-500">
              <p className="text-yellow-400 text-sm font-medium">
                ⚠️ This page will function as a redirect
              </p>
              <p className="text-gray-300 text-sm mt-1">
                When users visit this page, they will be immediately redirected to the URL you specify below.
                <br />No content will be displayed on your site.
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="hidden">Content</label>          <div style={{ width: "92%", margin: "0 auto" }}>            {isLink ? (
              <input
                type="url"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://example.com (full URL with https://)"
                className="w-full p-3 bg-gray-700 border border-blue-500 rounded-md text-white"
                required
              />
            ) : (
              <QuillEditor value={content} onChange={setContent} />
            )}
          </div>
        </div>
        <div className='flex-col md:flex-row justify-between w-full flex items-center p-2 '>
          <div className='flex-col md:flex-row  w-full flex items-center p-2 '>
        <button type="submit" className='mx-0.5 my-0.5 focus:outline-none bg-green-600 hover:bg-green-700 focus:ring-1 focus:ring-green-300 w-full px-3  lg:w-36 text-sm h-10 rounded-md '>{editMode ? 'Update Page' : 'Create Page'}</button>        {editMode && <button  className='mx-0.5 my-0.5 focus:outline-none bg-amber-700 hover:bg-amber-900 focus:ring-1 focus:ring-amber-300 w-full px-3 lg:w-36 text-sm h-10 rounded-md ' onClick={() => setEditMode(false)}>Cancel Edit</button>}
        </div>
       {!isPreviewModalOpen ? 
          <button 
            type="button" 
            className={`focus:outline-none ${isLink ? 'bg-gray-500 cursor-not-allowed' : 'bg-pink-700 hover:bg-pink-900'} focus:ring-1 focus:ring-pink-300 w-full px-3 lg:w-36 text-sm h-10 rounded-md`} 
            onClick={handlePreviewClick}
            disabled={isLink}
            title={isLink ? "Preview not available for link pages" : "Preview page"}
          >
            Preview
          </button> 
       :  <button type="button" onClick={handleClosePreview} className="focus:outline-none bg-indigo-700 hover:bg-indigo-900 focus:ring-1 focus:ring-indigo-300 w-full px-3 lg:w-36 text-sm h-10 rounded-md ">Close Preview</button>
     }
        </div>

      </form>
       {isPreviewModalOpen && (
  <>
    
    <div className="relative w-full">
  
      <div className="w-full border-t border-white mb-4" style={{ borderColor: 'white' }}></div>
      
     
      <PreviewModal
        className="w-full"
        content={content}
      />
    </div>
  </>
)}

      </div>
  );
};

export default AdminPanel;
