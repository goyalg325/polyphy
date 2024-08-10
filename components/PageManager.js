import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const PageManager = ({ pages, onEditPage, onDeletePage, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full bg-black shadow-md rounded-lg overflow-hidden mb-4">
      <table className="w-full divide-y divide-gray-200 table-fixed"> {/* Changed to table-fixed */}
        <thead className="bg-rose-600">
          <tr>
            <th className="px-1 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th> {/* Reduced padding */}
            <th className="px-1 py-2 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th> {/* Reduced padding */}
          </tr>
        </thead>
        <tbody className="bg-teal-600 divide-y divide-gray-200">
          {pages.map((page) => (
            <tr key={page.title}>
              <td className="px-1 py-3 text-sm font-medium text-white break-words"> {/* Added break-words */}
                {page.title}
              </td>
              
              <td className="px-1 py-3 text-right text-sm font-medium flex justify-end space-x-2"> {/* Flexbox for buttons */}
                <button
                  type="button"
                  onClick={() => onEditPage(page.title)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <PencilIcon className="h-5 w-5" />
                  <span className="sr-only">Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeletePage(page.title)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                  <span className="sr-only">Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PageManager;
