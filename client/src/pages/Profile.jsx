import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaUserCircle, FaRegCopy, FaCheckCircle } from "react-icons/fa";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const res = await fetch("http://localhost:5000/api/users/set-password", {
        method: "POST",
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("✅ Password set successfully!");
      } else {
        setStatus(`❌ ${data.message || "Failed to set password"}`);
      }
    } catch (err) {
      setStatus("❌ An error occurred while setting the password");
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user?.email || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="w-full max-w-xl bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {user?.profilePic ? (
            <img
              src={user?.profilePic}
              alt={user?.name}
              className="w-24 h-24 rounded-full shadow-lg border-2 border-blue-300 object-cover"
            />
          ) : (
            <FaUserCircle className="text-blue-500 text-6xl" />
          )}
          <div className="text-center sm:text-left">
            <p className="text-2xl font-bold text-blue-800">{user?.name}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
              <span className="text-gray-600 text-sm">{user?.email}</span>
              <button
                onClick={handleCopyEmail}
                className="text-blue-500 hover:text-blue-700 transition"
                title="Copy email"
              >
                {copied ? (
                  <FaCheckCircle className="text-green-500 text-sm" />
                ) : (
                  <FaRegCopy />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Password Setup Section */}
        {!user?.password ? (
          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-4 bg-white/30 rounded-xl p-6 shadow-md"
          >
            <h3 className="text-lg font-semibold text-blue-700">
              🔐 Set a Manual Login Password
            </h3>
            <input
              type="password"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300 bg-white/50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
              required
            />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300"
            >
              Save Password
            </button>
            {status && (
              <p
                className={`text-sm mt-2 text-center ${
                  status.includes("✅")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {status}
              </p>
            )}
          </form>
        ) : (
          <p className="text-sm text-gray-600 text-center">
            ✅ You already have a password set.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;
