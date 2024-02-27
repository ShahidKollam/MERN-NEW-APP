import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import AddUser from "./pages/AddUser";
import AdminDashboard from "./pages/AdminDash"
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import EditUser from "./pages/EditUser";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="/admin/signin" element={<SignIn userType="admin" />} />
        
        
        <Route element={<PrivateRoute userType="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>


        <Route path="/admin/add-user" element={<AddUser />} />
        <Route path="/admin/edit-user/:user_id" element={<EditUser />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
