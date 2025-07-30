import React, { useState } from "react";
import axiosClient from "../utils/axiosClient";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const LoginPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axiosClient.post("/auth/login", form);
      dispatch(setUser(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleSignin = () => {
  window.open(`${import.meta.env.VITE_API_BASE_URL}/auth/google?intent=signin`, "_self");
};

const handleGoogleLogin = () => {
  window.open(`${import.meta.env.VITE_API_BASE_URL}/auth/google?intent=login`, "_self");
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="relative w-full max-w-md bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Toggle Tabs */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setMode("login")}
            className={`px-4 py-2 rounded-xl font-semibold shadow-md transition-all duration-300 ${
              mode === "login"
                ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white scale-105 shadow-lg"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signin")}
            className={`px-4 py-2 rounded-xl font-semibold shadow-md transition-all duration-300 ${
              mode === "signin"
                ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white scale-105 shadow-lg"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center">
          {mode === "login"
            ? "🔐 Use your email and password or sign in with Google."
            : "🆕 Sign up instantly using your Google account."}
        </p>

        <h1 className="text-3xl font-extrabold text-center text-blue-800">
          {mode === "login" ? "Login to Donate" : "Create an Account"}
        </h1>

        {/* Error */}
        {error && (
          <div className="text-center text-sm mt-2 text-red-600 animate-pulse">
            <p>{error}</p>
            {error === "This account does not have a manual login setup." && (
              <button
                onClick={handleGoogleLogin}
                className="mt-2 text-blue-600 underline hover:text-blue-800 transition"
              >
                👉 Continue with Google instead
              </button>
            )}
          </div>
        )}

        {/* Manual Login */}
        {mode === "login" && (
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
                placeholder=" "
                required
                className="peer w-full p-3 bg-white/50 border border-gray-300 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
              />
              <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleInputChange}
                placeholder=" "
                required
                className="peer w-full p-3 bg-white/50 border border-gray-300 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
              />
              <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600">
                Password
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300"
            >
              Login
            </button>
          </form>
        )}

        {/* Google Auth */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={mode === "signin" ? handleGoogleSignin : handleGoogleLogin}
            className="w-full flex justify-center items-center gap-3 py-3 px-4 bg-white border border-gray-300 rounded-xl shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <FaGoogle className="text-red-500 text-lg" />
            <span className="text-gray-700 font-medium">
              {mode === "signin"
                ? "Sign up with Google"
                : "Sign in with Google"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
