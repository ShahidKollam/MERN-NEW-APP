import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDash() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from backend when the component mounts
    async function fetchUsers() {
      try {
        const response = await axios.get('/api/auth/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Users List</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Additional admin functionalities can be added here */}
    </div>
  );
}
