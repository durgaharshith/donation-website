import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../features/authSlice";
import axiosClient from "../utils/axiosClient";
import { FiMenu, FiX } from "react-icons/fi";

const NavBar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await axiosClient.get("/auth/logout");
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide hover:scale-105 transition-transform"
          >
            Donate<span className="text-blue-200">Now</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-base font-medium">
            <Link
              to="/"
              className="hover:text-blue-100 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/donate"
              className="hover:text-blue-100 transition-colors duration-200"
            >
              Donate
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-100 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="hover:text-blue-100 transition-colors duration-200"
                >
                  Profile
                </Link>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="hover:text-blue-100 transition-colors duration-200"
                  >
                    Admin
                  </Link>
                )}


                <button
                  onClick={handleLogout}
                  className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-white text-blue-700 px-4 py-2 rounded-lg shadow hover:shadow-md hover:scale-105 transition-all"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white text-2xl focus:outline-none"
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-blue-500/95 backdrop-blur-md shadow-inner px-4 py-4 space-y-4 text-base font-medium">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-100"
          >
            Home
          </Link>
          <Link
            to="/donate"
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-100"
          >
            Donate
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block hover:text-blue-100"
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block hover:text-blue-100"
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block bg-white text-blue-700 px-4 py-2 rounded-lg shadow hover:shadow-md transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
