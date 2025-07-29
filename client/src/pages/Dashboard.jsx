import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { FaHeart, FaCheckCircle, FaClock, FaTimesCircle, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await axiosClient.get('/donations/my-donations', {
          withCredentials: true,
        });
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setDonations(sorted);
      } catch (err) {
        console.error('Failed to fetch donations', err);
        setError('Failed to fetch donations');
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const getStatusText = (status) => {
    const s = status?.toLowerCase();
    if (s === 'completed' || status === 'success') return 'Completed';
    if (s === 'pending') return 'Pending';
    return 'Failed';
  };

  const generateReceipt = (donation) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Donation Receipt', 14, 20);

    doc.setFontSize(12);
    doc.autoTable({
      startY: 30,
      theme: 'grid',
      head: [['Field', 'Details']],
      body: [
        ['Donor Name', donation.donorName || user.name],
        ['Email', donation.donorEmail || user.email],
        ['Amount', `₹${donation.amount}`],
        ['Date', new Date(donation.createdAt).toLocaleString()],
        ['Status', getStatusText(donation.paymentStatus)],
        ['Message', donation.message || '-'],
      ],
    });

    doc.save(`receipt-${donation._id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      <div className="max-w-6xl mx-auto bg-white/40 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8">
        <h1 className="text-3xl font-extrabold text-blue-800 mb-3">
          {user ? `Welcome, ${user.name}` : 'Welcome to your Dashboard'}
        </h1>
        <p className="text-gray-700 mb-6">
          Track your impact and view your donation history below.
        </p>

        <div className="border-t border-white/40 pt-6">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
            <FaHeart className="text-pink-500" /> Your Donations
          </h2>

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-28 bg-white/50 backdrop-blur-md rounded-xl animate-pulse"
                />
              ))}
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          {!loading && !error && donations.length === 0 && (
            <p className="text-sm text-gray-600">
              You haven't made any donations yet.
            </p>
          )}

          {!loading && !error && donations.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white/60 backdrop-blur border border-white/30 rounded-xl shadow">
                <thead>
                  <tr className="text-left bg-blue-100 text-blue-800">
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Date</th>
                    <th className="py-2 px-4">Message</th>
                    <th className="py-2 px-4">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr key={donation._id} className="border-t border-white/30">
                      <td className="py-2 px-4 font-semibold text-green-700">
                        ₹{donation.amount}
                      </td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                          donation.paymentStatus === 'completed' || donation.paymentStatus === 'success'
                            ? 'bg-green-100 text-green-700'
                            : donation.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {donation.paymentStatus === 'completed' || donation.paymentStatus === 'success' ? (
                            <FaCheckCircle />
                          ) : donation.paymentStatus === 'pending' ? (
                            <FaClock />
                          ) : (
                            <FaTimesCircle />
                          )}
                          {getStatusText(donation.paymentStatus)}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-sm text-gray-600">
                        {new Date(donation.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 italic text-gray-700">
                        {donation.message || '-'}
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => generateReceipt(donation)}
                          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium text-sm"
                        >
                          <FaFilePdf /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
