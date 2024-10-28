import { useState, useEffect } from 'react';
import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';

export default function ManageUsers({ className }) {
  const [users, setUsers] = useState([]);
  const [curruser, setCurrUser] = useState([]);
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const cookies = parseCookies();
        let token = cookies.token || localStorage.getItem('token');

        if (!token) {
          return;
        }

        const response = await axios.get('/api/user', {
          headers: { Authorization: `${token}` },
        });

        setCurrUser(response.data);
    
      } catch (error) {
        console.error('Failed to fetch user:', error);
        destroyCookie(null, 'token');
        localStorage.removeItem('token');
      }
    };

    fetchUser();
  }, []);

  async function deleteUser(username) {
    try {
      await axios.delete('/api/manage-users', { data: { username } });
      // Update the local state by removing the deleted user
      setUsers(users.filter(user => user.username !== username));
    } catch (err) {
      setError('Error deleting user');
    }
  }

  async function handleUpdateRole(username, currentRole) {
    const newRole = currentRole === 'Admin' ? 'Editor' : 'Admin';

    try {
      const response = await axios.put('/api/manage-users', { username, role: newRole });
      if (response.status === 200) {
        // Update the user's role in the local state
        setUsers(users.map(user =>
          user.username === username ? { ...user, role: newRole } : user
        ));
      } else {
        setError(response.data.error || 'Error updating role');
      }
    } catch (err) {
      setError('Error updating role');
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
              key={user.username !== curruser?.username ? user.username : 'You'}
              className={`p-4 border rounded-lg shadow-sm ${user.username === curruser?.username ? 'bg-teal-900' : 'bg-teal-600'} flex flex-col lg:flex-row lg:justify-between lg:items-center`}
            >
              <div className="flex-1 flex items-center space-x-2">
                <span className="truncate max-w-xs text-lg font-medium" title={user.username !== curruser?.username ? user.username : 'You'}>
                  {user.username !== curruser?.username ? user.username : 'You'}
                </span>
                <span className="text-sm text-white">({user.role})</span>
              </div>
              <button
                onClick={user.username !== curruser?.username ? () => handleUpdateRole(user.username, user.role) : null}
                className="lg:mx-2 mt-4 lg:mt-0 focus:outline-none bg-black hover:bg-gray-800 focus:ring-1 focus:ring-rose-300 w-full px-3 lg:w-36 text-sm h-10 rounded-md"
                disabled={user.username === curruser?.username}
              >
                Change to {user.role === 'Admin' ? 'Editor' : 'Admin'}
              </button>
              <button
                onClick={user.username !== curruser?.username ? () => deleteUser(user.username) : null}
                className="mt-4 lg:mt-0 focus:outline-none bg-rose-600 hover:bg-rose-800 focus:ring-1 focus:ring-rose-300 w-full px-3 lg:w-36 text-sm h-10 rounded-md"
                disabled={user.username === curruser?.username}
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
