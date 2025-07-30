// client/src/App.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "./features/authSlice.js";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import DonationPage from "./pages/DonatePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import axiosClient from "./utils/axiosClient.js";
import GoogleRedirectHandler from "./pages/GoogleRedirectHandler.jsx";

function App() {
  const user = useSelector((state) => state.auth.user);
  const authLoaded = useSelector((state) => state.auth.authLoaded);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await axiosClient.get("/auth/current-user");
        if (res.data) {
          dispatch(setUser(res.data));
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        dispatch(clearUser());
      }
    };
    fetchCurrentUser();
  }, [dispatch]);

  if (!authLoaded) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/google-redirect" element={<GoogleRedirectHandler />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/donate" element={user ? <DonationPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && user.role === "admin" ? <AdminPage /> : <Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
