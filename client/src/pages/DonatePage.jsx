import React, { useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { FaDonate } from "react-icons/fa";

const DonationPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({
    amount: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const { data } = await axiosClient.post(
        "/donations/create",
        {
          amount: form.amount,
          donorName: user?.name,
          donorEmail: user?.email,
          message: form.message,
        },
        { withCredentials: true }
      );

      const { orderId, amount, currency, donation } = data;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount,
          currency,
          name: "Donation",
          description: "Donation for a good cause",
          order_id: orderId,
          handler: async (response) => {
            await axiosClient.post(
              "/donations/update-status",
              {
                donationId: donation,
                paymentId: response.razorpay_payment_id,
                paymentStatus: "success",
              },
              { withCredentials: true }
            );
            setFeedback("✅ Thank you! Your donation was successful.");
            setForm({ amount: "", message: "" });
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: { color: "#3b82f6" },
          modal: {
            ondismiss: async () => {
              try {
                await axiosClient.post("/donations/update-status", {
                  donationId: donation,
                  paymentStatus: "Cancelled",
                });
                setFeedback("⚠️ You cancelled the donation.");
              } catch (err) {
                console.error("Error marking donation cancelled:", err);
              }
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (err) {
      console.error("Donation failed:", err);
      setFeedback("❌ Donation failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="relative w-full max-w-md bg-white/40 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <FaDonate className="text-blue-600 text-4xl mb-2" />
          <h2 className="text-3xl font-extrabold text-blue-800">
            Make a Donation
          </h2>
          <p className="text-gray-700 text-sm mt-2">
            Every contribution helps us make an impact.
          </p>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-4 text-sm font-medium text-center ${
              feedback.includes("✅")
                ? "text-green-700"
                : feedback.includes("⚠️")
                ? "text-yellow-700"
                : "text-red-600"
            }`}
          >
            {feedback}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleDonate} className="space-y-5">
          {/* Amount Field */}
          <div className="relative">
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder=" "
              required
              min="1"
              className="peer w-full p-3 bg-white/50 border border-gray-300 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
            />
            <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600">
              Amount (INR)
            </label>
          </div>

          {/* Message Field */}
          <div className="relative">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder=" "
              rows="3"
              className="peer w-full p-3 bg-white/50 border border-gray-300 rounded-xl text-gray-800 placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition"
            />
            <label className="absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-600">
              Message (Optional)
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !form.amount}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition duration-300"
          >
            {loading ? "Processing..." : "Donate Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationPage;
