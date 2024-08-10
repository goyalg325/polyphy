import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ManageUsers({ className }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/manage-users');
        setUsers(response.data);
      } catch (err) {
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  async function deleteUser(username) {
    try {
      await axios.delete(`/api/manage-users`, { data: { username } });
      setUsers(users.filter(user => user.username !== username));
    } catch (err) {
      setError('Error deleting user');
    }
  }

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={`${className} p-4`}>
      <h2 className="text-xl font-bold mb-4">Manage Existing Users</h2>
      {users.length > 0 ? (
        <ul className="space-y-4">
          {users.map(user => (
            <li
              key={user.username}
              className="p-4 border rounded-lg shadow-sm bg-teal-600 flex flex-col lg:flex-row lg:justify-between lg:items-center"
            >
              <div className="flex-1 flex items-center space-x-2">
                <span className="truncate max-w-xs text-lg font-medium" title={user.username}>
                  {user.username}
                </span>
                <span className="text-sm text-white">({user.role})</span>
              </div>
              <button
                onClick={() => deleteUser(user.username)}
                className="mt-4 lg:mt-0 focus:outline-none bg-rose-600 hover:bg-rose-800 focus:ring-1 focus:ring-rose-300 w-full px-3 lg:w-36 text-sm h-10 rounded-md "
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
}
