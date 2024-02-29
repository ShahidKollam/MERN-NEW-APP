import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure } from "../redux/user/userSlice";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { error } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Clear the error message for the field when it's changed
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Basic validation checks for each field
    if (!formData.username) {
      newErrors.username = "Username is required";
      valid = false;
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    // Set errors if any field is invalid
    if (!valid) {
      setErrors(newErrors);
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const res = await fetch("/api/auth/admin/addUser", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      setLoading(false);

      if (data.success === false) {
        setErrors({ message: data.message });
        return;
      }

      navigate("/admin/dashboard");
    } catch (error) {
      setLoading(false);
      setErrors({ message: "Something went wrong" });
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className=" text-3xl text-center font-semibold my-7">
        Add New User
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={handleChange}
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg"
        />
        {errors.username && (
          <p className="text-red-500">{errors.username}</p>
        )}
        <input
          onChange={handleChange}
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
        <input
          onChange={handleChange}
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password}</p>
        )}
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Add User"}
        </button>
      </form>

      <p className="text-red-500 mt-5">
        {errors.message || error || " "}
      </p>
    </div>
  );
}
