import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminDash() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("/api/auth/admin/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const editUser = async () => {};

  return (
    <div className="overflow-x-auto mx-4">
      <h1 className="text-3xl text-center font-semibold my-7">
        Admin Dashboard
      </h1>
      <div className="flex justify-end">
        <Link
          to="/admin/add-user"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5 mr-5"
        >
          Add New User
        </Link>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <table className="table-auto w-full border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-400">Name</th>
            <th className="px-4 py-2 border border-gray-400">Email</th>
            <th className="px-4 py-2 border border-gray-400">Profile Image</th>
            <th className="px-4 py-2 border border-gray-400">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
              </td>
              <td className="border px-4 py-2">
                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2">
                  Delete
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
