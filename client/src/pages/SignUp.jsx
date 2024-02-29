import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [backendError, setBackendError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: '' }); // Clear the error message when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setLoading(false);
      const data = await res.json();


      if (!res.ok) {
        console.log(data);
        setBackendError(data.message); // Set the backend error message
        throw new Error('Failed to sign up');
      }

      navigate('/sign-in');

    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleChange}
          type="text"
          placeholder="Username"
          id="username"
          className={`bg-slate-100 p-3 rounded-lg ${errors.username ? 'border border-red-500' : ''}`}
        />
        {errors.username && <p className="text-red-500">{errors.username}</p>}
        
        <input
          onChange={handleChange}
          type="email"
          placeholder="Email"
          id="email"
          className={`bg-slate-100 p-3 rounded-lg ${errors.email ? 'border border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        
        <input
          onChange={handleChange}
          type="password"
          placeholder="Password"
          id="password"
          className={`bg-slate-100 p-3 rounded-lg ${errors.password ? 'border border-red-500' : ''}`}
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
        
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign in</span>{" "}
        </Link>
      </div>
      
      {backendError && <p className="text-red-500 mt-5">{backendError}</p>} {/* Display backend error message */}
    </div>
  );
}
